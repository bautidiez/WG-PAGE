import { Component, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatLine } from '../../models/models';

@Component({
  selector: 'app-whatsapp-mock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wa-phone">
      <!-- Header -->
      <div class="wa-header">
        <div class="wa-avatar">
          <img src="assets/logo.png" alt="WG" class="wa-avatar-img">
        </div>
        <div class="wa-header-info">
          <div class="wa-business-name">{{ businessName }}</div>
          <div class="wa-status" [class.wa-typing]="isTyping">
            {{ isTyping ? typingLabel : onlineLabel }}
          </div>
        </div>
        <div class="wa-header-icons">
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>

      <!-- Chat area -->
      <div class="wa-chat" #chatContainer>
        <div class="wa-date-badge" *ngIf="messages.length > 0">
          {{ todayLabel }}
        </div>

        <div *ngFor="let msg of messages; trackBy: trackMessage"
             class="wa-message"
             [class.wa-msg-user]="msg.sender === 'user'"
             [class.wa-msg-bot]="msg.sender === 'bot'">
          <div class="wa-bubble"
               [class.wa-bubble-user]="msg.sender === 'user'"
               [class.wa-bubble-bot]="msg.sender === 'bot'">
            <!-- PDF Attachment Card -->
            <div *ngIf="isPdf(msg.text)" class="wa-pdf-card">
              <div class="wa-pdf-icon">
                <svg width="26" height="32" viewBox="0 0 26 32" fill="none">
                  <path d="M16 0H3C1.34 0 0 1.34 0 3v26c0 1.66 1.34 3 3 3h20c1.66 0 3-1.34 3-3V10L16 0z" fill="#E53935"/>
                  <path d="M16 0v7c0 1.66 1.34 3 3 3h7L16 0z" fill="#EF9A9A"/>
                  <text x="13" y="24" text-anchor="middle" fill="white" font-size="8" font-weight="700" font-family="sans-serif">PDF</text>
                </svg>
              </div>
              <div class="wa-pdf-info">
                <span class="wa-pdf-name">{{ getPdfName(msg.text) }}</span>
                <span class="wa-pdf-meta">{{ getPdfSize() }} · PDF</span>
              </div>
              <div class="wa-pdf-download">⬇</div>
            </div>
            <!-- Regular text message -->
            <span *ngIf="!isPdf(msg.text)" class="wa-msg-text" [innerHTML]="formatText(msg.text)"></span>
            <span class="wa-timestamp">{{ msg.timestamp || '' }}</span>
          </div>
        </div>

        <!-- Typing indicator -->
        <div class="wa-message wa-msg-bot" *ngIf="isTyping">
          <div class="wa-bubble wa-bubble-bot wa-typing-bubble">
            <div class="wa-typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input bar -->
      <div class="wa-input-bar">
        <div class="wa-input-field" [class.wa-input-active]="!!userTypingText">
          <span class="wa-emoji">😀</span>
          <span class="wa-input-text" [class.wa-input-typing]="!!userTypingText">
            {{ userTypingText || inputPlaceholder }}
          </span>
        </div>
        <div class="wa-send-btn" [class.wa-send-active]="!!userTypingText">
          {{ userTypingText ? '➤' : '🎤' }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './whatsapp-mock.component.scss'
})
export class WhatsappMockComponent implements AfterViewChecked {
  @Input() messages: ChatLine[] = [];
  @Input() isTyping = false;
  @Input() businessName = '';
  @Input() onlineLabel = 'en línea';
  @Input() typingLabel = 'escribiendo…';
  @Input() inputPlaceholder = 'Mensaje (demo)';
  @Input() userTypingText = '';

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  get todayLabel(): string {
    const now = new Date();
    return now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
      .replace(/^\w/, c => c.toUpperCase());
  }

  ngAfterViewChecked() {
    if (this.chatContainer) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    try {
      const el = this.chatContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (e) { }
  }

  trackMessage(index: number, msg: ChatLine): string {
    return `${index}-${msg.sender}-${msg.text.substring(0, 20)}`;
  }

  formatText(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  isPdf(text: string): boolean {
    return /\.pdf$/i.test(text.trim());
  }

  getPdfName(text: string): string {
    // Remove emoji prefixes like 📎
    return text.replace(/^[\s📎🔗]+/, '').trim();
  }

  getPdfSize(): string {
    // Simulates a realistic file size
    const sizes = ['245 KB', '312 KB', '1.2 MB', '890 KB', '567 KB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }
}
