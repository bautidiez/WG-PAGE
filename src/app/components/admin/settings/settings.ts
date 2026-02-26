import { Component, inject, OnInit, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private injector = inject(Injector);
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
    // ✅ El guard YA garantiza que hay usuario autenticado
    const user = this.authService.currentUser();
    if (user) {
      await this.loadCurrentData(user.uid);
    }
  }

  async loadCurrentData(uid: string) {
    try {
      const data = await runInInjectionContext(this.injector, async () => {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const docSnap = await getDoc(userDocRef);
        return docSnap.exists() ? docSnap.data() : null;
      });

      if (data) {
        this.settingsData = {
          nombreEmpresa: data['empresa'] || '',
          telefono: data['telefono'] || '',
          direccion: data['direccion'] || ''
        };
      }
    } catch (error) {
      console.error("Error cargando ajustes", error);
      this.errorMsg = 'No pudimos cargar tus datos actuales.';
    } finally {
      this.isLoading = false;
    }
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
      const user = this.authService.currentUser();
      if (!user) return;

      await runInInjectionContext(this.injector, async () => {
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        await updateDoc(userDocRef, {
          empresa: this.settingsData.nombreEmpresa,
          telefono: this.settingsData.telefono,
          direccion: this.settingsData.direccion
        });
      });

      this.successMsg = '¡Tus datos fueron actualizados correctamente!';

      // Ocultar el mensaje de éxito luego de unos segundos
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
}
