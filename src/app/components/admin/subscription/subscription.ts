import { Component, inject, OnInit, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { StripeService } from '../../../services/stripe';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css',
})
export class Subscription implements OnInit {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private stripeService = inject(StripeService);
  private injector = inject(Injector);
  private router = inject(Router);

  userData: any = null;
  isLoading = true;
  isTrialExpired = false;

  async ngOnInit() {
    // ✅ El guard YA garantiza que hay usuario autenticado
    const user = this.authService.currentUser();
    if (user) {
      await this.loadSubscriptionData(user.uid);
    }
  }

  async loadSubscriptionData(uid: string) {
    try {
      this.isLoading = true;
      
      this.userData = await runInInjectionContext(this.injector, async () => {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const docSnap = await getDoc(userDocRef);
        return docSnap.exists() ? docSnap.data() : null;
      });

      if (this.userData) {
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
    const user = this.authService.currentUser();
    if (!user) return;
    try {
      await this.stripeService.createCheckoutSession(user.uid, planId);
    } catch (error) {
      console.error("Error abriendo Stripe Checkout:", error);
    }
  }

  async openCustomerPortal() {
    const user = this.authService.currentUser();
    if (!user) return;
    try {
      await this.stripeService.createPortalSession(user.uid);
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
