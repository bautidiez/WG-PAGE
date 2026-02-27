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
    <div class="demo-layout">

      <!-- LEFT: Selector Panel -->
      <div class="selector-col">
        <div class="selector-panel" [class.dimmed]="state === 'playing'">

          <h3 class="selector-title">¿Qué querés simular?</h3>
          <p class="selector-hint">Tocá las opciones y mirá cómo responde</p>

          <!-- Scroll-picker style selector -->
          <div class="picker-list">
            <button *ngFor="let intent of availableIntents; let i = index"
                    class="picker-item"
                    [class.active]="selectedIntents.has(intent.value)"
                    (click)="toggleIntent(intent.value)">
              <span class="picker-icon">{{ intent.icon }}</span>
              <span class="picker-label">{{ intent.label }}</span>
              <span class="picker-check" *ngIf="selectedIntents.has(intent.value)">✓</span>
            </button>
          </div>

          <!-- Selected count + button -->
          <div class="selector-footer">
            <span class="selected-count" *ngIf="selectedIntents.size > 0">
              {{ selectedIntents.size }} seleccionad{{ selectedIntents.size === 1 ? 'o' : 'os' }}
            </span>
            <button class="btn-simulate"
                    *ngIf="state !== 'playing'"
                    [disabled]="selectedIntents.size === 0"
                    (click)="startSimulation()">
              {{ state === 'done' ? '🔄 Simular de nuevo' : '▶ Simular' }}
            </button>
            <div class="playing-indicator" *ngIf="state === 'playing'">
              <span class="dot-pulse"></span>
              Reproduciendo…
            </div>
          </div>

        </div>
      </div>

      <!-- RIGHT: WhatsApp Mock (always visible, fixed size) -->
      <div class="wa-col">
        <div class="wa-container">
          <app-whatsapp-mock
            [messages]="displayedMessages"
            [isTyping]="isTyping"
            [businessName]="currentBusinessName"
            [onlineLabel]="ui.online || 'en línea'"
            [typingLabel]="ui.typing || 'escribiendo…'"
            [inputPlaceholder]="ui.inputPlaceholder || 'Mensaje (demo)'"
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

  get ui() {
    return this.demoService.getUI();
  }

  get availableIntents() {
    const supported = this.demoService.getSupportedIntents(this.rubro);
    const labels = this.ui?.intents || {};
    return supported.map(i => ({
      value: i,
      label: labels[i] || i,
      icon: this.intentIcons[i] || '💬'
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
    this.playAbort = true;
    await this.delay(100);
    this.playAbort = false;

    this.displayedMessages = [];
    this.isTyping = false;
    this.userTypingText = '';

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

    this.state = 'playing';
    this.cdr.detectChanges();

    const { scenario, script } = this.demoService.simulate(config);
    this.currentBusinessName = scenario.businessName;
    this.cdr.detectChanges();

    await this.playConversation(script);

    if (!this.playAbort) {
      this.state = 'done';
      this.cdr.detectChanges();
    }
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
