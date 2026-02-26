import { Component, inject, OnInit, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  private router = inject(Router);

  userData: any = null;
  vinculacionesCount: number = 0;
  isLoading = true;

  async ngOnInit() {
    // ✅ Esperar a que auth esté listo
    await this.authService.authReady;

    const user = this.authService.currentUser();
    if (user) {
      await this.loadDashboardData(user.uid);
    }
  }

  async loadDashboardData(uid: string) {
    try {
      this.isLoading = true;

      // ✅ Todas las llamadas a Firestore dentro de runInInjectionContext para estabilidad
      this.userData = await runInInjectionContext(this.injector, async () => {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const docSnap = await getDoc(userDocRef);
        return docSnap.exists() ? docSnap.data() : null;
      });

      if (!this.userData) return;

      // Verificar trial
      const now = new Date();
      const trialEnd = new Date(this.userData.fechaFinTrial);
      if (this.userData.estadoSuscripcion === 'trial' && now > trialEnd) {
        this.router.navigate(['/admin/subscription']);
        return;
      }

      // Contar vinculaciones
      this.vinculacionesCount = await runInInjectionContext(this.injector, async () => {
        const vinculacionesRef = collection(this.firestore, `users/${uid}/vinculaciones`);
        const snapshot = await getDocs(vinculacionesRef);
        return snapshot.size;
      });

    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      this.isLoading = false;
    }
  }

  editData() {
    this.router.navigate(['/admin/settings']);
  }

  manageSubscription() {
    this.router.navigate(['/admin/subscription']);
  }
}
