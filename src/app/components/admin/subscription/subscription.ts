import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '../../../services/stripe';
import { AuthService } from '../../../services/auth.service';
import { ExchangeRateService } from '../../../services/exchange-rate.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css',
})
export class Subscription implements OnInit {
  authService = inject(AuthService);
  private stripeService = inject(StripeService);
  private router = inject(Router);
  exchangeRateSvc = inject(ExchangeRateService);

  userData: any = null;
  isLoading = true;
  isTrialExpired = false;
  currentCurrency: 'USD' | 'ARS' = 'USD';

  // Mismos planes que en la landing
  plans = [
    {
      name: 'Startup',
      priceUSD: 99,
      stripePriceId: 'price_mensual_id',
      period: '/mes',
      features: [
        'Chatbot IA personalizado',
        'Dispositivos ilimitados',
        'Soporte por email',
        'Edición de respuestas en vivo'
      ]
    },
    {
      name: 'Growth',
      priceUSD: 299,
      stripePriceId: 'price_anual_id',
      period: '/mes',
      featured: true,
      badge: 'Recomendado',
      features: [
        'Todo lo del plan Startup',
        'Soporte prioritario 24/7',
        'Analíticas avanzadas',
        'Integraciones premium',
        'Facturación simplificada'
      ]
    }
  ];

  async ngOnInit() {
    await this.authService.authReady;
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userData = this.authService.userData();
    if (!this.userData) {
      this.userData = await this.authService.refreshUserData();
    }

    if (this.userData) {
      const now = new Date();
      const trialEnd = new Date(this.userData.fechaFinTrial);
      if (this.userData.estadoSuscripcion === 'trial' && now > trialEnd) {
        this.isTrialExpired = true;
      }
    }

    this.isLoading = false;
  }

  formatPrice(usdPrice: number): string {
    if (this.currentCurrency === 'USD') return `$${usdPrice}`;
    const arsPrice = Math.round(usdPrice * this.exchangeRateSvc.rate().blue);
    return `$${arsPrice.toLocaleString('es-AR')}`;
  }

  getCurrencyLabel(): string { return this.currentCurrency; }
  getExchangeInfo(): string { return this.exchangeRateSvc.getInfo(); }
  get isLoadingRate() { return this.exchangeRateSvc.isLoading(); }
  fetchExchangeRate() { this.exchangeRateSvc.fetchRate(); }

  async selectPlan(stripePriceId: string) {
    const user = this.authService.currentUser();
    if (!user) return;
    try {
      await this.stripeService.createCheckoutSession(user.uid, stripePriceId);
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
    if (!this.isTrialExpired && this.userData?.estadoSuscripcion !== 'vencida') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  logout() {
    this.authService.logout();
  }
}
