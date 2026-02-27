import { Injectable, inject, Injector, runInInjectionContext, signal, NgZone } from '@angular/core';
import {
  Auth,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  getAdditionalUserInfo
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private db = inject(Firestore);
  private injector = inject(Injector);
  private router = inject(Router);
  private zone = inject(NgZone);

  currentUser = signal<User | null>(null);
  userData = signal<any>(null);  // Caché de datos Firestore
  isLoading = signal<boolean>(true);
  isRedirecting = signal<boolean>(false);

  readonly authReady: Promise<void>;

  constructor() {
    this.authReady = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        console.log('🔄 onAuthStateChanged →', user ? user.email : 'sin sesión');

        this.zone.run(() => {
          this.currentUser.set(user);
        });

        // Si hay usuario, cargar datos de Firestore UNA sola vez
        if (user) {
          try {
            const data = await this.loadUserData(user);
            this.zone.run(() => this.userData.set(data));
          } catch (e) {
            console.warn('⚠️ No se pudieron cargar datos de Firestore');
          }
        }

        this.zone.run(() => this.isLoading.set(false));
        resolve();
        unsubscribe();
      });

      setTimeout(() => {
        if (this.isLoading()) {
          console.warn('⚠️ Timeout auth.');
          this.zone.run(() => this.isLoading.set(false));
          resolve();
        }
      }, 3000);
    });
  }

  private async loadUserData(user: User): Promise<any> {
    return await runInInjectionContext(this.injector, async () => {
      const userDocRef = doc(this.db, `users/${user.uid}`);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      // Crear documento nuevo
      const now = new Date();
      const trialEnd = new Date(now);
      trialEnd.setDate(now.getDate() + 7);
      const newData = {
        uid: user.uid,
        nombre: user.displayName || '',
        email: user.email || '',
        foto: user.photoURL || '',
        createdAt: now.toISOString(),
        estadoSuscripcion: 'trial',
        trialActivo: true,
        trialStartDate: now.toISOString(),
        fechaFinTrial: trialEnd.toISOString(),
        datosCompletados: false,
        isLinked: false
      };
      await setDoc(userDocRef, newData);
      console.log('✅ Usuario nuevo guardado en Firestore');
      return newData;
    });
  }

  /** Refrescar caché de userData desde Firestore */
  async refreshUserData(): Promise<any> {
    const user = this.currentUser();
    if (!user) return null;
    try {
      const data = await runInInjectionContext(this.injector, async () => {
        const userDocRef = doc(this.db, `users/${user.uid}`);
        const docSnap = await getDoc(userDocRef);
        return docSnap.exists() ? docSnap.data() : null;
      });
      this.zone.run(() => this.userData.set(data));
      return data;
    } catch {
      return this.userData();
    }
  }

  /** Actualizar campos en Firestore y en la caché */
  async updateUserData(fields: Record<string, any>): Promise<void> {
    const user = this.currentUser();
    if (!user) return;
    await runInInjectionContext(this.injector, async () => {
      const userDocRef = doc(this.db, `users/${user.uid}`);
      await updateDoc(userDocRef, fields);
    });
    // Actualizar caché local
    const current = this.userData() || {};
    this.zone.run(() => this.userData.set({ ...current, ...fields }));
  }

  async loginWithGoogle(): Promise<void> {
    this.zone.run(() => this.isRedirecting.set(true));
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(this.auth, provider);

      if (result.user) {
        console.log('✅ Login exitoso:', result.user.email);
        const isNew = getAdditionalUserInfo(result)?.isNewUser ?? false;
        console.log(isNew ? '🆕 Usuario nuevo' : '👤 Usuario existente');

        this.zone.run(() => this.currentUser.set(result.user));

        let data: any;
        try {
          data = await this.loadUserData(result.user);
          this.zone.run(() => this.userData.set(data));
        } catch {
          data = { datosCompletados: false, trialActivo: true, estadoSuscripcion: 'trial' };
        }

        this.zone.run(() => {
          if (!data.datosCompletados) {
            this.router.navigate(['/admin/onboarding']);
          } else if (data.trialActivo || data.estadoSuscripcion === 'activa') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/admin/subscription']);
          }
        });
      }
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        console.log('ℹ️ Popup cerrado');
      } else {
        console.error('❌ Error login:', error);
        throw error;
      }
    } finally {
      this.zone.run(() => this.isRedirecting.set(false));
    }
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    this.zone.run(() => {
      this.currentUser.set(null);
      this.userData.set(null);
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
