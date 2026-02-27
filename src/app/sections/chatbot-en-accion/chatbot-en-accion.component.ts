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
    <div class="demo-container">

      <!-- STATE: Config / Intent Selection -->
      <div class="demo-state config-state" *ngIf="state === 'config'">
        <h3 class="config-title">¿Qué querés simular?</h3>
        <p class="config-subtitle">Elegí una o más opciones y mirá cómo responde el chatbot</p>

        <div class="intent-grid">
          <button *ngFor="let intent of availableIntents"
                  class="intent-chip"
                  [class.selected]="selectedIntents.has(intent.value)"
                  (click)="toggleIntent(intent.value)">
            <span class="chip-icon">{{ intent.icon }}</span>
            <span class="chip-label">{{ intent.label }}</span>
          </button>
        </div>

        <button class="btn-simulate"
                [disabled]="selectedIntents.size === 0"
                (click)="startSimulation()">
          ▶ Simular conversación
        </button>
      </div>

      <!-- STATE: Playing chat -->
      <div class="demo-state chat-state" *ngIf="state === 'playing' || state === 'done'">
        <app-whatsapp-mock
          [messages]="displayedMessages"
          [isTyping]="isTyping"
          [businessName]="currentBusinessName"
          [onlineLabel]="ui.online || 'en línea'"
          [typingLabel]="ui.typing || 'escribiendo…'"
          [inputPlaceholder]="ui.inputPlaceholder || 'Mensaje (demo)'"
          [userTypingText]="userTypingText">
        </app-whatsapp-mock>

        <!-- Done overlay -->
        <div class="done-overlay" *ngIf="state === 'done'">
          <button class="btn-new-sim" (click)="resetToConfig()">
            🔄 Nueva simulación
          </button>
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

  // State machine
  state: DemoState = 'config';

  // Config state
  selectedIntents = new Set<Intent>();
  private readonly rubro = Rubro.HAMBURGUESERIA;

  // Chat state
  displayedMessages: ChatLine[] = [];
  currentBusinessName = '';
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

    // Reset chat
    this.displayedMessages = [];
    this.isTyping = false;
    this.userTypingText = '';

    // Pick random style and extras for variety
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

    // Switch to playing state
    this.state = 'playing';
    this.cdr.detectChanges();

    // Generate
    const { scenario, script } = this.demoService.simulate(config);
    this.currentBusinessName = scenario.businessName;
    this.cdr.detectChanges();

    // Play
    await this.playConversation(script);

    if (!this.playAbort) {
      this.state = 'done';
      this.cdr.detectChanges();
    }
  }

  resetToConfig() {
    this.playAbort = true;
    this.state = 'config';
    this.displayedMessages = [];
    this.isTyping = false;
    this.userTypingText = '';
    this.selectedIntents.clear();
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
