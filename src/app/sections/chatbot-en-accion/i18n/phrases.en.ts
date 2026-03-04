// ─── UI Labels (English) ──────────────────────────────────
export const UI_EN = {
  sectionTitle: 'The Chatbot in Action',
  sectionSubtitle: 'Watch how our AI Agent transforms a simple inquiry into a qualified opportunity.',
  rubroLabel: 'Industry',
  styleLabel: 'Style',
  intentsLabel: 'What do you want to simulate?',
  extrasLabel: 'Additional details',
  simulateBtn: '▶ Simulate',
  regenerateBtn: '🔄 Try another / Regenerate',
  inputPlaceholder: 'Message (demo)',
  online: 'online',
  typing: 'typing…',

  rubros: {
    aleatorio: '🎲 Random',
    hamburgueseria: '🍔 Burger Joint',
    lomiteria: '🥖 Sandwich Shop',
    estetica: '💅 Beauty Salon',
    centro_salud: '🏥 Health Center',
    indumentaria: '👗 Clothing Store',
    taller_mecanico: '🔧 Auto Shop',
    gimnasio: '🏋️ Gym'
  },
  styles: {
    formal: 'Formal',
    neutro: 'Neutral',
    canchero: 'Casual'
  },
  intents: {
    PEDIR: 'Order product/service',
    PRECIOS: 'Check prices / catalog',
    HORARIOS: 'Business hours',
    UBICACION: 'Location',
    PAGOS: 'Payment methods',
    DELIVERY_RETIRO: 'Delivery / Pickup',
    PROMOS: 'Promos / combos',
    TURNO: 'Book appointment',
    PRESUPUESTO: 'Request quote'
  },
  extras: {
    DELIVERY: 'I want delivery',
    RETIRO: 'I prefer pickup',
    PAGO_TRANSFERENCIA: 'Pay by transfer',
    PAGO_EFECTIVO: 'Pay with cash',
    PAGO_TARJETA: 'Pay by card',
    URGENTE: 'It\'s for today (urgent)',
    PET_FRIENDLY: 'Is it pet friendly?',
    COMER_LOCAL: 'I want to dine in'
  }
};

// ─── Conversation Phrases (English) by Style ──────────────
export const PHRASES_EN: Record<string, any> = {
  formal: {
    userGreeting: [
      'Hi, good afternoon.',
      'Hello! I\'d like to ask something.',
      'Hi, how are you?',
      'Good afternoon, could you help me?'
    ],
    botGreeting: [
      'Welcome to {business}! 😊 I\'m the virtual assistant. How may I help you?',
      'Good day, thank you for reaching out to {business}. I\'m at your service.',
      'Hello, welcome to {business}. How can I assist you today?'
    ],
    askMore: [
      'Is there anything else I can help you with?',
      'Would you like to inquire about anything else?',
      'May I assist you with anything else?'
    ],
    closing: [
      'Wonderful! We\'re at your service. Have a great day! 👋',
      'Thank you for reaching out. Have an excellent day!',
      'It was a pleasure assisting you. We look forward to seeing you! 😊'
    ],
    userThanks: [
      'Thank you very much for the information.',
      'Perfect, thank you so much.',
      'Excellent, I appreciate your help.'
    ],
    userNextIntent: [
      'Great. I also wanted to ask about {intent}.',
      'Excellent. One more thing, could you give me info on {intent}?',
      'Perfect. And what about {intent}?',
      'Wonderful. Could you tell me something about {intent}?'
    ],
    botNextIntent: [
      'Sure! Regarding {intent}:',
      'Of course, about {intent} I can tell you:',
      'No problem! Regarding {intent}, here is the information:'
    ],

    askPrices: [
      'Can you share the prices?',
      'How much is the menu?',
      'Could you send me the price list?'
    ],
    botPrices: [
      'Of course. Here are our prices:\n\n{priceList}\n\nWould any of these interest you?',
      'Certainly. I\'m sending our catalog in PDF so you can take a look and choose:\n\n{priceList}',
      'Here\'s our updated catalog. Feel free to check it and let me know what you\'d like:\n\n{priceList}'
    ],
    askHours: [
      'What are your opening hours?',
      'What time do you open and close?',
      'How late are you open?'
    ],
    botHours: [
      'Our business hours are:\n{hours}',
      'We\'re open during the following hours:\n{hours}',
      'Certainly. Our hours are:\n{hours}'
    ],
    askLocation: [
      'What is your address?',
      'Where are you located?',
      'Could you share your location?'
    ],
    botLocation: [
      'We\'re located at: {address} 📍',
      'Our address is: {address} 📍',
      'You can find us at {address}. We look forward to seeing you! 📍'
    ],
    askPayments: [
      'What payment methods do you accept?',
      'What are the available payment options?',
      'I\'d like to know your payment methods.'
    ],
    botPayments: [
      'We accept the following payment methods: {paymentMethods} 💳',
      'Our available payment options are: {paymentMethods}',
      'You can pay via: {paymentMethods} 💳'
    ],
    askDelivery: [
      'Do you deliver?',
      'Do you have delivery?',
      'Can I order for delivery?'
    ],
    botDelivery: [
      '{deliveryInfo}',
      '{deliveryInfo}. Would you like to place an order?',
      'Let me share: {deliveryInfo}'
    ],
    askPromos: [
      'Do you have any promos?',
      'Are there any deals or combos?',
      'What promotions do you have right now?'
    ],
    botPromos: [
      'Yes! We currently have these promotions 🎉:\n\n• 2-for-1 on {promoItem} on Tuesdays\n• {comboItem} + drink combo for {comboPrice}',
      'We have active promotions:\n\n• {promoItem} with 20% OFF\n• Special combo: {comboItem} + side dish',
      'Of course! Here are our promos:\n\n• Tuesday {promoItem} 2-for-1\n• {comboItem} + free drink on Thursdays'
    ],
    askTurno: [
      'Is it possible to book an appointment?',
      'I\'d like to schedule an appointment, please.',
      'How can I book an appointment?'
    ],
    botTurno: [
      'You can schedule your appointment. What day and time would work for you?',
      'I\'d be happy to book you in. Which day works best?',
      'Of course! What service and day would you prefer?'
    ],
    userTurnoResponse: [
      'Thursday afternoon, if possible.',
      'Wednesday morning would work for me.',
      'Do you have availability on Friday?'
    ],
    botTurnoConfirm: [
      'Perfect, your appointment is set for {turnoDay}. We\'ll send you a reminder. ✅',
      'Done! Reserved for {turnoDay}. We look forward to seeing you! ✅',
      'Confirmed: {turnoDay}. You\'ll receive a confirmation message. ✅'
    ],
    askPresupuesto: [
      'Could you provide a quote?',
      'I need a quote for some work.',
      'I\'d like to request an estimate.'
    ],
    botPresupuesto: [
      'Of course! Could you describe what you need?',
      'Certainly. What type of work do you require?',
      'Yes, we provide no-obligation quotes. What do you need?'
    ],
    userPresupuestoDetail: [
      'I need {serviceDesc}.',
      'It\'s for {serviceDesc}, if you could give me an estimate.',
      'It would be {serviceDesc}. How much would it cost approximately?'
    ],
    botPresupuestoResponse: [
      'For {serviceDesc}, the estimated cost is ${presupuestoPrice}. Does that work for you? 📋',
      'Here\'s the quote: {serviceDesc} — ${presupuestoPrice} approx. No obligation. Shall we proceed?',
      'The approximate cost for {serviceDesc} would be ${presupuestoPrice}. Would you like to schedule? 📋'
    ],

    askOrder: [
      'Hi, I\'d like to place an order.',
      'Hello, I want to order for takeout.',
      'What\'s available? I want to order.'
    ],
    botOfferItems: [
      'Of course! Here are our options:\n\n{itemList}\n\nWhat would you like to order?',
      'Certainly! These are our products:\n\n{itemList}\n\nWhat interests you?',
      'Excellent choice. Our menu:\n\n{itemList}\n\nWhat would you like?'
    ],
    userOrderItems: [
      'I\'d like {orderItems}, please.',
      'I\'ll have {orderItems}.',
      'Please give me {orderItems}.'
    ],
    botConfirmItems: [
      'Perfect, noted: {orderItems}. ✅',
      'Got it: {orderItems}. ✅',
      'Noted: {orderItems}. ✅'
    ],
    botAskDeliveryOrRetiro: [
      'Would you like delivery or pickup?',
      'Shall we deliver it or will you pick it up?',
      'Do you prefer delivery or pickup?'
    ],
    userDeliveryChoice: [
      'Delivery, please.',
      'I\'d like it delivered.',
      'Delivery, thank you.'
    ],
    userRetiroChoice: [
      'I\'ll pick it up.',
      'Pickup, please.',
      'I\'ll come get it.'
    ],
    botAskAddress: [
      'What address should we deliver to? 📍',
      'Perfect, what\'s the delivery address? 📍',
      'What\'s the delivery address? 📍'
    ],
    userAddress: [
      '450 Main Street.',
      '1200 Oak Avenue, Apt 3.',
      '890 Elm Street.'
    ],
    botAskPayment: [
      'How would you like to pay? ({paymentMethods})',
      'What payment method do you prefer? We accept: {paymentMethods}',
      'What payment method works best for you? ({paymentMethods})'
    ],
    userPaymentChoice: [
      '{paymentChoice}, please.',
      'I\'ll pay with {paymentChoice}.',
      '{paymentChoice}.'
    ],
    userUrgent: [
      'It\'s for today. Is that possible?',
      'I need it today, can you do it?',
      'Can you have it ready as soon as possible?'
    ],
    botUrgent: [
      'Yes, we can have it ready in approximately {eta} minutes. ⏱️',
      'No problem! We estimate {eta} minutes. ⏱️',
      'We can have it in about {eta} minutes. Sound good? ⏱️'
    ],
    userPetFriendly: [
      'Is the place pet friendly?',
      'Can I bring my pet?',
      'Do you accept pets?'
    ],
    botPetFriendlyYes: [
      'Yes, we\'re pet friendly! 🐶 Your pet is welcome.',
      'Of course! We gladly accept pets. 🐾',
      'Absolutely! We\'re pet friendly. Bring your buddy along! 🐶'
    ],
    botPetFriendlyNo: [
      'Unfortunately, we don\'t allow pets inside. 😔',
      'We\'re not pet friendly at the moment, we apologize.',
      'We don\'t accept pets, but we can deliver your order to your home! 🏠'
    ],
    userComerLocal: [
      'Can I dine in?',
      'Do you have tables for dining in?',
      'Is it possible to eat at the restaurant?'
    ],
    botComerLocalYes: [
      'Yes! We have tables available for dining in. 🍽️',
      'Of course! We have a dining area for you to enjoy your meal here. 🍽️',
      'Absolutely! You can sit down and enjoy your meal at our location. 🍽️'
    ],
    botComerLocalNo: [
      'At the moment, we only offer delivery and pickup service. 📦',
      'We don\'t have seating, but you can pick up your order or have it delivered. 📦',
      'We operate as takeaway and delivery only, we apologize! 📦'
    ],

    customizations: [
      'Actually, hold the onions on {item}.',
      '{item} without tomato, please.',
      'Add extra meat to {item}.',
      'Can you add cheddar to {item}?',
      '{item} with no spice, please.',
      'Switch the fries for sweet potato on {item}.',
      '{item} with double cheese, please.',
      'No mayo on {item}.'
    ],
    botCustomConfirm: [
      'No problem, updating {item}: {mod}. ✅',
      'Done, change applied to {item}: {mod}. ✅',
      'Perfect, noted for {item}: {mod}. ✅'
    ],
    botOrderSummary: [
      'Here\'s your order summary:\n\n{summary}\n\nShall I confirm? ✅',
      'Your order:\n\n{summary}\n\nIs everything correct? ✅',
      'Your order looks like this:\n\n{summary}\n\nWould you like to confirm? ✅'
    ],
    userConfirmOrder: [
      'Yes, confirmed.',
      'Perfect, I confirm the order.',
      'Everything looks good, confirm.'
    ],
    botOrderConfirmed: [
      'Order confirmed! Thank you. We\'re preparing it now. 🙌',
      'Done! Your order has been confirmed. Thank you! 🎉',
      'Confirmed! It\'ll be ready shortly. Thank you! 🙌'
    ]
  },

  neutro: {
    userGreeting: [
      'Hi there!',
      'Hey, how\'s it going?',
      'Hello! I had a question.',
      'Good evening! You guys open?',
      'Hiiii, just a quick one.',
      'Heyy! Can I see the menu?'
    ],
    botGreeting: [
      'Hi! Welcome to {business} 😊 How can I help you?',
      'Hey! I\'m the assistant for {business}. What do you need?',
      'Hello! Thanks for writing to {business}. What can I help with?'
    ],
    askMore: [
      'Anything else you need?',
      'Can I help with anything else?',
      'Want to ask about anything else?'
    ],
    closing: [
      'Awesome! Let us know if you need anything. See you! 👋',
      'Perfect! We\'ll be here. Bye! 😊',
      'Great! See you soon! 👋'
    ],
    userThanks: [
      'Great, thanks!',
      'Cool, thanks for the info!',
      'Perfect, thanks!'
    ],
    userNextIntent: [
      'Great. Hey, and another thing, how about {intent}?',
      'Cool. I also wanted to ask you about {intent}.',
      'Nice. Could you give me some data on {intent}?',
      'Perfect. What about {intent}?'
    ],
    botNextIntent: [
      'Sure! About {intent}:',
      'Of course! Regarding {intent}:',
      'Sure, here is the info on {intent}:'
    ],

    askPrices: [
      'Can you share the prices?',
      'How much do things cost?',
      'I wanted to know the prices.'
    ],
    botPrices: [
      'Sure! Here are our prices:\n\n{priceList}\n\nAnything catch your eye?',
      'Check it out! I\'m sending the PDF catalog so you can pick your favorite:\n\n{priceList}',
      'Here\'s our catalog with prices. Take your time to look through it:\n\n{priceList}'
    ],
    askHours: [
      'What hours are you open?',
      'What are your hours?',
      'How late are you open?'
    ],
    botHours: [
      'Our hours are:\n{hours}',
      'We\'re open:\n{hours}',
      'Here are the hours:\n{hours}'
    ],
    askLocation: [
      'Where are you guys?',
      'What\'s the address?',
      'Can you share the address?'
    ],
    botLocation: [
      'We\'re at: {address} 📍',
      'You can find us at {address} 📍',
      'The address is: {address} 📍'
    ],
    askPayments: [
      'What payment methods do you take?',
      'How can I pay?',
      'Do you take card and transfer?'
    ],
    botPayments: [
      'We accept: {paymentMethods} 💳',
      'You can pay with: {paymentMethods} 💳',
      'Payment methods: {paymentMethods}'
    ],
    askDelivery: [
      'Do you do delivery?',
      'Do you offer delivery?',
      'Can I order delivery?'
    ],
    botDelivery: [
      '{deliveryInfo}',
      'Yes, {deliveryInfo}',
      'Here\'s the deal: {deliveryInfo}'
    ],
    askPromos: [
      'Any promos going on?',
      'Are there any deals right now?',
      'What combos do you have?'
    ],
    botPromos: [
      'Yes! Check it out:\n\n• 2-for-1 on {promoItem} on Tuesdays\n• {comboItem} + drink combo for {comboPrice} 🎉',
      'We\'ve got these promos:\n\n• {promoItem} at 20% OFF\n• Combo: {comboItem} + side 🎉',
      'Sure! Here are the deals:\n\n• Tuesday 2-for-1 on {promoItem}\n• {comboItem} + free drink on Thursdays 🎉'
    ],
    askTurno: [
      'Can I book an appointment?',
      'I want to schedule an appointment.',
      'How do I book?'
    ],
    botTurno: [
      'Sure! What day and time works for you?',
      'Let\'s set it up. What day do you prefer?',
      'Of course! When do you need it?'
    ],
    userTurnoResponse: [
      'Thursday afternoon, would that work?',
      'How about Wednesday morning?',
      'Anything available on Friday?'
    ],
    botTurnoConfirm: [
      'Done! You\'re booked for {turnoDay}. We\'ll send a reminder. ✅',
      'Confirmed: {turnoDay}. See you there! ✅',
      'Perfect, reserved {turnoDay} for you. ✅'
    ],
    askPresupuesto: [
      'Can you give me a quote?',
      'I need a quote.',
      'I wanted to get a quote.'
    ],
    botPresupuesto: [
      'Sure! What do you need?',
      'Yeah, tell me about the job.',
      'Of course, describe what you need.'
    ],
    userPresupuestoDetail: [
      'I need {serviceDesc}.',
      'It\'s for {serviceDesc}.',
      'It would be {serviceDesc}. How much?'
    ],
    botPresupuestoResponse: [
      'For {serviceDesc}, the estimated price is ${presupuestoPrice}. Sound good? 📋',
      'Here\'s the quote: {serviceDesc} — ${presupuestoPrice} approx. 📋',
      'Cost would be ${presupuestoPrice} for {serviceDesc}. Want to set it up? 📋'
    ],

    askOrder: [
      'I want to place an order.',
      'I\'d like to order something!',
      'Can I order?'
    ],
    botOfferItems: [
      'Sure! Here\'s what we have:\n\n{itemList}\n\nWhat can I get you?',
      'Of course! Check out our options:\n\n{itemList}\n\nWhat do you want?',
      'Here\'s the menu:\n\n{itemList}\n\nWhat sounds good?'
    ],
    userOrderItems: [
      'I\'ll take {orderItems}.',
      'I want {orderItems}.',
      'Give me {orderItems}.'
    ],
    botConfirmItems: [
      'Got it! {orderItems}. ✅',
      'Perfect, noted: {orderItems}. ✅',
      'Done: {orderItems}. ✅'
    ],
    botAskDeliveryOrRetiro: [
      'Delivery or pickup?',
      'Want it delivered or will you pick it up?',
      'Delivery or pickup?'
    ],
    userDeliveryChoice: [
      'Delivery.',
      'Have it delivered, please.',
      'Delivery!'
    ],
    userRetiroChoice: [
      'I\'ll pick it up.',
      'Pickup.',
      'I\'ll come get it.'
    ],
    botAskAddress: [
      'What\'s the delivery address? 📍',
      'Sure, what address? 📍',
      'Delivery address? 📍'
    ],
    userAddress: [
      '450 Main Street.',
      '1200 Oak Avenue.',
      '890 Elm Street.'
    ],
    botAskPayment: [
      'How will you pay? ({paymentMethods})',
      'Payment method? We accept: {paymentMethods}',
      'How would you like to pay? ({paymentMethods})'
    ],
    userPaymentChoice: [
      '{paymentChoice}.',
      'With {paymentChoice}.',
      '{paymentChoice}, please.'
    ],
    userUrgent: [
      'It\'s for today, can you make it?',
      'I need it now, is that ok?',
      'Can you have it ready quickly?'
    ],
    botUrgent: [
      'Yes! About {eta} minutes. ⏱️',
      'Sure, we estimate {eta} minutes. ⏱️',
      'We can do it in {eta} minutes approx. ⏱️'
    ],
    userPetFriendly: [
      'Are you pet friendly?',
      'Can I bring my dog?',
      'Do you allow pets?'
    ],
    botPetFriendlyYes: [
      'Yes, we\'re pet friendly! 🐶 Bring your pet along.',
      'Sure! Pets are welcome. 🐾',
      'Yes! Bring your pet, no problem. 🐶'
    ],
    botPetFriendlyNo: [
      'Sorry, we don\'t allow pets. 😔',
      'We\'re not pet friendly at the moment, sorry.',
      'No pets allowed inside, but we can deliver to you. 🏠'
    ],
    userComerLocal: [
      'Can I eat there?',
      'Do you have tables?',
      'Can I dine in?'
    ],
    botComerLocalYes: [
      'Yes! We have tables, come eat here. 🍽️',
      'Sure! We have a dining area for you. 🍽️',
      'Yes! Come dine in, there\'s plenty of room. 🍽️'
    ],
    botComerLocalNo: [
      'We only do delivery and pickup, no tables. 📦',
      'No dining area right now, but you can pick up or get delivery. 📦',
      'We don\'t have seating, but we\'ll deliver to you! 📦'
    ],

    customizations: [
      'Hey, hold the onions on {item}.',
      '{item} without tomato, please.',
      'Add extra meat to {item}.',
      'Can you add cheddar to {item}?',
      '{item} with no spice.',
      'Switch the fries for sweet potato on {item}.',
      '{item} with double cheese.',
      'No mayo on {item}.'
    ],
    botCustomConfirm: [
      'Sure, updating {item}: {mod}. ✅',
      'Done, change on {item}: {mod}. ✅',
      'Got it! {item}: {mod}. ✅'
    ],
    botOrderSummary: [
      'Here\'s your order:\n\n{summary}\n\nConfirm? ✅',
      'Your order:\n\n{summary}\n\nAll good? ✅',
      'Summary:\n\n{summary}\n\nReady to confirm? ✅'
    ],
    userConfirmOrder: [
      'Yes, confirmed.',
      'Confirm!',
      'Looks good, confirm.'
    ],
    botOrderConfirmed: [
      'Order confirmed! Preparing it now. 🙌',
      'Done! Confirmed. Thanks! 🎉',
      'Confirmed! It\'ll be ready soon. 🙌'
    ]
  },

  canchero: {
    userGreeting: [
      'Hey! What\'s up?',
      'Yo! How\'s it going?',
      'Hey hey! What\'s good?',
      'Good evening! What\'s on the menu?',
      'Hiiiiii! 🔥',
      'Heyy, you guys open?'
    ],
    botGreeting: [
      'Ayy! Welcome to {business} 🔥 What can I get you?',
      'What\'s up! I\'m the bot for {business} 😎 What do you need?',
      'Heyoo! {business} here, at your service 🤙 What\'s up?'
    ],
    askMore: [
      'Anything else, champ?',
      'Need anything else? 😎',
      'What else you got?'
    ],
    closing: [
      'Awesome! Hit us up anytime 🤙',
      'Sweet! See ya, champ! 🔥',
      'Great! Happy to help 💪'
    ],
    userThanks: [
      'Awesome, thanks!',
      'For real, that\'s great!',
      'Amazing, thanks a ton!'
    ],
    userNextIntent: [
      'Awesome! Hey, give us some info on {intent} too.',
      'Sweet. And tell me, what\'s up with {intent}?',
      'Nice one. And how about {intent}?',
      'Cool. Can you give me the lowdown on {intent}?'
    ],
    botNextIntent: [
      'Nice! About {intent}, here\'s the deal:',
      'No worries! On {intent}, here\'s what\'s up:',
      'Sure! Here\'s the info on {intent}:'
    ],

    askPrices: [
      'What\'s the damage?',
      'How much for stuff?',
      'What are the prices looking like?'
    ],
    botPrices: [
      'Check out these killer prices! 🔥 Check the PDF catalog and pick something:\n\n{priceList}',
      'Here are the prices, can\'t beat \'em 😏 Look through the catalog and let me know:\n\n{priceList}',
      'The prices! 💰 Take a look at the menu and tell me what\'s up:\n\n{priceList}'
    ],
    askHours: [
      'What are the hours?',
      'How late are you guys open?',
      'Hours?'
    ],
    botHours: [
      'We\'re open:\n{hours}\n\nCome through! 🔥',
      'Hours:\n{hours}\n\nSwing by anytime 😎',
      'Here ya go:\n{hours}\n\nDon\'t miss out!'
    ],
    askLocation: [
      'Where you guys at?',
      'Where is it?',
      'What\'s the address?'
    ],
    botLocation: [
      'We\'re right here: {address} 📍 Come on over!',
      'Pull up to {address} 📍 You won\'t regret it!',
      'Address is {address} 📍 Come through!'
    ],
    askPayments: [
      'How do I pay?',
      'What payment options do you have?',
      'You guys take everything?'
    ],
    botPayments: [
      'We take it all: {paymentMethods} 💳 No worries!',
      'Pay however you want! {paymentMethods} 💳',
      'Payment options: {paymentMethods} 💸 Easy peasy!'
    ],
    askDelivery: [
      'You guys deliver?',
      'Got delivery?',
      'Can you get it to my place?'
    ],
    botDelivery: [
      'Oh yeah! {deliveryInfo} 🛵',
      '{deliveryInfo} Order away! 🛵',
      'Totally, {deliveryInfo} 🛵'
    ],
    askPromos: [
      'Any deals?',
      'Got anything on sale?',
      'Any combos?'
    ],
    botPromos: [
      'Check out these promos 🔥!\n\n• 2-for-1 {promoItem} on Tuesdays\n• {comboItem} + drink combo for {comboPrice}\n\nGet on it!',
      'Promos 🔥:\n\n• {promoItem} at 20% OFF\n• {comboItem} combo + side\n\nDon\'t sleep on it!',
      'Deals are fire 🔥!\n\n• Tuesday {promoItem} 2-for-1\n• {comboItem} + free drink on Thursdays'
    ],
    askTurno: [
      'Can I get an appointment?',
      'I wanna book something!',
      'How do I get an appointment?'
    ],
    botTurno: [
      'Let\'s go! When do you want it? 📅',
      'Yeah! What day works? 📅',
      'For sure! What day and time? 📅'
    ],
    userTurnoResponse: [
      'Thursday afternoon work?',
      'How about Wednesday around 10?',
      'Got anything Friday?'
    ],
    botTurnoConfirm: [
      'Booked! {turnoDay}, don\'t miss it. ✅',
      'Done! {turnoDay} is yours. Let\'s go! ✅',
      'Locked in! {turnoDay}. ✅'
    ],
    askPresupuesto: [
      'Can you give me a quote?',
      'Need a price on something.',
      'How much for a job?'
    ],
    botPresupuesto: [
      'Let\'s go! Tell me what you need 💪',
      'Sure thing! What\'s the job?',
      'Hit me with it! What do you need done? 💪'
    ],
    userPresupuestoDetail: [
      'I need {serviceDesc}.',
      'It\'s for {serviceDesc}, how much?',
      'It\'s {serviceDesc}.'
    ],
    botPresupuestoResponse: [
      'For {serviceDesc}, about ${presupuestoPrice}. Let\'s do it? 💪',
      'Quote: {serviceDesc} — ${presupuestoPrice}. No strings attached 📋',
      '{serviceDesc}: ${presupuestoPrice} approx. Deal? 🤝'
    ],

    askOrder: [
      'I wanna order!',
      'Let\'s gooo, I want to order 🔥',
      'What do you got? I want to order!'
    ],
    botOfferItems: [
      'Let\'s go! Check out what we got 🔥:\n\n{itemList}\n\nWhat can I get you?',
      'Here\'s the lineup 😎:\n\n{itemList}\n\nWhat\'ll it be?',
      'Boom! Options:\n\n{itemList}\n\nWhat\'s tempting you?'
    ],
    userOrderItems: [
      'Hit me with {orderItems}!',
      'Give me {orderItems}.',
      'I\'ll take {orderItems} 🔥'
    ],
    botConfirmItems: [
      'Coming right up! {orderItems}. ✅',
      'On it! {orderItems}. ✅',
      'Let\'s go! {orderItems}. ✅'
    ],
    botAskDeliveryOrRetiro: [
      'Want it delivered or picking up? 🛵',
      'Delivery or pickup?',
      'We bringing it to you or you coming?'
    ],
    userDeliveryChoice: [
      'Deliver it!',
      'Delivery!',
      'Send it over!'
    ],
    userRetiroChoice: [
      'I\'ll pick it up.',
      'Picking it up!',
      'On my way.'
    ],
    botAskAddress: [
      'Where we sending it? 📍',
      'Awesome! Address? 📍',
      'What\'s the address? 📍'
    ],
    userAddress: [
      '450 Main Street.',
      '1200 Oak Ave.',
      '890 Elm Street.'
    ],
    botAskPayment: [
      'How you paying? ({paymentMethods}) 💸',
      'Payment method? {paymentMethods}',
      'How you wanna pay? ({paymentMethods}) 💸'
    ],
    userPaymentChoice: [
      '{paymentChoice}!',
      'With {paymentChoice}.',
      '{paymentChoice} 💸'
    ],
    userUrgent: [
      'I need it NOW, can you do it?',
      'Is it doable for today?',
      'It\'s urgent, can you make it?'
    ],
    botUrgent: [
      'No sweat! {eta} minutes tops 🚀',
      'We\'re on it! {eta} min ⏱️',
      'Full speed! {eta} minutes and done 🔥'
    ],
    userPetFriendly: [
      'Can I come with my dog?',
      'You guys pet friendly?',
      'Cool with pets?'
    ],
    botPetFriendlyYes: [
      'Totally! Bring your buddy 🐶🔥',
      'Heck yes! Pet friendly all the way 🐾',
      'Come with your pet, they\'re welcome! 🐶'
    ],
    botPetFriendlyNo: [
      'Ah nah, can\'t do pets inside 😔',
      'Not pet friendly, sorry champ 😔',
      'No pets allowed, but we\'ll deliver to your door 🏠'
    ],
    userComerLocal: [
      'Can I eat there?',
      'Got tables to sit at?',
      'Can I sit and eat?'
    ],
    botComerLocalYes: [
      'For sure! Come eat here 🍽️🔥',
      'Yeah! We got tables, pull up 🍽️',
      'Totally! Sit down and enjoy 🍽️'
    ],
    botComerLocalNo: [
      'No tables, but we deliver or you can pick up 📦',
      'Just delivery/pickup for now, but still fire! 📦',
      'No seating, but we\'ll get it to you hot 📦🔥'
    ],

    customizations: [
      'Yo, hold the onions on {item}.',
      '{item} no tomato, cool?',
      'Throw extra meat on {item}!',
      'Can you add cheddar to {item}?',
      '{item} no spice, please.',
      'Switch fries for sweet potato on {item}.',
      '{item} double cheese 🔥',
      'No mayo on {item}.'
    ],
    botCustomConfirm: [
      'You got it! {item}: {mod}. ✅',
      'Done! Change on {item}: {mod}. ✅',
      'Boom! {item}: {mod}. ✅'
    ],
    botOrderSummary: [
      'Your order 🔥:\n\n{summary}\n\nConfirm? ✅',
      'Check the summary:\n\n{summary}\n\nAll good? ✅',
      'The order:\n\n{summary}\n\nLet\'s do it? ✅'
    ],
    userConfirmOrder: [
      'Yes, confirmed!',
      'Let\'s go! Confirmed.',
      'Yeah, send it!'
    ],
    botOrderConfirmed: [
      'BOOM! Order confirmed 🔥 On its way!',
      'Done deal! Confirmed 🎉 Thanks champ!',
      'Confirmed! Already on it 🙌💪'
    ]
  }
};
