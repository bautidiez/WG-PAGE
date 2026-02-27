import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-onboarding',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './onboarding.html',
    styleUrl: './onboarding.css'
})
export class Onboarding {
    authService = inject(AuthService);
    private router = inject(Router);

    countries = [
        { name: 'Argentina', code: '+54', iso: 'ar', flag: 'https://flagcdn.com/w40/ar.png' },
        { name: 'Chile', code: '+56', iso: 'cl', flag: 'https://flagcdn.com/w40/cl.png' },
        { name: 'Colombia', code: '+57', iso: 'co', flag: 'https://flagcdn.com/w40/co.png' },
        { name: 'México', code: '+52', iso: 'mx', flag: 'https://flagcdn.com/w40/mx.png' },
        { name: 'Uruguay', code: '+598', iso: 'uy', flag: 'https://flagcdn.com/w40/uy.png' },
        { name: 'Paraguay', code: '+595', iso: 'py', flag: 'https://flagcdn.com/w40/py.png' },
        { name: 'Bolivia', code: '+591', iso: 'bo', flag: 'https://flagcdn.com/w40/bo.png' },
        { name: 'Perú', code: '+51', iso: 'pe', flag: 'https://flagcdn.com/w40/pe.png' },
        { name: 'Ecuador', code: '+593', iso: 'ec', flag: 'https://flagcdn.com/w40/ec.png' },
        { name: 'Venezuela', code: '+58', iso: 've', flag: 'https://flagcdn.com/w40/ve.png' },
        { name: 'España', code: '+34', iso: 'es', flag: 'https://flagcdn.com/w40/es.png' },
        { name: 'Estados Unidos', code: '+1', iso: 'us', flag: 'https://flagcdn.com/w40/us.png' },
    ];

    onboardingData = {
        nombreEmpresa: '',
        codigoPais: '+54',
        telefono: '',
        direccion: ''
    };

    isSaving = false;
    showConfirmation = false;
    showCountryDropdown = false;
    error = '';

    getSelectedFlag(): string {
        const country = this.countries.find(c => c.code === this.onboardingData.codigoPais);
        return country ? country.flag : this.countries[0].flag;
    }

    toggleCountryDropdown() {
        this.showCountryDropdown = !this.showCountryDropdown;
    }

    selectCountry(country: any) {
        this.onboardingData.codigoPais = country.code;
        this.showCountryDropdown = false;
    }

    mostrarConfirmacion() {
        this.error = '';
        if (!this.onboardingData.nombreEmpresa || !this.onboardingData.telefono || !this.onboardingData.direccion) {
            this.error = 'Por favor, completa todos los campos para continuar.';
            return;
        }
        this.showConfirmation = true;
    }

    volverAEditar() {
        this.showConfirmation = false;
    }

    async guardarDatos() {
        this.error = '';
        this.isSaving = true;
        try {
            const user = this.authService.currentUser();
            if (!user) {
                this.router.navigate(['/login']);
                return;
            }

            const telefonoCompleto = `${this.onboardingData.codigoPais} ${this.onboardingData.telefono}`;
            const vinculacionUrl = `https://web-wg-5e44e.web.app/vincular/${user.uid}`;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vinculacionUrl)}`;

            await this.authService.updateUserData({
                empresa: this.onboardingData.nombreEmpresa,
                telefono: telefonoCompleto,
                direccion: this.onboardingData.direccion,
                datosCompletados: true,
                qrUrl: qrUrl
            });

            this.router.navigate(['/admin/dashboard']);

        } catch (error) {
            console.error('Error al guardar datos de onboarding:', error);
            this.error = 'Ocurrió un error al guardar tus datos. Intenta nuevamente.';
        } finally {
            this.isSaving = false;
        }
    }
}
