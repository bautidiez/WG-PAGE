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
  setDoc
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
  isLoading = signal<boolean>(true);
  isRedirecting = signal<boolean>(false);

  readonly authReady: Promise<void>;

  constructor() {
    // Solo detectar sesión existente al cargar
    this.authReady = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        console.log('🔄 onAuthStateChanged →', user ? user.email : 'sin sesión');
        this.zone.run(() => {
          this.currentUser.set(user);
          this.isLoading.set(false);
        });
        resolve();
        unsubscribe();
      });

      // Timeout de seguridad
      setTimeout(() => {
        if (this.isLoading()) {
          console.warn('⚠️ Timeout. Desbloqueando.');
          this.zone.run(() => this.isLoading.set(false));
          resolve();
        }
      }, 3000);
    });
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
        
        // Intentar guardar en Firestore, pero si falla (offline) navegar igual
        let userData: any;
        try {
          userData = await this.saveUserToFirestore(result.user);
        } catch (fsError) {
          console.warn('⚠️ Firestore offline, navegando con datos por defecto');
          userData = { datosCompletados: false, trialActivo: true, estadoSuscripcion: 'trial' };
        }
        this.navigateByUserData(userData);
      }
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        console.log('ℹ️ Popup cerrado por el usuario');
      } else {
        console.error('❌ Error en login:', error);
        throw error;
      }
    } finally {
      this.zone.run(() => this.isRedirecting.set(false));
    }
  }

  private navigateByUserData(userData: any): void {
    this.zone.run(() => {
      if (!userData.datosCompletados) {
        this.router.navigate(['/admin/onboarding']);
      } else if (userData.trialActivo || userData.estadoSuscripcion === 'activa') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/admin/subscription']);
      }
    });
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    this.zone.run(() => {
      this.currentUser.set(null);
      this.router.navigate(['/login']);
    });
  }

  async getFirestoreDoc(path: string): Promise<any> {
    return await runInInjectionContext(this.injector, async () => {
      const docRef = doc(this.db, path);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    });
  }

  async saveUserToFirestore(user: User): Promise<any> {
    return await runInInjectionContext(this.injector, async () => {
      const userDocRef = doc(this.db, `users/${user.uid}`);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }

      const now = new Date();
      const trialEnd = new Date(now);
      trialEnd.setDate(now.getDate() + 7);

      const userData = {
        uid: user.uid,
        nombre: user.displayName || '',
        email: user.email || '',
        foto: user.photoURL || '',
        createdAt: now.toISOString(),
        fechaRegistro: now.toISOString(),
        estadoSuscripcion: 'trial',
        trialActivo: true,
        trialStartDate: now.toISOString(),
        fechaFinTrial: trialEnd.toISOString(),
        trialEndDate: trialEnd.toISOString(),
        datosCompletados: false,
        isLinked: false
      };

      await setDoc(userDocRef, userData);
      console.log('✅ Usuario nuevo guardado en Firestore');
      return userData;
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
