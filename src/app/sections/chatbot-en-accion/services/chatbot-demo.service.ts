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
    const ui = this.getUI();
    const lines: ChatLine[] = [];
    let minuteOffset = 0;
    this._startTime = new Date();

    const addLine = (sender: 'user' | 'bot', templates: string[], replacements: Record<string, string> = {}) => {
      let text = oneOf(templates);
      for (const [key, value] of Object.entries(replacements)) {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
      }
      minuteOffset += randomInt(1, 2);
      lines.push({ sender, text, timestamp: this.ts(minuteOffset) });
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

    const activeIntents = intentOrder.filter(i => config.intents.includes(i));

    activeIntents.forEach((intent, index) => {
      const isFirst = index === 0;
      const intentLabel = (ui.intents[intent] || intent).toLowerCase();

      switch (intent) {
        case Intent.PRECIOS:
          this.addPricesFlow(lines, phrases, scenario, minuteOffset, false);
          minuteOffset += 3;
          break;

        case Intent.PROMOS:
          this.addPromoFlow(lines, phrases, scenario, minuteOffset, false);
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
          this.addTurnoFlow(lines, phrases, minuteOffset, false);
          minuteOffset += 6;
          break;

        case Intent.PRESUPUESTO:
          this.addPresupuestoFlow(lines, phrases, scenario, minuteOffset, false);
          minuteOffset += 6;
          break;

        case Intent.PEDIR: {
          const menuAlreadyShown = config.intents.includes(Intent.PRECIOS);
          this.addOrderFlow(lines, phrases, scenario, config, minuteOffset, false, menuAlreadyShown);
          minuteOffset += 18;
          break;
        }
      }
    });

    // ── 3. Process extras ───────────────
    config.extras.forEach(extra => {
      if (extra === Extra.PET_FRIENDLY) {
        addLine('user', phrases.userPetFriendly);
        addLine('bot', scenario.extras.petFriendly ? phrases.botPetFriendlyYes : phrases.botPetFriendlyNo);
      }
      if (extra === Extra.COMER_LOCAL) {
        addLine('user', phrases.userComerLocal);
        addLine('bot', scenario.extras.comerLocal ? phrases.botComerLocalYes : phrases.botComerLocalNo);
      }
    });

    // ── 4. Closing ──────────────────────────────
    addLine('bot', phrases.askMore);
    addLine('user', phrases.userThanks);
    addLine('bot', phrases.closing);

    return lines;
  }

  /** Shared start time for script generation */
  private _startTime = new Date();

  /** Timestamp: adds offsetMinutes to _startTime */
  private ts(offsetMinutes: number): string {
    const d = new Date(this._startTime.getTime() + offsetMinutes * 60000);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  // ── Flow builders (Updated with skipUserAsk) ─────────────

  private addPromoFlow(lines: ChatLine[], phrases: any, scenario: Scenario, offset: number, skipUserAsk: boolean = false) {
    const items = scenario.items || scenario.services || [];
    const promoItem = items.length > 0 ? oneOf(items).name : 'producto estrella';
    const comboItem = items.length > 1 ? items[1].name : promoItem;
    const comboPrice = items.length > 0 ? `$${Math.round((items[0].price || 100) * 1.5)}` : '$999';

    if (!skipUserAsk) {
      lines.push({ sender: 'user', text: oneOf(phrases.askPromos), timestamp: this.ts(offset + 1) });
    }

    let promoText = oneOf(phrases.botPromos as string[]);
    promoText = promoText.replace(/\{promoItem\}/g, promoItem)
      .replace(/\{comboItem\}/g, comboItem)
      .replace(/\{comboPrice\}/g, comboPrice);
    lines.push({ sender: 'bot', text: promoText, timestamp: this.ts(offset + 2) });
  }

  private addTurnoFlow(lines: ChatLine[], phrases: any, offset: number, skipUserAsk: boolean = false) {
    if (!skipUserAsk) {
      lines.push({ sender: 'user', text: oneOf(phrases.askTurno), timestamp: this.ts(offset + 1) });
    }
    lines.push({ sender: 'bot', text: oneOf(phrases.botTurno), timestamp: this.ts(offset + 2) });
    lines.push({ sender: 'user', text: oneOf(phrases.userTurnoResponse), timestamp: this.ts(offset + 3) });

    const days = this.lang === 'es'
      ? ['jueves 15:00', 'miércoles 10:00', 'viernes 11:30']
      : ['Thursday 3:00 PM', 'Wednesday 10:00 AM', 'Friday 11:30 AM'];
    let confirmText = oneOf(phrases.botTurnoConfirm as string[]);
    confirmText = confirmText.replace(/\{turnoDay\}/g, oneOf(days));
    lines.push({ sender: 'bot', text: confirmText, timestamp: this.ts(offset + 4) });
  }

  private addPresupuestoFlow(lines: ChatLine[], phrases: any, scenario: Scenario, offset: number, skipUserAsk: boolean = false) {
    const services = scenario.services || scenario.items || [];
    const service = services.length > 0 ? oneOf(services) : { name: 'service', price: 10000 };

    if (!skipUserAsk) {
      lines.push({ sender: 'user', text: oneOf(phrases.askPresupuesto), timestamp: this.ts(offset + 1) });
    }
    lines.push({ sender: 'bot', text: oneOf(phrases.botPresupuesto), timestamp: this.ts(offset + 2) });

    let detailText = oneOf(phrases.userPresupuestoDetail as string[]);
    detailText = detailText.replace(/\{serviceDesc\}/g, service.name.toLowerCase());
    lines.push({ sender: 'user', text: detailText, timestamp: this.ts(offset + 3) });

    let responseText = oneOf(phrases.botPresupuestoResponse as string[]);
    responseText = responseText.replace(/\{serviceDesc\}/g, service.name.toLowerCase())
      .replace(/\{presupuestoPrice\}/g, String(service.price || 10000));
    lines.push({ sender: 'bot', text: responseText, timestamp: this.ts(offset + 4) });
  }

  private addPricesFlow(lines: ChatLine[], phrases: any, scenario: Scenario, offset: number, skipUserAsk: boolean = false) {
    const items = scenario.items || scenario.services || [];
    const randomItem = items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
    let off = offset;

    // User asks about a specific product price (more natural)
    if (!skipUserAsk) {
      const specificAsk = randomItem && Math.random() < 0.5
        ? (this.lang === 'es'
          ? oneOf([`¿Cuánto sale la ${randomItem.name}?`, `¿Qué precio tiene la ${randomItem.name}?`, `Me podrían pasar los precios? Principalmente la ${randomItem.name}.`])
          : oneOf([`How much is the ${randomItem.name}?`, `What's the price for ${randomItem.name}?`, `Can you share prices? Mainly for the ${randomItem.name}.`]))
        : oneOf(phrases.askPrices as string[]);
      lines.push({ sender: 'user', text: specificAsk, timestamp: this.ts(off + 1) });
    }

    // Bot responds with the PDF catalog
    const introMsg = this.lang === 'es'
      ? oneOf([
        '¡Por supuesto! Te envío la carta completa con los precios:',
        '¡Con gusto! Acá te paso nuestro menú actualizado:',
        '¡Dale! Te comparto el catálogo para que veas todo:'
      ])
      : oneOf([
        'Of course! Here\'s our full menu with prices:',
        'Sure! Sending you our updated catalog:',
        'Here you go! Check out our complete menu:'
      ]);
    lines.push({ sender: 'bot', text: introMsg, timestamp: this.ts(off + 2) });
    lines.push({ sender: 'bot', text: `Menú_${scenario.businessName.replace(/\s+/g, '_')}.pdf`, timestamp: this.ts(off + 3) });

    // Natural follow-up bot message about a specific item
    if (randomItem) {
      const followUp = this.lang === 'es'
        ? oneOf([
          `La ${randomItem.name} está a $${randomItem.price}. ¿Le interesa alguno?`,
          `Nuestra ${randomItem.name}, por ejemplo, sale $${randomItem.price}. ¿Qué le parece?`,
          `La estrella de la casa es la ${randomItem.name} a $${randomItem.price}. ¿Le gustaría probarla? 😊`
        ])
        : oneOf([
          `The ${randomItem.name} is $${randomItem.price}. Does any option interest you?`,
          `For example, our ${randomItem.name} goes for $${randomItem.price}. What do you think?`,
          `Our bestseller is the ${randomItem.name} at $${randomItem.price}. Would you like to try it? 😊`
        ]);
      lines.push({ sender: 'bot', text: followUp, timestamp: this.ts(off + 4) });
    }
  }

  private addOrderFlow(lines: ChatLine[], phrases: any, scenario: Scenario, config: SimulationConfig, offset: number, skipUserAsk: boolean = false, menuAlreadyShown: boolean = false) {
    const items = scenario.items || scenario.services || [];
    const pickCount = Math.min(3, items.length);
    const selectedItems = pickN(items, pickCount);
    const itemNames = selectedItems.map(i => i.name);
    const orderStr = itemNames.join(' + ');
    let off = offset;

    // User says they want to order
    if (!skipUserAsk) {
      lines.push({ sender: 'user', text: oneOf(phrases.askOrder), timestamp: this.ts(off + 1) });
    }

    if (!menuAlreadyShown) {
      // Bot asks if user read the menu, then sends PDF
      const askMenuMsg = this.lang === 'es'
        ? oneOf(['¡Claro! ¿Ya viste nuestro menú o te lo paso?', '¡Por supuesto! ¿Querés que te pase la carta?', '¡Dale! ¿Ya tenés el menú o te lo envío?'])
        : oneOf(['Sure! Have you seen our menu or shall I send it?', 'Of course! Would you like me to send you the menu?', 'Great! Do you have the menu or should I share it?']);
      lines.push({ sender: 'bot', text: askMenuMsg, timestamp: this.ts(off + 2) });

      const userNoMenu = this.lang === 'es'
        ? oneOf(['No lo vi, pasámelo porfa.', 'Pasámelo, no lo tengo.', 'No, mandámelo.'])
        : oneOf(['I haven\'t seen it, please send it.', 'Send it over, I don\'t have it.', 'No, please share it.']);
      lines.push({ sender: 'user', text: userNoMenu, timestamp: this.ts(off + 3) });

      const menuMsg = this.lang === 'es'
        ? '¡Ahí te va! Revisalo y decime qué te gustaría pedir. 😊'
        : 'Here you go! Take a look and let me know what you\'d like to order. 😊';
      lines.push({ sender: 'bot', text: menuMsg, timestamp: this.ts(off + 4) });
      lines.push({ sender: 'bot', text: `Menú_${scenario.businessName.replace(/\s+/g, '_')}.pdf`, timestamp: this.ts(off + 5) });
      off += 5;
    } else {
      // Prices were already shown — bot simply confirms it can take the order
      const readyMsg = this.lang === 'es'
        ? oneOf(['¡Perfecto! ¿Qué le gustaría pedir?', '¡Genial! ¿Ya eligió algo del menú?', '¡Dale! ¿Qué va a ser?'])
        : oneOf(['Great! What would you like to order?', 'Perfect! Did you choose something from the menu?', 'Awesome! What\'ll it be?']);
      lines.push({ sender: 'bot', text: readyMsg, timestamp: this.ts(off + 2) });
      off += 2;
    }

    // User selects items
    let selectText = oneOf(phrases.userOrderItems as string[]);
    selectText = selectText.replace(/\{orderItems\}/g, orderStr);
    lines.push({ sender: 'user', text: selectText, timestamp: this.ts(off + 1) });

    // Bot confirms
    let confirmText = oneOf(phrases.botConfirmItems as string[]);
    confirmText = confirmText.replace(/\{orderItems\}/g, orderStr);
    lines.push({ sender: 'bot', text: confirmText, timestamp: this.ts(off + 2) });
    off += 2;

    // ── Customization on one item ────────────────
    if (itemNames.length > 0) {
      const customItem = oneOf(itemNames);
      let customText = oneOf(phrases.customizations as string[]);
      customText = customText.replace(/\{item\}/g, customItem);
      lines.push({ sender: 'user', text: customText, timestamp: this.ts(off + 1) });

      const mod = customText.replace(customItem, '').replace(/[,\.!?¿¡]/g, '').trim();
      let botCustom = oneOf(phrases.botCustomConfirm as string[]);
      botCustom = botCustom.replace(/\{item\}/g, customItem).replace(/\{mod\}/g, mod);
      lines.push({ sender: 'bot', text: botCustom, timestamp: this.ts(off + 2) });
      off += 2;
    }

    // ── Remove item variation (50% chance when 2+ items) ────
    let removedItem: string | null = null;
    if (selectedItems.length >= 2 && Math.random() < 0.5) {
      removedItem = selectedItems[0].name;
      const removeMsg = this.lang === 'es'
        ? oneOf([
          `Ah mirá, al final sacame ${removedItem}, no la quiero.`,
          `Pensándolo mejor, quitá ${removedItem} del pedido.`,
          `Disculpá, sacá ${removedItem} que cambié de idea.`
        ])
        : oneOf([
          `Actually, remove the ${removedItem}, I don't want it anymore.`,
          `On second thought, take ${removedItem} off the order.`,
          `Sorry, drop ${removedItem} from the order please.`
        ]);
      lines.push({ sender: 'user', text: removeMsg, timestamp: this.ts(off + 1) });

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
      lines.push({ sender: 'bot', text: removeConfirm, timestamp: this.ts(off + 2) });
      off += 2;
    }

    // ── Delivery / Retiro ───────────────────────
    const wantsDelivery = config.extras.includes(Extra.DELIVERY);
    const wantsRetiro = config.extras.includes(Extra.RETIRO);

    if (wantsDelivery || wantsRetiro) {
      if (wantsDelivery && scenario.extras.delivery) {
        lines.push({ sender: 'user', text: oneOf(phrases.userDeliveryChoice), timestamp: this.ts(off + 1) });
        lines.push({ sender: 'bot', text: oneOf(phrases.botAskAddress), timestamp: this.ts(off + 2) });
        lines.push({ sender: 'user', text: oneOf(phrases.userAddress), timestamp: this.ts(off + 3) });
        off += 3;
      } else if (wantsRetiro) {
        lines.push({ sender: 'user', text: oneOf(phrases.userRetiroChoice), timestamp: this.ts(off + 1) });
        off += 1;
      }
    } else {
      lines.push({ sender: 'bot', text: oneOf(phrases.botAskDeliveryOrRetiro), timestamp: this.ts(off + 1) });
      lines.push({ sender: 'user', text: oneOf(phrases.userRetiroChoice), timestamp: this.ts(off + 2) });
      off += 2;
    }

    // ── Urgent ──────────────────────────────────
    if (config.extras.includes(Extra.URGENTE)) {
      lines.push({ sender: 'user', text: oneOf(phrases.userUrgent), timestamp: this.ts(off + 1) });
      let urgentText = oneOf(phrases.botUrgent as string[]);
      urgentText = urgentText.replace(/\{eta\}/g, String(randomInt(25, 50)));
      lines.push({ sender: 'bot', text: urgentText, timestamp: this.ts(off + 2) });
      off += 2;
    }

    // ── Payment ─────────────────────────────────
    const finalItems = removedItem
      ? selectedItems.filter(i => i.name !== removedItem)
      : selectedItems;
    const totalPrice = finalItems.reduce((sum, i) => sum + (i.price || 0), 0);

    const paymentMethods = this.formatPayments(scenario);
    const totalLabel = this.lang === 'es'
      ? `El total de tu pedido es de $${totalPrice}. ¿Con qué medio de pago abonás? (${paymentMethods})`
      : `Your order total is $${totalPrice}. How would you like to pay? (${paymentMethods})`;
    lines.push({ sender: 'bot', text: totalLabel, timestamp: this.ts(off + 1) });

    const paymentPref = this.getPaymentPreference(config, scenario)
      || (this.lang === 'es' ? 'transferencia' : 'transfer');
    let choiceText = oneOf(phrases.userPaymentChoice as string[]);
    choiceText = choiceText.replace(/\{paymentChoice\}/g, paymentPref);
    lines.push({ sender: 'user', text: choiceText, timestamp: this.ts(off + 2) });
    off += 2;

    const paymentConfirm = this.getPaymentConfirmation(paymentPref);
    lines.push({ sender: 'bot', text: paymentConfirm, timestamp: this.ts(off + 1) });
    off += 1;

    // ── Order summary ──────────────────────────
    const summaryParts: string[] = [];
    finalItems.forEach(i => {
      summaryParts.push(`• ${i.name}${i.price ? ` — $${i.price}` : ''}`);
    });
    const deliveryMode = wantsDelivery ? 'Delivery' : (this.lang === 'es' ? 'Retiro en local' : 'Pickup');
    const summaryStr = summaryParts.join('\n')
      + `\n\n💰 Total: $${totalPrice}`
      + `\n💳 ${this.lang === 'es' ? 'Pago' : 'Payment'}: ${paymentPref}`
      + `\n📦 ${this.lang === 'es' ? 'Entrega' : 'Delivery'}: ${deliveryMode}`;

    let summaryText = oneOf(phrases.botOrderSummary as string[]);
    summaryText = summaryText.replace(/\{summary\}/g, summaryStr);
    lines.push({ sender: 'bot', text: summaryText, timestamp: this.ts(off + 1) });
    lines.push({ sender: 'user', text: oneOf(phrases.userConfirmOrder), timestamp: this.ts(off + 2) });
    lines.push({ sender: 'bot', text: oneOf(phrases.botOrderConfirmed), timestamp: this.ts(off + 3) });
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

  /** Payment-specific confirmation with QR, alias, link, or cash */
  private getPaymentConfirmation(method: string): string {
    const methodLower = method.toLowerCase();
    if (this.lang === 'es') {
      if (methodLower.includes('tarjeta') || methodLower.includes('card')) {
        return '¡Perfecto! Te envío el link de pago para que abones con tarjeta:\n\n🔗 https://pay.wg-agentes.com/checkout/A7x9K\n\nUna vez procesado, te confirmo el pedido. ✅';
      } else if (methodLower.includes('transferencia') || methodLower.includes('transfer')) {
        return '¡Dale! Te paso los datos para la transferencia:\n\n🏦 Alias: negocio.demo.wg\nCBU: 0000003100092817364529\nTitular: WG Demo S.A.\n\nEnviame el comprobante cuando lo hagas. ✅';
      } else if (methodLower.includes('efectivo') || methodLower.includes('cash')) {
        return '¡Perfecto! Abonás en efectivo al momento de la entrega. 💵';
      }
      return '¡Recibido! Procesamos tu pago. ✅';
    } else {
      if (methodLower.includes('card')) {
        return 'Great! Here\'s the payment link to pay by card:\n\n🔗 https://pay.wg-agents.com/checkout/A7x9K\n\nOnce processed, we\'ll confirm your order. ✅';
      } else if (methodLower.includes('transfer')) {
        return 'Sure! Here are the transfer details:\n\n🏦 Account: demo-business-wg\nRouting: 0000003100092817364529\nName: WG Demo Inc.\n\nSend the receipt once done. ✅';
      } else if (methodLower.includes('cash')) {
        return 'Perfect! You\'ll pay cash upon delivery. 💵';
      }
      return 'Received! Processing your payment. ✅';
    }
  }
}
