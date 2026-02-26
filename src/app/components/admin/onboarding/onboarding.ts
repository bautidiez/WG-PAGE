import { Component, inject, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-onboarding',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './onboarding.html',
    styleUrl: './onboarding.css'
})
export class Onboarding {
    private authService = inject(AuthService);
    private firestore = inject(Firestore);
    private injector = inject(Injector);
    private router = inject(Router);

    onboardingData = {
        nombreEmpresa: '',
        telefono: '',
        direccion: ''
    };

    isSaving = false;
    error = '';

    async guardarDatos() {
        this.error = '';
        if (!this.onboardingData.nombreEmpresa || !this.onboardingData.telefono || !this.onboardingData.direccion) {
            this.error = 'Por favor, completa todos los campos para continuar.';
            return;
        }

        this.isSaving = true;
        try {
            const user = this.authService.currentUser();
            if (!user) {
                this.router.navigate(['/login']);
                return;
            }

            // 1. Generar QR URL (apuntando a una ruta pública de vinculación)
            const vinculacionUrl = `https://tudominio.com/vincular/${user.uid}`;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vinculacionUrl)}`;

            // 2. Actualizar documento en Firestore dentro del injection context
            await runInInjectionContext(this.injector, async () => {
                const userDocRef = doc(this.firestore, `users/${user.uid}`);
                await updateDoc(userDocRef, {
                    empresa: this.onboardingData.nombreEmpresa,
                    telefono: this.onboardingData.telefono,
                    direccion: this.onboardingData.direccion,
                    datosCompletados: true,
                    qrUrl: qrUrl
                });
            });

            // 3. Redirigir al dashboard
            this.router.navigate(['/admin/dashboard']);

        } catch (error) {
            console.error('Error al guardar datos de onboarding:', error);
            this.error = 'Ocurrió un error al guardar tus datos. Intenta nuevamente.';
        } finally {
            this.isSaving = false;
        }
    }
}
