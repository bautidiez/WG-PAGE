import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

  settingsData = {
    nombreEmpresa: '',
    telefono: '',
    direccion: ''
  };

  isLoading = true;
  isSaving = false;
  successMsg = '';
  errorMsg = '';

  async ngOnInit() {
    await this.authService.authReady;
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Leer desde caché
    const data = this.authService.userData();
    if (data) {
      this.settingsData = {
        nombreEmpresa: data['empresa'] || data['nombreEmpresa'] || '',
        telefono: data['telefono'] || '',
        direccion: data['direccion'] || ''
      };
    }
    this.isLoading = false;
  }

  async saveChanges() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.settingsData.nombreEmpresa || !this.settingsData.telefono || !this.settingsData.direccion) {
      this.errorMsg = 'Todos los campos son obligatorios.';
      return;
    }

    this.isSaving = true;
    try {
      await this.authService.updateUserData({
        empresa: this.settingsData.nombreEmpresa,
        telefono: this.settingsData.telefono,
        direccion: this.settingsData.direccion
      });
      this.successMsg = '¡Tus datos fueron actualizados correctamente!';
      setTimeout(() => this.successMsg = '', 3000);
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      this.errorMsg = 'Hubo un error al guardar. Reintentá.';
    } finally {
      this.isSaving = false;
    }
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    this.authService.logout();
  }
}
