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
            <span class="wa-msg-text" [innerHTML]="formatText(msg.text)"></span>
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
    } catch (e) {}
  }

  trackMessage(index: number, msg: ChatLine): string {
    return `${index}-${msg.sender}-${msg.text.substring(0, 20)}`;
  }

  formatText(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
