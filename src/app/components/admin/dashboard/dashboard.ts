import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  userData: any = null;
  vinculacionesCount: number = 0;
  isLoading = true;

  async ngOnInit() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.loadDashboardData(user.uid);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async loadDashboardData(uid: string) {
    try {
      this.isLoading = true;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        this.userData = docSnap.data();

        // Si su trial expiró y no pagó, sacarlo al mantenedor de suscripción
        const now = new Date();
        const trialEnd = new Date(this.userData.fechaFinTrial);
        if (this.userData.estadoSuscripcion === 'trial' && now > trialEnd) {
          this.router.navigate(['/admin/subscription']);
          return;
        }

        // Consultar cantidad de vinculaciones
        const vinculacionesRef = collection(this.firestore, `users/${uid}/vinculaciones`);
        const snapshot = await getDocs(vinculacionesRef);
        this.vinculacionesCount = snapshot.size;

      } else {
        // Redirigir a login o mostrar error
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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
