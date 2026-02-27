import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappMockComponent } from './components/whatsapp-mock/whatsapp-mock.component';
import { ChatbotDemoService } from './services/chatbot-demo.service';
import { TranslationService } from '../../services/translation.service';
import { SimulationConfig, ChatLine, Intent, Extra, Style } from './models/models';
import { Rubro } from './models/models';
import { randomInt } from './utils/random';

type DemoState = 'config' | 'playing' | 'done';

@Component({
  selector: 'app-chatbot-en-accion',
  standalone: true,
  imports: [CommonModule, WhatsappMockComponent],
  providers: [ChatbotDemoService],
  template: `
    <div class="chatbot-layout">

      <!-- LEFT: Selection Panel -->
      <div class="panel-col">
        <div class="selection-panel">

          <div class="panel-header">
            <h3 class="panel-title">Elegí qué querés simular</h3>
            <p class="panel-subtitle">Podés seleccionar una o varias opciones y luego tocá <strong>Simular</strong>.</p>
          </div>

          <div class="options-list">
            <button *ngFor="let intent of availableIntents"
                    class="option-row"
                    [class.selected]="selectedIntents.has(intent.value)"
                    (click)="toggleIntent(intent.value)">
              <span class="option-icon">{{ intent.icon }}</span>
              <div class="option-text">
                <span class="option-label">{{ intent.label }}</span>
                <span class="option-hint">{{ intent.hint }}</span>
              </div>
              <span class="option-check" [class.visible]="selectedIntents.has(intent.value)">✓</span>
            </button>
          </div>

          <div class="panel-footer">
            <div class="selected-count" *ngIf="selectedIntents.size > 0">
              {{ selectedIntents.size }} {{ selectedIntents.size === 1 ? 'opción seleccionada' : 'opciones seleccionadas' }}
            </div>

            <button class="btn-simulate"
                    [disabled]="selectedIntents.size === 0 || isPlaying"
                    (click)="startSimulation()">
              ▶ Simular conversación
            </button>

            <button class="btn-new-sim"
                    *ngIf="state === 'done'"
                    (click)="resetToConfig()">
              🔄 Nueva simulación
            </button>
          </div>

        </div>
      </div>

      <!-- RIGHT: WhatsApp Mock -->
      <div class="wa-col">
        <div class="wa-frame">
          <app-whatsapp-mock
            [messages]="displayedMessages"
            [isTyping]="isTyping"
            [businessName]="currentBusinessName"
            [onlineLabel]="'en línea'"
            [typingLabel]="'escribiendo…'"
            [inputPlaceholder]="'Mensaje (demo)'"
            [userTypingText]="userTypingText">
          </app-whatsapp-mock>
        </div>
      </div>

    </div>
  `,
  styleUrl: './chatbot-en-accion.component.scss'
})
export class ChatbotEnAccionComponent implements OnInit {

  private demoService = inject(ChatbotDemoService);
  private translation = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);

  state: DemoState = 'config';
  selectedIntents = new Set<Intent>();
  private readonly rubro = Rubro.HAMBURGUESERIA;

  displayedMessages: ChatLine[] = [];
  currentBusinessName = 'Burger Club';
  isPlaying = false;
  isTyping = false;
  userTypingText = '';
  private playAbort = false;

  private intentIcons: Record<string, string> = {
    PEDIR: '🍔',
    PRECIOS: '💰',
    HORARIOS: '🕐',
    UBICACION: '📍',
    PAGOS: '💳',
    DELIVERY_RETIRO: '🛵',
    PROMOS: '🎉',
  };

  private intentHints: Record<string, string> = {
    PEDIR: 'Hacer un pedido completo',
    PRECIOS: 'Ver menú y precios',
    HORARIOS: 'Consultar horarios de atención',
    UBICACION: 'Dónde encontrarnos',
    PAGOS: 'Medios de pago aceptados',
    DELIVERY_RETIRO: 'Opciones de envío y retiro',
    PROMOS: 'Descuentos y combos vigentes',
  };

  get availableIntents() {
    const supported = this.demoService.getSupportedIntents(this.rubro);
    const labels = this.demoService.getUI()?.intents || {};
    return supported.map(i => ({
      value: i,
      label: labels[i] || i,
      icon: this.intentIcons[i] || '💬',
      hint: this.intentHints[i] || ''
    }));
  }

  ngOnInit() {
    this.demoService.loadScenarios();
  }

  toggleIntent(intent: Intent) {
    if (this.selectedIntents.has(intent)) {
      this.selectedIntents.delete(intent);
    } else {
      this.selectedIntents.add(intent);
    }
  }

  async startSimulation() {
    if (this.selectedIntents.size === 0) return;

    this.playAbort = true;
    await this.delay(100);
    this.playAbort = false;

    this.displayedMessages = [];
    this.isTyping = false;
    this.userTypingText = '';
    this.state = 'playing';
    this.isPlaying = true;
    this.cdr.detectChanges();

    const styles = [Style.FORMAL, Style.NEUTRO, Style.CANCHERO];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const possibleExtras = [Extra.DELIVERY, Extra.PAGO_EFECTIVO, Extra.PAGO_TARJETA, Extra.URGENTE, Extra.PET_FRIENDLY, Extra.COMER_LOCAL];
    const randomExtras = possibleExtras.filter(() => Math.random() < 0.25);

    const config: SimulationConfig = {
      rubro: this.rubro,
      style: randomStyle,
      intents: Array.from(this.selectedIntents),
      extras: randomExtras,
      lang: 'es'
    };

    const { scenario, script } = this.demoService.simulate(config);
    this.currentBusinessName = scenario.businessName;
    this.cdr.detectChanges();

    await this.playConversation(script);

    if (!this.playAbort) {
      this.state = 'done';
      this.isPlaying = false;
      this.cdr.detectChanges();
    }
  }

  resetToConfig() {
    this.playAbort = true;
    this.state = 'config';
    this.displayedMessages = [];
    this.isTyping = false;
    this.userTypingText = '';
    this.isPlaying = false;
    this.selectedIntents.clear();
    this.currentBusinessName = 'Burger Club';
    this.cdr.detectChanges();
  }

  private async playConversation(lines: ChatLine[]) {
    for (const line of lines) {
      if (this.playAbort) return;
      if (line.sender === 'bot') {
        this.isTyping = true;
        this.cdr.detectChanges();
        await this.delay(randomInt(700, 1500));
        if (this.playAbort) return;
        this.isTyping = false;
      } else {
        await this.delay(randomInt(300, 500));
        if (this.playAbort) return;
        await this.typeUserText(line.text);
        if (this.playAbort) return;
        await this.delay(randomInt(250, 450));
        if (this.playAbort) return;
        this.userTypingText = '';
        this.cdr.detectChanges();
      }
      this.displayedMessages = [...this.displayedMessages, line];
      this.cdr.detectChanges();
      await this.delay(randomInt(200, 400));
    }
  }

  private async typeUserText(fullText: string): Promise<void> {
    this.userTypingText = '';
    this.cdr.detectChanges();
    const chunkSize = fullText.length > 40 ? 5 : fullText.length > 20 ? 3 : 2;
    for (let i = 0; i < fullText.length; i += chunkSize) {
      if (this.playAbort) return;
      this.userTypingText = fullText.substring(0, i + chunkSize);
      this.cdr.detectChanges();
      await this.delay(randomInt(30, 70));
    }
    this.userTypingText = fullText;
    this.cdr.detectChanges();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
