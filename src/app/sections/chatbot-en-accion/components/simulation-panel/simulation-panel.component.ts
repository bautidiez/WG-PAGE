import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Rubro, Intent, Extra, Style, SimulationConfig
} from '../../models/models';
import { ChatbotDemoService } from '../../services/chatbot-demo.service';

@Component({
  selector: 'app-simulation-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sim-panel">

      <h3 class="panel-title">{{ ui.intentsLabel || '¿Qué querés simular?' }}</h3>

      <div class="intent-grid">
        <button *ngFor="let intent of availableIntents"
                class="intent-chip"
                [class.selected]="selectedIntents.has(intent.value)"
                (click)="toggleIntent(intent.value)">
          <span class="chip-icon">{{ intent.icon }}</span>
          <span class="chip-label">{{ intent.label }}</span>
        </button>
      </div>

      <div class="panel-actions">
        <button class="btn-simulate"
                [disabled]="selectedIntents.size === 0 || isPlaying"
                (click)="onSimulate()">
          ▶ Simular
        </button>
        <button class="btn-regenerate"
                [disabled]="isPlaying"
                (click)="onRegenerate()">
          🔄 Regenerar
        </button>
      </div>
    </div>
  `,
  styleUrl: './simulation-panel.component.scss'
})
export class SimulationPanelComponent {
  @Input() isPlaying = false;
  @Input() ui: any = {};
  @Output() simulate = new EventEmitter<SimulationConfig>();
  @Output() regenerate = new EventEmitter<SimulationConfig>();

  private demoService = inject(ChatbotDemoService);

  // Hardcoded to hamburguesería
  private readonly rubro = Rubro.HAMBURGUESERIA;
  selectedIntents = new Set<Intent>();

  // Icon map for each intent
  private intentIcons: Record<string, string> = {
    PEDIR: '🍔',
    PRECIOS: '💰',
    HORARIOS: '🕐',
    UBICACION: '📍',
    PAGOS: '💳',
    DELIVERY_RETIRO: '🛵',
    PROMOS: '🎉',
  };

  get availableIntents() {
    const supported = this.demoService.getSupportedIntents(this.rubro);
    const labels = this.ui?.intents || {};
    return supported.map(i => ({
      value: i,
      label: labels[i] || i,
      icon: this.intentIcons[i] || '💬'
    }));
  }

  toggleIntent(intent: Intent) {
    if (this.selectedIntents.has(intent)) {
      this.selectedIntents.delete(intent);
    } else {
      this.selectedIntents.add(intent);
    }
  }

  private buildConfig(): SimulationConfig {
    // Randomly pick a style for variety
    const styles = [Style.FORMAL, Style.NEUTRO, Style.CANCHERO];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];

    // Randomly pick some extras for variety
    const possibleExtras = [Extra.DELIVERY, Extra.PAGO_EFECTIVO, Extra.PAGO_TARJETA, Extra.URGENTE, Extra.PET_FRIENDLY, Extra.COMER_LOCAL];
    const randomExtras = possibleExtras.filter(() => Math.random() < 0.3);

    return {
      rubro: this.rubro,
      style: randomStyle,
      intents: Array.from(this.selectedIntents),
      extras: randomExtras,
      lang: 'es'
    };
  }

  onSimulate() {
    this.simulate.emit(this.buildConfig());
  }

  onRegenerate() {
    if (this.selectedIntents.size === 0) {
      const supported = this.demoService.getSupportedIntents(this.rubro);
      if (supported.length > 0) {
        const randomIdx = Math.floor(Math.random() * supported.length);
        this.selectedIntents = new Set<Intent>([supported[randomIdx]]);
      }
    }
    this.regenerate.emit(this.buildConfig());
  }
}
