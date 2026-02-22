import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WhatsAppService {

    private readonly NUMBER = '5493584171716';

    open(messageType: string, isPlan: boolean = false): void {
        const message = isPlan
            ? `Hola, me interesa contratar el plan ${messageType}.`
            : `Hola, tengo una consulta sobre: ${messageType}`;
        const url = `https://wa.me/${this.NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
}
