import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, User, authState, getAdditionalUserInfo, UserCredential } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, memoryLocalCache, doc, setDoc, getDocFromServer, enableNetwork } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    user$: Observable<User | null> = authState(this.auth);

    constructor() { }

    loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    logout() {
        return this.auth.signOut();
    }

    /**
     * BRIDGE DE EMERGENCIA: Crea una conexión Firestore aislada que NO usa WebSockets.
     * Importamos de 'firebase/firestore' directamente para evitar los wrappers de AngularFire
     * que exigen Injection Context.
     */
    private getEmergencyDb() {
        const appName = 'WG_EMERGENCY';
        const apps = getApps();
        const app = apps.find(a => a.name === appName) || initializeApp(environment.firebase, appName);

        // Inicializamos Firestore con configuración ultra-estable
        return initializeFirestore(app, {
            localCache: memoryLocalCache(),
            experimentalForceLongPolling: true
        });
    }

    async handleUserLogin(credential: UserCredential): Promise<any> {
        try {
            const user = credential.user;

            // 1. Pausa de estabilización (obligatorio tras el popup en localhost)
            console.log("Login exitoso. Iniciando puente de emergencia en 2s...");
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 2. Obtenemos instancia cruda (Sin wrappers de AngularFire)
            const db = this.getEmergencyDb();
            await enableNetwork(db).catch(() => { });

            const userDocRef = doc(db, `users/${user.uid}`);

            const additionalInfo = getAdditionalUserInfo(credential);
            const isNewUser = additionalInfo?.isNewUser;

            if (isNewUser) {
                const now = new Date();
                const trialEnd = new Date(now);
                trialEnd.setDate(now.getDate() + 7);

                const newUserData = {
                    uid: user.uid,
                    nombre: user.displayName || '',
                    email: user.email || '',
                    fechaRegistro: now.toISOString(),
                    estadoSuscripcion: "trial",
                    trialActivo: true,
                    fechaFinTrial: trialEnd.toISOString(),
                    datosCompletados: false
                };

                await setDoc(userDocRef, newUserData);
                return newUserData;
            } else {
                console.log("Recuperando perfil mediante conexión forzada...");
                try {
                    // getDocFromServer es fundamental para ignorar estados offline ficticios
                    const docSnap = await getDocFromServer(userDocRef);
                    if (docSnap.exists()) {
                        return docSnap.data();
                    }
                } catch (err) {
                    console.warn("Intento 1 falló, despertando red y reintentando...");
                    await enableNetwork(db).catch(() => { });
                    const docSnap = await getDocFromServer(userDocRef);
                    if (docSnap.exists()) return docSnap.data();
                }

                // Fallback si el documento no existe pero el usuario sí
                const now = new Date();
                const trialEnd = new Date(now);
                trialEnd.setDate(now.getDate() + 7);
                const fallbackData = {
                    uid: user.uid,
                    nombre: user.displayName || '',
                    email: user.email || '',
                    fechaRegistro: now.toISOString(),
                    estadoSuscripcion: "trial",
                    trialActivo: true,
                    fechaFinTrial: trialEnd.toISOString(),
                    datosCompletados: false
                };
                await setDoc(userDocRef, fallbackData);
                return fallbackData;
            }
        } catch (error) {
            console.error("Error crítico en el puente de emergencia Firestore:", error);
            throw error;
        }
    }
}
