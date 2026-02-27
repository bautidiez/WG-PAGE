import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

  userData: any = null;
  vinculacionesCount = 0;
  isLoading = true;

  async ngOnInit() {
    await this.authService.authReady;

    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Leer datos desde la caché del AuthService (ya cargados)
    this.userData = this.authService.userData();

    // Si no hay datos en caché, intentar refrescar
    if (!this.userData) {
      this.userData = await this.authService.refreshUserData();
    }

    // Si no completó onboarding → mandarlo ahí
    if (this.userData && !this.userData.datosCompletados) {
      this.router.navigate(['/admin/onboarding']);
      return;
    }

    // Verificar trial expirado
    if (this.userData) {
      const now = new Date();
      const trialEnd = new Date(this.userData.fechaFinTrial);
      if (this.userData.estadoSuscripcion === 'trial' && now > trialEnd) {
        this.router.navigate(['/admin/subscription']);
        return;
      }
    }

    this.isLoading = false;
  }

  editData() {
    this.router.navigate(['/admin/settings']);
  }

  manageSubscription() {
    this.router.navigate(['/admin/subscription']);
  }

  logout() {
    this.authService.logout();
  }
}
