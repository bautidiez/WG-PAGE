import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FoodSceneComponent } from '../food-scene/food-scene.component';
import { FichaService } from '../../services/ficha.service';
import { FichaResult, FormData } from '../../models';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'app-ficha-demo',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, FoodSceneComponent],
    templateUrl: './ficha-demo.component.html',
    styleUrl: './ficha-demo.component.css'
})
export class FichaDemoComponent {

    private fichaService = inject(FichaService);
    readonly translation = inject(TranslationService);

    t(key: string): string { return this.translation.t(key); }

    formData: FormData = { menu: '', horarios: '', ubicacion: '', redes: '' };
    fichaResult: FichaResult | null = null;
    isGenerated = false;
    isCopied = false;
    isGenerating = false;

    generateFicha(): void {
        if (!this.formData.menu.trim() && !this.formData.ubicacion.trim()) return;
        this.isGenerating = true;
        this.isGenerated = false;
        setTimeout(() => {
            this.fichaResult = this.fichaService.procesarMenu(this.formData);
            this.isGenerating = false;
            this.isGenerated = true;
        }, 900);
    }

    activarAgente(): void {
        if (!this.fichaResult) return;
        const msg = `¡Hola! Quiero activar mi Agente IA con los siguientes datos:\n\n` +
            `🏪 *${this.fichaResult.nombre}* — ${this.fichaResult.rubro}\n\n` +
            `${this.fichaResult.rawText.slice(0, 600)}`;
        const url = `https://wa.me/5493584171716?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    }

    copyToClipboard(): void {
        if (!this.fichaResult) return;
        navigator.clipboard.writeText(this.fichaResult.rawText).then(() => {
            this.isCopied = true;
            setTimeout(() => this.isCopied = false, 2500);
        });
    }

    resetDemo(): void {
        this.formData = { menu: '', horarios: '', ubicacion: '', redes: '' };
        this.fichaResult = null;
        this.isGenerated = false;
        this.isCopied = false;
    }
}
