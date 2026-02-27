import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Scenario, SimulationConfig, ChatLine,
  Rubro, Intent, Extra, Style, ScenarioItem, RUBRO_INTENTS
} from '../models/models';
import { TranslationService } from '../../../services/translation.service';
import { UI_ES, PHRASES_ES } from '../i18n/phrases.es';
import { UI_EN, PHRASES_EN } from '../i18n/phrases.en';
import { oneOf, pickN, randomInt } from '../utils/random';

@Injectable()
export class ChatbotDemoService {

  private translation = inject(TranslationService);
  private scenariosEs: Scenario[] = [];
  private scenariosEn: Scenario[] = [];
  private loaded = false;
  private lastScenarioId: string | null = null;

  // ── Public API ──────────────────────────────────────────

  async loadScenarios(): Promise<void> {
    if (this.loaded) return;
    try {
      const [es, en] = await Promise.all([
        fetch('assets/chatbot-demo/scenarios.es.json').then(r => r.json()),
        fetch('assets/chatbot-demo/scenarios.en.json').then(r => r.json())
      ]);
      this.scenariosEs = es;
      this.scenariosEn = en;
      this.loaded = true;
    } catch (e) {
      console.error('Failed to load chatbot scenarios', e);
    }
  }

  getUI() {
    return this.lang === 'es' ? UI_ES : UI_EN;
  }

  getSupportedIntents(rubro: Rubro): Intent[] {
    if (rubro === Rubro.ALEATORIO) {
      // Return all possible intents for random mode
      return Object.values(Intent);
    }
    return RUBRO_INTENTS[rubro] ?? Object.values(Intent);
  }

  simulate(config: SimulationConfig): { scenario: Scenario; script: ChatLine[] } {
    const scenarios = this.getScenarios();
    const rubroKey = config.rubro === Rubro.ALEATORIO
      ? oneOf(Object.values(Rubro).filter(r => r !== Rubro.ALEATORIO))
      : config.rubro;

    const pool = scenarios.filter(s => s.rubro === rubroKey && s.id !== this.lastScenarioId);
    const scenario = pool.length > 0 ? oneOf(pool) : oneOf(scenarios.filter(s => s.rubro === rubroKey));
    this.lastScenarioId = scenario.id;

    const script = this.generateScript(config, scenario);
    return { scenario, script };
  }

  regenerate(config: SimulationConfig): { scenario: Scenario; script: ChatLine[] } {
    return this.simulate(config);
  }

  // ── Private helpers ─────────────────────────────────────

  private get lang(): 'es' | 'en' {
    return this.translation.currentLanguage();
  }

  private getScenarios(): Scenario[] {
    return this.lang === 'es' ? this.scenariosEs : this.scenariosEn;
  }

  private getPhrases(): any {
    return this.lang === 'es' ? PHRASES_ES : PHRASES_EN;
  }

  private generateScript(config: SimulationConfig, scenario: Scenario): ChatLine[] {
    const phrases = this.getPhrases()[config.style] || this.getPhrases()['neutro'];
    const lines: ChatLine[] = [];
    let minuteOffset = 0;
    const baseHour = randomInt(10, 18);

    const addLine = (sender: 'user' | 'bot', templates: string[], replacements: Record<string, string> = {}) => {
      let text = oneOf(templates);
      for (const [key, value] of Object.entries(replacements)) {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
      }
      minuteOffset += randomInt(1, 3);
      lines.push({ sender, text, timestamp: this.fakeTime(baseHour, minuteOffset) });
    };

    // ── 1. Greeting ─────────────────────────────
    addLine('user', phrases.userGreeting);
    addLine('bot', phrases.botGreeting, { business: scenario.businessName });

    // ── 2. Process intents in logical order ─────
    const intentOrder = [
      Intent.PRECIOS, Intent.PROMOS, Intent.HORARIOS,
      Intent.UBICACION, Intent.PAGOS, Intent.DELIVERY_RETIRO,
      Intent.TURNO, Intent.PRESUPUESTO, Intent.PEDIR
    ];

    for (const intent of intentOrder) {
      if (!config.intents.includes(intent)) continue;

      switch (intent) {
        case Intent.PRECIOS:
          addLine('user', phrases.askPrices);
          this.addPricesFlow(lines, phrases, scenario, baseHour, minuteOffset);
          minuteOffset += 3;
          break;

        case Intent.PROMOS:
          this.addPromoFlow(lines, phrases, scenario, baseHour, minuteOffset);
          minuteOffset += 4;
          break;

        case Intent.HORARIOS:
          addLine('user', phrases.askHours);
          addLine('bot', phrases.botHours, { hours: scenario.hoursText });
          break;

        case Intent.UBICACION:
          addLine('user', phrases.askLocation);
          addLine('bot', phrases.botLocation, { address: scenario.address });
          break;

        case Intent.PAGOS:
          addLine('user', phrases.askPayments);
          addLine('bot', phrases.botPayments, { paymentMethods: this.formatPayments(scenario) });
          break;

        case Intent.DELIVERY_RETIRO:
          addLine('user', phrases.askDelivery);
          addLine('bot', phrases.botDelivery, { deliveryInfo: this.formatDeliveryInfo(scenario) });
          break;

        case Intent.TURNO:
          this.addTurnoFlow(lines, phrases, baseHour, minuteOffset);
          minuteOffset += 6;
          break;

        case Intent.PRESUPUESTO:
          this.addPresupuestoFlow(lines, phrases, scenario, baseHour, minuteOffset);
          minuteOffset += 6;
          break;

        case Intent.PEDIR:
          this.addOrderFlow(lines, phrases, scenario, config, baseHour, minuteOffset);
          minuteOffset += 12;
          break;
      }
    }

    // ── 3. Process extras (pet friendly, comer local) ───
    if (config.extras.includes(Extra.PET_FRIENDLY)) {
      addLine('user', phrases.userPetFriendly);
      if (scenario.extras.petFriendly) {
        addLine('bot', phrases.botPetFriendlyYes);
      } else {
        addLine('bot', phrases.botPetFriendlyNo);
      }
    }

    if (config.extras.includes(Extra.COMER_LOCAL)) {
      addLine('user', phrases.userComerLocal);
      if (scenario.extras.comerLocal) {
        addLine('bot', phrases.botComerLocalYes);
      } else {
        addLine('bot', phrases.botComerLocalNo);
      }
    }

    // ── 4. Closing ──────────────────────────────
    addLine('bot', phrases.askMore);
    addLine('user', phrases.userThanks);
    addLine('bot', phrases.closing);

    return lines;
  }

  // ── Flow builders ───────────────────────────────────────

  private addPromoFlow(lines: ChatLine[], phrases: any, scenario: Scenario, baseHour: number, offset: number) {
    const items = scenario.items || scenario.services || [];
    const promoItem = items.length > 0 ? oneOf(items).name : 'producto estrella';
    const comboItem = items.length > 1 ? items[1].name : promoItem;
    const comboPrice = items.length > 0 ? `$${Math.round((items[0].price || 100) * 1.5)}` : '$999';

    lines.push({
      sender: 'user',
      text: oneOf(phrases.askPromos),
      timestamp: this.fakeTime(baseHour, offset + 1)
    });
    let promoText = oneOf(phrases.botPromos as string[]);
    promoText = promoText.replace(/\{promoItem\}/g, promoItem)
      .replace(/\{comboItem\}/g, comboItem)
      .replace(/\{comboPrice\}/g, comboPrice);
    lines.push({
      sender: 'bot',
      text: promoText,
      timestamp: this.fakeTime(baseHour, offset + 2)
    });
  }

  private addTurnoFlow(lines: ChatLine[], phrases: any, baseHour: number, offset: number) {
    lines.push({ sender: 'user', text: oneOf(phrases.askTurno), timestamp: this.fakeTime(baseHour, offset + 1) });
    lines.push({ sender: 'bot', text: oneOf(phrases.botTurno), timestamp: this.fakeTime(baseHour, offset + 2) });
    lines.push({ sender: 'user', text: oneOf(phrases.userTurnoResponse), timestamp: this.fakeTime(baseHour, offset + 3) });

    const days = this.lang === 'es'
      ? ['jueves 15:00', 'miércoles 10:00', 'viernes 11:30']
      : ['Thursday 3:00 PM', 'Wednesday 10:00 AM', 'Friday 11:30 AM'];
    let confirmText = oneOf(phrases.botTurnoConfirm as string[]);
    confirmText = confirmText.replace(/\{turnoDay\}/g, oneOf(days));
    lines.push({ sender: 'bot', text: confirmText, timestamp: this.fakeTime(baseHour, offset + 4) });
  }

  private addPresupuestoFlow(lines: ChatLine[], phrases: any, scenario: Scenario, baseHour: number, offset: number) {
    const services = scenario.services || scenario.items || [];
    const service = services.length > 0 ? oneOf(services) : { name: 'service', price: 10000 };

    lines.push({ sender: 'user', text: oneOf(phrases.askPresupuesto), timestamp: this.fakeTime(baseHour, offset + 1) });
    lines.push({ sender: 'bot', text: oneOf(phrases.botPresupuesto), timestamp: this.fakeTime(baseHour, offset + 2) });

    let detailText = oneOf(phrases.userPresupuestoDetail as string[]);
    detailText = detailText.replace(/\{serviceDesc\}/g, service.name.toLowerCase());
    lines.push({ sender: 'user', text: detailText, timestamp: this.fakeTime(baseHour, offset + 3) });

    let responseText = oneOf(phrases.botPresupuestoResponse as string[]);
    responseText = responseText.replace(/\{serviceDesc\}/g, service.name.toLowerCase())
      .replace(/\{presupuestoPrice\}/g, String(service.price || 10000));
    lines.push({ sender: 'bot', text: responseText, timestamp: this.fakeTime(baseHour, offset + 4) });
  }

  // ── Prices with PDF / Link / Text variation ──────────────

  private addPricesFlow(lines: ChatLine[], phrases: any, scenario: Scenario, baseHour: number, offset: number) {
    const variant = randomInt(0, 2); // 0=text list, 1=PDF attachment, 2=link
    const businessSlug = scenario.businessName.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (variant === 1) {
      // PDF attachment style
      const pdfMsg = this.lang === 'es'
        ? `¡Sí! Te comparto nuestro catálogo actualizado 👇`
        : `Sure! Here's our updated catalog 👇`;
      lines.push({ sender: 'bot', text: pdfMsg, timestamp: this.fakeTime(baseHour, offset + 1) });

      const pdfAttach = `📎 catalogo_${businessSlug}.pdf`;
      lines.push({ sender: 'bot', text: pdfAttach, timestamp: this.fakeTime(baseHour, offset + 2) });
    } else if (variant === 2) {
      // Link style
      const linkMsg = this.lang === 'es'
        ? `¡Claro! Te paso el link de nuestro menú/catálogo para que lo veas tranquilo:`
        : `Of course! Here's the link to our menu/catalog:`;
      lines.push({ sender: 'bot', text: linkMsg, timestamp: this.fakeTime(baseHour, offset + 1) });

      const linkUrl = `🔗 www.${businessSlug}.com/menu`;
      lines.push({ sender: 'bot', text: linkUrl, timestamp: this.fakeTime(baseHour, offset + 2) });
    } else {
      // Classic text list
      const priceList = this.formatPriceList(scenario);
      let text = oneOf(phrases.botPrices as string[]);
      text = text.replace(/\{priceList\}/g, priceList);
      lines.push({ sender: 'bot', text, timestamp: this.fakeTime(baseHour, offset + 1) });
    }
  }

  // ── Order flow with 3 items + removal variation ──────────

  private addOrderFlow(lines: ChatLine[], phrases: any, scenario: Scenario, config: SimulationConfig, baseHour: number, offset: number) {
    const items = scenario.items || scenario.services || [];
    // Always try to pick 3 items for a richer conversation
    const pickCount = Math.min(3, items.length);
    const selectedItems = pickN(items, pickCount);
    const itemNames = selectedItems.map(i => i.name);
    const orderStr = itemNames.join(' + ');
    let off = offset;

    // Ask to order
    lines.push({ sender: 'user', text: oneOf(phrases.askOrder), timestamp: this.fakeTime(baseHour, off + 1) });

    // Bot shows items
    let offerText = oneOf(phrases.botOfferItems as string[]);
    offerText = offerText.replace(/\{itemList\}/g, this.formatPriceList(scenario));
    lines.push({ sender: 'bot', text: offerText, timestamp: this.fakeTime(baseHour, off + 2) });

    // User selects items
    let selectText = oneOf(phrases.userOrderItems as string[]);
    selectText = selectText.replace(/\{orderItems\}/g, orderStr);
    lines.push({ sender: 'user', text: selectText, timestamp: this.fakeTime(baseHour, off + 3) });

    // Bot confirms
    let confirmText = oneOf(phrases.botConfirmItems as string[]);
    confirmText = confirmText.replace(/\{orderItems\}/g, orderStr);
    lines.push({ sender: 'bot', text: confirmText, timestamp: this.fakeTime(baseHour, off + 4) });
    off += 4;

    // ── Customization on one item ────────────────
    if (itemNames.length > 0) {
      const customItem = oneOf(itemNames);
      let customText = oneOf(phrases.customizations as string[]);
      customText = customText.replace(/\{item\}/g, customItem);
      lines.push({ sender: 'user', text: customText, timestamp: this.fakeTime(baseHour, off + 1) });

      const mod = customText.replace(customItem, '').replace(/[,\.!?¿¡]/g, '').trim();
      let botCustom = oneOf(phrases.botCustomConfirm as string[]);
      botCustom = botCustom.replace(/\{item\}/g, customItem).replace(/\{mod\}/g, mod);
      lines.push({ sender: 'bot', text: botCustom, timestamp: this.fakeTime(baseHour, off + 2) });
      off += 2;
    }

    // ── Remove item variation (50% chance when 2+ items) ────
    let removedItem: string | null = null;
    if (selectedItems.length >= 2 && Math.random() < 0.5) {
      // User removes one of the items (often the first one they ordered)
      removedItem = selectedItems[0].name;
      const removeMsg = this.lang === 'es'
        ? oneOf([
            `Ah mirá, al final sacame ${removedItem}, no la quiero.`,
            `Pensándolo mejor, quitá ${removedItem} del pedido.`,
            `Che, ${removedItem} no la llevo. Sacala.`,
            `Disculpá, sacá ${removedItem} que cambié de idea.`
          ])
        : oneOf([
            `Actually, remove the ${removedItem}, I don't want it anymore.`,
            `On second thought, take ${removedItem} off the order.`,
            `Hey, scratch the ${removedItem}. Changed my mind.`,
            `Sorry, drop ${removedItem} from the order please.`
          ]);
      lines.push({ sender: 'user', text: removeMsg, timestamp: this.fakeTime(baseHour, off + 1) });

      const removeConfirm = this.lang === 'es'
        ? oneOf([
            `¡Sin problema! Quito ${removedItem} del pedido. ✅`,
            `Listo, saco ${removedItem}. ¡Sin drama! ✅`,
            `Dale, ${removedItem} eliminado del pedido. ✅`
          ])
        : oneOf([
            `No problem! Removing ${removedItem} from the order. ✅`,
            `Got it, dropping ${removedItem}. No worries! ✅`,
            `Done, ${removedItem} removed from the order. ✅`
          ]);
      lines.push({ sender: 'bot', text: removeConfirm, timestamp: this.fakeTime(baseHour, off + 2) });
      off += 2;
    }

    // ── Delivery / Retiro ───────────────────────
    const wantsDelivery = config.extras.includes(Extra.DELIVERY);
    const wantsRetiro = config.extras.includes(Extra.RETIRO);

    if (wantsDelivery || wantsRetiro) {
      if (wantsDelivery && scenario.extras.delivery) {
        lines.push({ sender: 'user', text: oneOf(phrases.userDeliveryChoice), timestamp: this.fakeTime(baseHour, off + 1) });
        lines.push({ sender: 'bot', text: oneOf(phrases.botAskAddress), timestamp: this.fakeTime(baseHour, off + 2) });
        lines.push({ sender: 'user', text: oneOf(phrases.userAddress), timestamp: this.fakeTime(baseHour, off + 3) });
        off += 3;
      } else if (wantsRetiro) {
        lines.push({ sender: 'user', text: oneOf(phrases.userRetiroChoice), timestamp: this.fakeTime(baseHour, off + 1) });
        off += 1;
      }
    } else {
      lines.push({ sender: 'bot', text: oneOf(phrases.botAskDeliveryOrRetiro), timestamp: this.fakeTime(baseHour, off + 1) });
      lines.push({ sender: 'user', text: oneOf(phrases.userDeliveryChoice), timestamp: this.fakeTime(baseHour, off + 2) });
      lines.push({ sender: 'bot', text: oneOf(phrases.botAskAddress), timestamp: this.fakeTime(baseHour, off + 3) });
      lines.push({ sender: 'user', text: oneOf(phrases.userAddress), timestamp: this.fakeTime(baseHour, off + 4) });
      off += 4;
    }

    // ── Urgent ──────────────────────────────────
    if (config.extras.includes(Extra.URGENTE)) {
      lines.push({ sender: 'user', text: oneOf(phrases.userUrgent), timestamp: this.fakeTime(baseHour, off + 1) });
      let urgentText = oneOf(phrases.botUrgent as string[]);
      urgentText = urgentText.replace(/\{eta\}/g, String(randomInt(25, 50)));
      lines.push({ sender: 'bot', text: urgentText, timestamp: this.fakeTime(baseHour, off + 2) });
      off += 2;
    }

    // ── Payment ─────────────────────────────────
    const paymentPref = this.getPaymentPreference(config, scenario);
    if (paymentPref) {
      const paymentMethods = this.formatPayments(scenario);
      let askPayText = oneOf(phrases.botAskPayment as string[]);
      askPayText = askPayText.replace(/\{paymentMethods\}/g, paymentMethods);
      lines.push({ sender: 'bot', text: askPayText, timestamp: this.fakeTime(baseHour, off + 1) });

      let choiceText = oneOf(phrases.userPaymentChoice as string[]);
      choiceText = choiceText.replace(/\{paymentChoice\}/g, paymentPref);
      lines.push({ sender: 'user', text: choiceText, timestamp: this.fakeTime(baseHour, off + 2) });
      off += 2;
    }

    // ── Order summary (excluding removed item) ──
    const finalItems = removedItem
      ? selectedItems.filter(i => i.name !== removedItem)
      : selectedItems;
    const summaryParts: string[] = [];
    finalItems.forEach(i => {
      summaryParts.push(`• ${i.name}${i.price ? ` — $${i.price}` : ''}`);
    });
    const summaryStr = summaryParts.join('\n');

    let summaryText = oneOf(phrases.botOrderSummary as string[]);
    summaryText = summaryText.replace(/\{summary\}/g, summaryStr);
    lines.push({ sender: 'bot', text: summaryText, timestamp: this.fakeTime(baseHour, off + 1) });
    lines.push({ sender: 'user', text: oneOf(phrases.userConfirmOrder), timestamp: this.fakeTime(baseHour, off + 2) });
    lines.push({ sender: 'bot', text: oneOf(phrases.botOrderConfirmed), timestamp: this.fakeTime(baseHour, off + 3) });
  }

  // ── Formatting helpers ──────────────────────────────────

  private formatPriceList(scenario: Scenario): string {
    const items = scenario.items || scenario.services || [];
    return items.map(i => `• ${i.name}${i.price ? ` — $${i.price}` : ''}`).join('\n');
  }

  private formatPayments(scenario: Scenario): string {
    const methods: string[] = [];
    if (this.lang === 'es') {
      if (scenario.payments.efectivo) methods.push('Efectivo');
      if (scenario.payments.transferencia) methods.push('Transferencia');
      if (scenario.payments.tarjeta) methods.push('Tarjeta');
    } else {
      if (scenario.payments.efectivo) methods.push('Cash');
      if (scenario.payments.transferencia) methods.push('Transfer');
      if (scenario.payments.tarjeta) methods.push('Card');
    }
    return methods.join(', ');
  }

  private formatDeliveryInfo(scenario: Scenario): string {
    const parts: string[] = [];
    if (this.lang === 'es') {
      if (scenario.extras.delivery) parts.push('Hacemos delivery');
      if (scenario.extras.retiro) parts.push('podés retirar en el local');
      if (parts.length === 0) parts.push('Por el momento no contamos con envío');
    } else {
      if (scenario.extras.delivery) parts.push('We offer delivery');
      if (scenario.extras.retiro) parts.push('you can pick up at our location');
      if (parts.length === 0) parts.push('We don\'t currently offer delivery');
    }
    return parts.join(this.lang === 'es' ? ' y también ' : ' and ');
  }

  private getPaymentPreference(config: SimulationConfig, scenario: Scenario): string | null {
    if (config.extras.includes(Extra.PAGO_TRANSFERENCIA) && scenario.payments.transferencia) {
      return this.lang === 'es' ? 'transferencia' : 'transfer';
    }
    if (config.extras.includes(Extra.PAGO_EFECTIVO) && scenario.payments.efectivo) {
      return this.lang === 'es' ? 'efectivo' : 'cash';
    }
    if (config.extras.includes(Extra.PAGO_TARJETA) && scenario.payments.tarjeta) {
      return this.lang === 'es' ? 'tarjeta' : 'card';
    }
    return null;
  }

  private fakeTime(baseHour: number, offsetMinutes: number): string {
    const h = baseHour + Math.floor(offsetMinutes / 60);
    const m = offsetMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
}
