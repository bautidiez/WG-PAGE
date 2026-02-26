import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { StripeService } from '../../../services/stripe';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css',
})
export class Subscription implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private stripeService = inject(StripeService);
  private router = inject(Router);

  userData: any = null;
  isLoading = true;
  isTrialExpired = false;

  async ngOnInit() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.loadSubscriptionData(user.uid);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async loadSubscriptionData(uid: string) {
    try {
      this.isLoading = true;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        this.userData = docSnap.data();

        // Validar si es un trial vencido
        const now = new Date();
        const trialEnd = new Date(this.userData.fechaFinTrial);
        if (this.userData.estadoSuscripcion === 'trial' && now > trialEnd) {
          this.isTrialExpired = true;
        }

      }
    } catch (error) {
      console.error("Error cargando suscripción:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async selectPlan(planId: string) {
    if (!this.auth.currentUser) return;
    try {
      await this.stripeService.createCheckoutSession(this.auth.currentUser.uid, planId);
    } catch (error) {
      console.error("Error abriendo Stripe Checkout:", error);
    }
  }

  async openCustomerPortal() {
    if (!this.auth.currentUser) return;
    try {
      await this.stripeService.createPortalSession(this.auth.currentUser.uid);
    } catch (error) {
      console.error("Error abriendo Portal:", error);
    }
  }

  goBack() {
    // Solo permitir volver al dashboard si la suscripción o trial es válida
    if (!this.isTrialExpired && this.userData?.estadoSuscripcion !== 'vencida') {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
