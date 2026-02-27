import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationPanelComponent } from './components/simulation-panel/simulation-panel.component';
import { WhatsappMockComponent } from './components/whatsapp-mock/whatsapp-mock.component';
import { ChatbotDemoService } from './services/chatbot-demo.service';
import { TranslationService } from '../../services/translation.service';
import { SimulationConfig, ChatLine, Scenario } from './models/models';
import { randomInt } from './utils/random';

@Component({
  selector: 'app-chatbot-en-accion',
  standalone: true,
  imports: [CommonModule, SimulationPanelComponent, WhatsappMockComponent],
  providers: [ChatbotDemoService],
  template: `
    <div class="chatbot-simulation-wrapper">

      <!-- Panel -->
      <div class="sim-panel-col">
        <app-simulation-panel
          [isPlaying]="isPlaying"
          [ui]="ui"
          (simulate)="onSimulate($event)"
          (regenerate)="onRegenerate($event)">
        </app-simulation-panel>
      </div>

      <!-- WhatsApp Mock -->
      <div class="wa-mock-col">
        <app-whatsapp-mock
          [messages]="displayedMessages"
          [isTyping]="isTyping"
          [businessName]="currentBusinessName"
          [onlineLabel]="ui.online"
          [typingLabel]="ui.typing"
          [inputPlaceholder]="ui.inputPlaceholder"
          [userTypingText]="userTypingText">
        </app-whatsapp-mock>
      </div>

    </div>
  `,
  styleUrl: './chatbot-en-accion.component.scss'
})
export class ChatbotEnAccionComponent implements OnInit {

  private demoService = inject(ChatbotDemoService);
  private translation = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);

  // State
  displayedMessages: ChatLine[] = [];
  currentBusinessName = '';
  isPlaying = false;
  isTyping = false;
  userTypingText = '';
  private playAbort = false;

  get ui() {
    return this.demoService.getUI();
  }

  ngOnInit() {
    this.demoService.loadScenarios();
  }

  async onSimulate(config: SimulationConfig) {
    await this.runSimulation(config);
  }

  async onRegenerate(config: SimulationConfig) {
    await this.runSimulation(config);
  }

  private async runSimulation(config: SimulationConfig) {
    // Abort any running playback
    this.playAbort = true;
    await this.delay(100);
    this.playAbort = false;

    // Reset state
    this.displayedMessages = [];
    this.isPlaying = true;
    this.isTyping = false;
    this.userTypingText = '';
    this.cdr.detectChanges();

    // Generate
    const { scenario, script } = this.demoService.simulate(config);
    this.currentBusinessName = scenario.businessName;
    this.cdr.detectChanges();

    // Play
    await this.playConversation(script);

    this.isPlaying = false;
    this.cdr.detectChanges();
  }

  private async playConversation(lines: ChatLine[]) {
    for (const line of lines) {
      if (this.playAbort) return;

      if (line.sender === 'bot') {
        // Show typing indicator for bot
        this.isTyping = true;
        this.cdr.detectChanges();
        await this.delay(randomInt(700, 1500));
        if (this.playAbort) return;
        this.isTyping = false;
      } else {
        // ── Realistic user typing in input bar ──
        await this.delay(randomInt(300, 500));
        if (this.playAbort) return;

        // Type the text character by character (in chunks for speed)
        await this.typeUserText(line.text);
        if (this.playAbort) return;

        // Brief pause with full text visible, then "send"
        await this.delay(randomInt(250, 450));
        if (this.playAbort) return;

        // Clear input bar (simulates pressing send)
        this.userTypingText = '';
        this.cdr.detectChanges();
      }

      // Add the message bubble
      this.displayedMessages = [...this.displayedMessages, line];
      this.cdr.detectChanges();

      // Small pause between messages
      await this.delay(randomInt(200, 400));
    }
  }

  private async typeUserText(fullText: string): Promise<void> {
    // Type in chunks of 2-4 characters for a fast but visible effect
    this.userTypingText = '';
    this.cdr.detectChanges();
    const chunkSize = fullText.length > 40 ? 5 : fullText.length > 20 ? 3 : 2;

    for (let i = 0; i < fullText.length; i += chunkSize) {
      if (this.playAbort) return;
      this.userTypingText = fullText.substring(0, i + chunkSize);
      this.cdr.detectChanges();
      await this.delay(randomInt(30, 70));
    }
    // Ensure final text is complete
    this.userTypingText = fullText;
    this.cdr.detectChanges();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
