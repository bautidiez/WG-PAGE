import { Injectable, signal } from '@angular/core';
import { ExchangeRate } from '../models';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {

    readonly rate = signal<ExchangeRate>({
        blue: 1200,
        oficial: 1000,
        timestamp: new Date()
    });

    isLoading = signal(false);

    async fetchRate(): Promise<void> {
        this.isLoading.set(true);
        try {
            const response = await fetch('https://dolarapi.com/v1/dolares/blue');
            const data = await response.json();
            this.rate.set({
                blue: data.venta || 1200,
                oficial: data.compra || 1000,
                timestamp: new Date()
            });
        } catch {
            // mantener valor fallback
        } finally {
            this.isLoading.set(false);
        }
    }

    getInfo(): string {
        return `Cotización Blue: $${this.rate().blue}`;
    }
}
