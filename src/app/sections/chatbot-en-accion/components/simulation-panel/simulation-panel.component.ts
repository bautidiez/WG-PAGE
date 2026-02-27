import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Rubro, Intent, Extra, Style, SimulationConfig, RUBRO_INTENTS
} from '../../models/models';
import { ChatbotDemoService } from '../../services/chatbot-demo.service';

@Component({
  selector: 'app-simulation-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sim-panel">

      <!-- Rubro selector -->
      <div class="panel-group">
        <label class="panel-label">{{ ui.rubroLabel }}</label>
        <select class="panel-select" [(ngModel)]="selectedRubro" (ngModelChange)="onRubroChange()">
          <option *ngFor="let r of rubroOptions" [value]="r.value">{{ r.label }}</option>
        </select>
      </div>

      <!-- Style selector -->
      <div class="panel-group">
        <label class="panel-label">{{ ui.styleLabel }}</label>
        <div class="chip-row">
          <button *ngFor="let s of styleOptions"
                  class="chip"
                  [class.chip-active]="selectedStyle === s.value"
                  (click)="selectedStyle = s.value">
            {{ s.label }}
          </button>
        </div>
      </div>

      <!-- Intents -->
      <div class="panel-group">
        <label class="panel-label">{{ ui.intentsLabel }}</label>
        <div class="chip-row chip-row-wrap">
          <button *ngFor="let intent of availableIntents"
                  class="chip chip-intent"
                  [class.chip-active]="selectedIntents.has(intent.value)"
                  (click)="toggleIntent(intent.value)">
            {{ intent.label }}
          </button>
        </div>
      </div>

      <!-- Extras -->
      <div class="panel-group">
        <label class="panel-label">{{ ui.extrasLabel }}</label>
        <div class="chip-row chip-row-wrap">
          <button *ngFor="let extra of extraOptions"
                  class="chip chip-extra"
                  [class.chip-active]="selectedExtras.has(extra.value)"
                  (click)="toggleExtra(extra.value)">
            {{ extra.label }}
          </button>
        </div>
      </div>

      <!-- Buttons -->
      <div class="panel-buttons">
        <button class="btn-simulate"
                [disabled]="selectedIntents.size === 0 || isPlaying"
                (click)="onSimulate()">
          {{ ui.simulateBtn }}
        </button>
        <button class="btn-regenerate"
                [disabled]="isPlaying"
                (click)="onRegenerate()">
          {{ ui.regenerateBtn }}
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

  selectedRubro: Rubro = Rubro.ALEATORIO;
  selectedStyle: Style = Style.NEUTRO;
  selectedIntents = new Set<Intent>();
  selectedExtras = new Set<Extra>();

  get rubroOptions() {
    const labels = this.ui?.rubros || {};
    return Object.values(Rubro).map(r => ({ value: r, label: labels[r] || r }));
  }

  get styleOptions() {
    const labels = this.ui?.styles || {};
    return Object.values(Style).map(s => ({ value: s, label: labels[s] || s }));
  }

  get availableIntents() {
    const supported = this.demoService.getSupportedIntents(this.selectedRubro);
    const labels = this.ui?.intents || {};
    return supported.map(i => ({ value: i, label: labels[i] || i }));
  }

  get extraOptions() {
    const labels = this.ui?.extras || {};
    return Object.values(Extra).map(e => ({ value: e, label: labels[e] || e }));
  }

  onRubroChange() {
    // Remove intents that are no longer supported by new rubro
    const supported = new Set(this.demoService.getSupportedIntents(this.selectedRubro));
    this.selectedIntents.forEach(i => {
      if (!supported.has(i)) this.selectedIntents.delete(i);
    });
  }

  toggleIntent(intent: Intent) {
    if (this.selectedIntents.has(intent)) {
      this.selectedIntents.delete(intent);
    } else {
      this.selectedIntents.add(intent);
    }
  }

  toggleExtra(extra: Extra) {
    if (this.selectedExtras.has(extra)) {
      this.selectedExtras.delete(extra);
    } else {
      this.selectedExtras.add(extra);
    }
  }

  private buildConfig(): SimulationConfig {
    return {
      rubro: this.selectedRubro,
      style: this.selectedStyle,
      intents: Array.from(this.selectedIntents),
      extras: Array.from(this.selectedExtras),
      lang: 'es' // actual lang is read from service internally
    };
  }

  onSimulate() {
    this.simulate.emit(this.buildConfig());
  }

  onRegenerate() {
    if (this.selectedIntents.size === 0) {
      // Auto-select a random intent for regeneration
      const supported = this.demoService.getSupportedIntents(this.selectedRubro);
      if (supported.length > 0) {
        const randomIdx = Math.floor(Math.random() * supported.length);
        this.selectedIntents = new Set<Intent>([supported[randomIdx]]);
      }
    }
    this.regenerate.emit(this.buildConfig());
  }
}
