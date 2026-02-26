import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor() { }

  /**
   * En un entorno real, este método haría un POST a tu backend (Python/Node)
   * pasando el `uid` del usuario y el ID del plan seleccionado (mensual o anual).
   * El backend se comunicaría con la API de Stripe para generar una Checkout Session
   * y devolvería la URL de esa sesión a la cual redireccionaríamos aquí.
   */
  async createCheckoutSession(uid: string, planId: string): Promise<void> {
    console.log(`Simulando creación de Checkout Session para UID: ${uid}, Plan: ${planId}`);

    // Simulación: Redirigir a una página de pago ficticia o a una URL de Stripe de prueba pre-generada.
    // Usaremos un alert para la demostración hasta que tengas el backend listo.
    alert(`Se iniciaría el flujo de cobro de Stripe para el plan: ${planId}.`);

    // Código real de ejemplo:
    // const response = await fetch('/api/create-checkout-session', { method: 'POST', body: JSON.stringify({ uid, planId }) });
    // const session = await response.json();
    // window.location.href = session.url;
  }

  /**
   * Similar al checkout, este método pide al backend un link para el "Customer Portal"
   * de Stripe, donde el usuario puede cancelar suscripciones o cambiar métodos de pago.
   */
  async createPortalSession(uid: string): Promise<void> {
    console.log(`Simulando redirección al Portal de Stripe para UID: ${uid}`);
    alert('Se redirigiría al portal seguro de Stripe para administrar facturación.');
  }
}
