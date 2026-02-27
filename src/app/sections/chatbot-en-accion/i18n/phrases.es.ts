// ─── UI Labels (Spanish) ──────────────────────────────────
export const UI_ES = {
  sectionTitle: 'El Chatbot en Acción',
  sectionSubtitle: 'Observa cómo nuestro Agente IA transforma una simple consulta en una oportunidad calificada.',
  rubroLabel: 'Rubro',
  styleLabel: 'Estilo',
  intentsLabel: '¿Qué querés simular?',
  extrasLabel: 'Detalles adicionales',
  simulateBtn: '▶ Simulación',
  regenerateBtn: '🔄 Probar otro rubro / Regenerar',
  inputPlaceholder: 'Mensaje (demo)',
  online: 'en línea',
  typing: 'escribiendo…',

  rubros: {
    aleatorio: '🎲 Aleatorio',
    hamburgueseria: '🍔 Hamburguesería',
    lomiteria: '🥖 Lomitería',
    estetica: '💅 Estética',
    centro_salud: '🏥 Centro de Salud',
    indumentaria: '👗 Indumentaria',
    taller_mecanico: '🔧 Taller Mecánico',
    gimnasio: '🏋️ Gimnasio'
  },
  styles: {
    formal: 'Formal',
    neutro: 'Neutro',
    canchero: 'Canchero'
  },
  intents: {
    PEDIR: 'Pedir producto/servicio',
    PRECIOS: 'Consultar precios / catálogo',
    HORARIOS: 'Horarios',
    UBICACION: 'Ubicación',
    PAGOS: 'Medios de pago',
    DELIVERY_RETIRO: 'Delivery / Retiro',
    PROMOS: 'Promos / combos',
    TURNO: 'Sacar turno',
    PRESUPUESTO: 'Pedir presupuesto'
  },
  extras: {
    DELIVERY: 'Quiero delivery',
    RETIRO: 'Prefiero retiro en el local',
    PAGO_TRANSFERENCIA: 'Pago con transferencia',
    PAGO_EFECTIVO: 'Pago en efectivo',
    PAGO_TARJETA: 'Pago con tarjeta',
    URGENTE: 'Es para hoy (urgente)',
    PET_FRIENDLY: '¿Es pet friendly?',
    COMER_LOCAL: 'Quiero comer en el local'
  }
};

// ─── Conversation Phrases (Spanish) by Style ──────────────
export const PHRASES_ES: Record<string, any> = {
  formal: {
    userGreeting: [
      'Buenos días, quisiera consultar.',
      'Hola, buenas tardes.',
      'Buenas, ¿podrían asistirme?'
    ],
    botGreeting: [
      '¡Bienvenido/a a {business}! 😊 Soy el asistente virtual. ¿En qué puedo ayudarlo/a?',
      'Buen día, gracias por contactar a {business}. Estoy a su disposición.',
      'Hola, bienvenido/a a {business}. ¿En qué le puedo ser de utilidad?'
    ],
    askMore: [
      '¿Hay algo más en lo que pueda asistirle?',
      '¿Desea consultar algo adicional?',
      '¿Puedo ayudarle con algo más?'
    ],
    closing: [
      '¡Perfecto! Quedamos a su disposición. ¡Hasta pronto! 👋',
      'Muchas gracias por comunicarse con nosotros. ¡Que tenga un excelente día!',
      'Fue un placer asistirle. ¡Lo esperamos! 😊'
    ],
    userThanks: [
      'Muchas gracias por la información.',
      'Perfecto, muchas gracias.',
      'Excelente, le agradezco.'
    ],

    // ─── Intent-specific ────────────────────────
    askPrices: [
      'Quisiera conocer los precios, por favor.',
      '¿Podrían indicarme los precios del catálogo?',
      'Me gustaría saber qué precios manejan.'
    ],
    botPrices: [
      'Con gusto. Le comparto nuestros precios:\n\n{priceList}\n\n¿Le interesa alguno en particular?',
      'Por supuesto. Estos son nuestros precios actualizados:\n\n{priceList}',
      'Aquí tiene nuestro catálogo con precios:\n\n{priceList}\n\n¿Desea agregar algo?'
    ],

    askHours: [
      '¿Cuál es su horario de atención?',
      '¿Podrían indicarme los horarios?',
      'Necesito saber en qué horarios atienden.'
    ],
    botHours: [
      'Nuestro horario de atención es:\n{hours}',
      'Atendemos en los siguientes horarios:\n{hours}',
      'Con gusto. Nuestros horarios son:\n{hours}'
    ],

    askLocation: [
      '¿Cuál es la dirección del local?',
      '¿Dónde están ubicados?',
      '¿Me podrían pasar la ubicación?'
    ],
    botLocation: [
      'Nos encontramos en: {address} 📍',
      'Nuestra dirección es: {address} 📍',
      'Estamos ubicados en {address}. ¡Los esperamos! 📍'
    ],

    askPayments: [
      '¿Qué medios de pago aceptan?',
      '¿Cuáles son las formas de pago disponibles?',
      'Quisiera saber los medios de pago.'
    ],
    botPayments: [
      'Aceptamos los siguientes medios de pago: {paymentMethods} 💳',
      'Nuestros medios de pago disponibles son: {paymentMethods}',
      'Puede abonar mediante: {paymentMethods} 💳'
    ],

    askDelivery: [
      '¿Realizan envíos?',
      '¿Cuentan con servicio de delivery?',
      '¿Hay opción de delivery o retiro?'
    ],
    botDelivery: [
      '{deliveryInfo}',
      '{deliveryInfo}. ¿Desea que tome su pedido?',
      'Le comento: {deliveryInfo}'
    ],

    askPromos: [
      '¿Tienen alguna promoción vigente?',
      '¿Cuentan con combos o promociones?',
      'Me interesa saber si hay promos disponibles.'
    ],
    botPromos: [
      '¡Sí! Actualmente tenemos estas promociones 🎉:\n\n• 2x1 en {promoItem} los martes\n• Combo {comboItem} + bebida por {comboPrice}',
      'Tenemos promociones vigentes:\n\n• {promoItem} con 20% OFF\n• Combo especial: {comboItem} + acompañamiento',
      '¡Por supuesto! Le comparto nuestras promos:\n\n• Martes de {promoItem} 2x1\n• {comboItem} + bebida gratis los jueves'
    ],

    askTurno: [
      '¿Es posible agendar un turno?',
      'Quisiera sacar un turno, por favor.',
      '¿Cómo puedo reservar un turno?'
    ],
    botTurno: [
      'Puede agendar su turno. ¿Para qué día y horario lo necesita?',
      'Con gusto le asigno un turno. ¿Qué día le queda mejor?',
      '¡Por supuesto! ¿Para qué servicio y qué día prefiere?'
    ],
    userTurnoResponse: [
      'Para el jueves a la tarde, si es posible.',
      'El miércoles por la mañana me vendría bien.',
      '¿Tienen disponibilidad el viernes?'
    ],
    botTurnoConfirm: [
      'Perfecto, le agendo turno para {turnoDay}. Le enviaremos un recordatorio. ✅',
      'Listo, queda reservado para {turnoDay}. ¡Lo esperamos! ✅',
      'Confirmado: {turnoDay}. Le llegará la confirmación por este medio. ✅'
    ],

    askPresupuesto: [
      '¿Podrían pasarme un presupuesto?',
      'Necesito un presupuesto para un trabajo.',
      'Quisiera solicitar un presupuesto.'
    ],
    botPresupuesto: [
      '¡Por supuesto! ¿Podría describirme qué necesita?',
      'Con gusto. ¿Me indica qué tipo de trabajo requiere?',
      'Sí, le armamos un presupuesto sin compromiso. ¿De qué se trata?'
    ],
    userPresupuestoDetail: [
      'Necesito {serviceDesc}.',
      'Es para {serviceDesc}, si pueden darme un estimado.',
      'Sería {serviceDesc}. ¿Cuánto saldría aproximadamente?'
    ],
    botPresupuestoResponse: [
      'Para {serviceDesc}, el presupuesto estimado es de ${presupuestoPrice}. ¿Le parece bien? 📋',
      'Le armo el presupuesto: {serviceDesc} — ${presupuestoPrice} aprox. Sin compromiso. ¿Avanzamos?',
      'El costo aproximado por {serviceDesc} sería de ${presupuestoPrice}. ¿Desea coordinar? 📋'
    ],

    // ─── Pedir flow ─────────────────────────────
    askOrder: [
      'Quisiera realizar un pedido.',
      'Me gustaría hacer un pedido, por favor.',
      'Quiero pedir, ¿qué tienen disponible?'
    ],
    botOfferItems: [
      '¡Con gusto! Le muestro nuestras opciones:\n\n{itemList}\n\n¿Qué le gustaría pedir?',
      '¡Por supuesto! Estos son nuestros productos:\n\n{itemList}\n\n¿Qué desea?',
      'Excelente elección. Nuestro menú:\n\n{itemList}\n\n¿Qué le interesa?'
    ],
    userOrderItems: [
      'Quiero {orderItems}, por favor.',
      'Me gustaría pedir {orderItems}.',
      'Deme {orderItems}.'
    ],
    botConfirmItems: [
      'Perfecto, le anoto: {orderItems}. ✅',
      'Listo, tomo nota: {orderItems}. ✅',
      'Anotado: {orderItems}. ✅'
    ],
    botAskDeliveryOrRetiro: [
      '¿Lo desea con delivery o prefiere retirarlo?',
      '¿Lo enviamos o lo retira en el local?',
      '¿Prefiere que se lo enviemos o pasa a buscarlo?'
    ],
    userDeliveryChoice: [
      'Con delivery, por favor.',
      'Que sea con envío.',
      'Delivery, gracias.'
    ],
    userRetiroChoice: [
      'Lo retiro en el local.',
      'Paso a buscarlo.',
      'Retiro, por favor.'
    ],
    botAskAddress: [
      '¿A qué dirección se lo enviamos? 📍',
      'Perfecto, ¿me indica la dirección de envío? 📍',
      '¿Cuál es la dirección para el delivery? 📍'
    ],
    userAddress: [
      'Calle Rivadavia 450.',
      'Av. Colón 1200, piso 3.',
      'San Martín 890.'
    ],
    botAskPayment: [
      '¿Con qué medio de pago desea abonar? ({paymentMethods})',
      '¿Cómo prefiere pagar? Aceptamos: {paymentMethods}',
      '¿Qué forma de pago le queda más cómoda? ({paymentMethods})'
    ],
    userPaymentChoice: [
      '{paymentChoice}, por favor.',
      'Voy a pagar con {paymentChoice}.',
      '{paymentChoice}.'
    ],

    // Urgente
    userUrgent: [
      'Es para hoy, ¿tienen disponibilidad?',
      'Lo necesito para hoy, ¿se puede?',
      '¿Me lo pueden tener listo cuanto antes?'
    ],
    botUrgent: [
      'Sí, podemos tenerlo listo en aproximadamente {eta} minutos. ⏱️',
      '¡Sin problema! Estimamos {eta} minutos. ⏱️',
      'Lo podemos tener en unos {eta} minutos. ¿Le parece bien? ⏱️'
    ],

    // Pet Friendly
    userPetFriendly: [
      '¿El local es pet friendly?',
      '¿Puedo ir con mi mascota?',
      '¿Aceptan mascotas en el lugar?'
    ],
    botPetFriendlyYes: [
      '¡Sí, somos pet friendly! 🐶 Tu mascota es bienvenida.',
      '¡Por supuesto! Aceptamos mascotas con gusto. 🐾',
      '¡Claro que sí! Somos pet friendly, traé a tu compañerito. 🐶'
    ],
    botPetFriendlyNo: [
      'Lamentablemente no aceptamos mascotas en el local. 😔',
      'Por el momento no somos pet friendly, disculpe las molestias.',
      'No aceptamos mascotas, pero ¡podemos enviarle su pedido a domicilio! 🏠'
    ],

    // Comer en el local
    userComerLocal: [
      '¿Se puede comer en el local?',
      '¿Tienen mesas para comer ahí?',
      '¿Puedo consumir en el lugar?'
    ],
    botComerLocalYes: [
      '¡Sí! Tenemos mesas disponibles para comer en el local. 🍽️',
      '¡Por supuesto! Contamos con salón para que disfrute su pedido aquí. 🍽️',
      '¡Claro que sí! Puede sentarse y comer tranquilo en el local. 🍽️'
    ],
    botComerLocalNo: [
      'Por el momento solo ofrecemos servicio de delivery y retiro. 📦',
      'No contamos con mesas, pero puede retirar su pedido o pedirlo por delivery. 📦',
      'Trabajamos solo con take-away y delivery, ¡disculpe! 📦'
    ],

    // Customizations
    customizations: [
      'Al final, sacale cebolla a {item}.',
      'La {item} sin tomate, por favor.',
      'Sumale extra carne a {item}.',
      '¿Le podés agregar cheddar a {item}?',
      '{item} sin picante, por favor.',
      'Cambio las papas por batatas en {item}.',
      'La {item} con doble queso, por favor.',
      'Sin mayonesa en {item}.'
    ],
    botCustomConfirm: [
      'Sin problema, modifico {item}: {mod}. ✅',
      'Listo, le aplico el cambio a {item}: {mod}. ✅',
      'Perfecto, anotado en {item}: {mod}. ✅'
    ],

    // Final order summary
    botOrderSummary: [
      'Le confirmo su pedido:\n\n{summary}\n\n¿Confirmo el pedido? ✅',
      'Resumen de su pedido:\n\n{summary}\n\n¿Está todo correcto? ✅',
      'Su pedido queda así:\n\n{summary}\n\n¿Desea confirmar? ✅'
    ],
    userConfirmOrder: [
      'Sí, confirmo.',
      'Perfecto, confirmo el pedido.',
      'Todo bien, confirmo.'
    ],
    botOrderConfirmed: [
      '¡Pedido confirmado! Muchas gracias. Lo estaremos preparando. 🙌',
      '¡Listo! Su pedido ha sido confirmado. ¡Gracias por su compra! 🎉',
      '¡Confirmado! En breve estará listo. ¡Muchas gracias! 🙌'
    ]
  },

  neutro: {
    userGreeting: [
      'Hola, buenas!',
      'Hola, ¿cómo va?',
      'Buenas! Quería consultar.'
    ],
    botGreeting: [
      '¡Hola! Bienvenido/a a {business} 😊 ¿En qué te puedo ayudar?',
      '¡Buenas! Soy el asistente de {business}. Contame, ¿qué necesitás?',
      '¡Hola! Gracias por escribir a {business}. ¿Qué querés saber?'
    ],
    askMore: [
      '¿Necesitás algo más?',
      '¿Algo más en lo que te pueda ayudar?',
      '¿Querés consultar algo más?'
    ],
    closing: [
      '¡Dale, genial! Cualquier cosa acá estamos. ¡Saludos! 👋',
      '¡Perfecto! Te esperamos. ¡Chau! 😊',
      '¡Buenísimo! Nos vemos pronto. ¡Saludos! 👋'
    ],
    userThanks: [
      'Genial, gracias!',
      'Dale, gracias por la info!',
      'Perfecto, gracias!'
    ],

    askPrices: [
      '¿Me pasás los precios?',
      '¿Cuánto salen las cosas?',
      'Quería saber los precios.'
    ],
    botPrices: [
      '¡Sí! Acá te paso los precios:\n\n{priceList}\n\n¿Te interesa algo?',
      '¡Mirá! Estos son nuestros precios:\n\n{priceList}',
      'Te paso el catálogo con precios:\n\n{priceList}\n\n¿Qué te copa?'
    ],
    askHours: [
      '¿En qué horarios atienden?',
      '¿Qué horarios manejan?',
      '¿Hasta qué hora están?'
    ],
    botHours: [
      'Nuestros horarios son:\n{hours}',
      'Atendemos:\n{hours}',
      'Te paso los horarios:\n{hours}'
    ],
    askLocation: [
      '¿Dónde están?',
      '¿Cuál es la dirección?',
      '¿Me pasás la dirección?'
    ],
    botLocation: [
      'Estamos en: {address} 📍',
      'Nos encontrás en {address} 📍',
      'La dirección es: {address} 📍'
    ],
    askPayments: [
      '¿Qué medios de pago aceptan?',
      '¿Cómo puedo pagar?',
      '¿Aceptan tarjeta y transferencia?'
    ],
    botPayments: [
      'Aceptamos: {paymentMethods} 💳',
      'Podés pagar con: {paymentMethods} 💳',
      'Medios de pago: {paymentMethods}'
    ],
    askDelivery: [
      '¿Hacen delivery?',
      '¿Tienen envío?',
      '¿Puedo pedir con delivery?'
    ],
    botDelivery: [
      '{deliveryInfo}',
      'Sí, {deliveryInfo}',
      'Te cuento: {deliveryInfo}'
    ],
    askPromos: [
      '¿Tienen promos?',
      '¿Hay alguna promo ahora?',
      '¿Qué combos tienen?'
    ],
    botPromos: [
      '¡Sí! Mirá:\n\n• 2x1 en {promoItem} los martes\n• Combo {comboItem} + bebida por {comboPrice} 🎉',
      'Tenemos estas promos:\n\n• {promoItem} con 20% OFF\n• Combo: {comboItem} + acompañamiento 🎉',
      '¡Claro! Te cuento las promos:\n\n• Martes 2x1 en {promoItem}\n• {comboItem} + bebida gratis los jueves 🎉'
    ],
    askTurno: [
      '¿Puedo sacar turno?',
      'Quiero agendar un turno.',
      '¿Cómo saco turno?'
    ],
    botTurno: [
      '¡Sí! ¿Para qué día y horario te queda bien?',
      'Dale, te agendo. ¿Qué día preferís?',
      '¡Claro! ¿Para cuándo lo necesitás?'
    ],
    userTurnoResponse: [
      'El jueves a la tarde, ¿puede ser?',
      '¿El miércoles a la mañana?',
      '¿Tienen algo el viernes?'
    ],
    botTurnoConfirm: [
      '¡Listo! Te agendé para {turnoDay}. Te mandamos recordatorio. ✅',
      'Confirmado: {turnoDay}. ¡Te esperamos! ✅',
      'Perfecto, reservé {turnoDay} para vos. ✅'
    ],
    askPresupuesto: [
      '¿Me pueden pasar un presupuesto?',
      'Necesito un presupuesto.',
      'Quería pedir un presupuesto.'
    ],
    botPresupuesto: [
      '¡Dale! ¿Qué necesitás?',
      'Sí, contame qué trabajo es.',
      'Claro, ¿me describís qué necesitás?'
    ],
    userPresupuestoDetail: [
      'Necesito {serviceDesc}.',
      'Es para {serviceDesc}.',
      'Sería {serviceDesc}. ¿Cuánto sale?'
    ],
    botPresupuestoResponse: [
      'Para {serviceDesc}, el precio estimado es ${presupuestoPrice}. ¿Te sirve? 📋',
      'Te armo el presupuesto: {serviceDesc} — ${presupuestoPrice} aprox. 📋',
      'El costo sería de ${presupuestoPrice} por {serviceDesc}. ¿Coordinamos? 📋'
    ],

    askOrder: [
      'Quiero hacer un pedido.',
      'Quiero pedir algo!',
      '¿Puedo hacer un pedido?'
    ],
    botOfferItems: [
      '¡Dale! Te muestro lo que tenemos:\n\n{itemList}\n\n¿Qué te pido?',
      '¡Claro! Mirá nuestras opciones:\n\n{itemList}\n\n¿Qué querés?',
      '¡Dale! Acá va el menú:\n\n{itemList}\n\n¿Qué te gustaría?'
    ],
    userOrderItems: [
      'Dame {orderItems}.',
      'Quiero {orderItems}.',
      'Poneme {orderItems}.'
    ],
    botConfirmItems: [
      '¡Anotado! {orderItems}. ✅',
      'Perfecto, te anoto: {orderItems}. ✅',
      'Listo: {orderItems}. ✅'
    ],
    botAskDeliveryOrRetiro: [
      '¿Lo querés con delivery o lo retirás?',
      '¿Te lo enviamos o pasás a buscarlo?',
      '¿Delivery o retiro?'
    ],
    userDeliveryChoice: [
      'Con delivery.',
      'Envío, porfa.',
      'Delivery!'
    ],
    userRetiroChoice: [
      'Lo retiro.',
      'Paso a buscarlo.',
      'Retiro.'
    ],
    botAskAddress: [
      '¿A qué dirección te lo mando? 📍',
      'Dale, ¿cuál es la dirección? 📍',
      '¿Dirección de envío? 📍'
    ],
    userAddress: [
      'Rivadavia 450.',
      'Av. Colón 1200.',
      'San Martín 890.'
    ],
    botAskPayment: [
      '¿Cómo pagás? ({paymentMethods})',
      '¿Con qué pagás? Tenemos: {paymentMethods}',
      '¿Forma de pago? ({paymentMethods})'
    ],
    userPaymentChoice: [
      '{paymentChoice}.',
      'Con {paymentChoice}.',
      '{paymentChoice}, porfa.'
    ],
    userUrgent: [
      'Es para hoy, ¿llegan?',
      'Lo necesito ya, ¿se puede?',
      '¿Lo pueden tener rápido?'
    ],
    botUrgent: [
      '¡Sí! En unos {eta} minutos lo tenés. ⏱️',
      'Dale, calculamos {eta} minutos. ⏱️',
      'Podemos en {eta} minutos aprox. ⏱️'
    ],
    userPetFriendly: [
      '¿Son pet friendly?',
      '¿Puedo llevar a mi perro?',
      '¿Aceptan mascotas?'
    ],
    botPetFriendlyYes: [
      '¡Sí, somos pet friendly! 🐶 Vení con tu mascota.',
      '¡Claro! Las mascotas son bienvenidas. 🐾',
      '¡Sí! Traé a tu mascota sin problema. 🐶'
    ],
    botPetFriendlyNo: [
      'No, lamentablemente no aceptamos mascotas. 😔',
      'Por ahora no somos pet friendly, disculpá.',
      'No aceptamos mascotas en el local. Pero podemos mandarte el pedido. 🏠'
    ],
    userComerLocal: [
      '¿Se puede comer ahí?',
      '¿Tienen mesas?',
      '¿Puedo comer en el local?'
    ],
    botComerLocalYes: [
      '¡Sí! Tenemos mesas, podés comer acá tranqui. 🍽️',
      '¡Claro! Tenemos salón para que te sientes. 🍽️',
      '¡Sí! Vení a comer al local, hay lugar. 🍽️'
    ],
    botComerLocalNo: [
      'Solo hacemos delivery y retiro, no tenemos mesas. 📦',
      'Por ahora no tenemos salón, pero podés retirar o te lo enviamos. 📦',
      'No contamos con mesas, pero ¡te lo mandamos! 📦'
    ],

    customizations: [
      'Che, sacale cebolla a {item}.',
      'La {item} sin tomate, porfa.',
      'Sumale extra carne a {item}.',
      '¿Le podés meter cheddar a {item}?',
      '{item} sin picante.',
      'Cambiá las papas por batatas en {item}.',
      'La {item} con doble queso.',
      'Sin mayonesa en {item}.'
    ],
    botCustomConfirm: [
      'Dale, te modifico {item}: {mod}. ✅',
      'Listo, cambio en {item}: {mod}. ✅',
      '¡Hecho! En {item}: {mod}. ✅'
    ],
    botOrderSummary: [
      'Te confirmo el pedido:\n\n{summary}\n\n¿Confirmo? ✅',
      'Tu pedido queda así:\n\n{summary}\n\n¿Todo OK? ✅',
      'Resumen:\n\n{summary}\n\n¿Listo para confirmar? ✅'
    ],
    userConfirmOrder: [
      'Sí, dale.',
      'Confirmo!',
      'Todo bien, confirmo.'
    ],
    botOrderConfirmed: [
      '¡Pedido confirmado! Ya lo preparamos. 🙌',
      '¡Listo! Confirmado. ¡Gracias! 🎉',
      '¡Confirmado! En breve lo tenés. 🙌'
    ]
  },

  canchero: {
    userGreeting: [
      'Buenas! Qué onda?',
      'Epa! Todo bien?',
      'Hola hola! Cómo va?'
    ],
    botGreeting: [
      'Eyyy! Bienvenido/a a {business} 🔥 ¿Qué te puedo conseguir?',
      '¡Qué onda! Soy el bot de {business} 😎 ¿Qué necesitás?',
      'Holaa! Acá {business} para lo que necesites 🤙 ¿En qué andás?'
    ],
    askMore: [
      '¿Algo más, crack?',
      '¿Te puedo ayudar con algo más? 😎',
      '¿Qué más te pinto?'
    ],
    closing: [
      '¡Genial! Un abrazo y acá estamos para lo que necesites 🤙',
      '¡Joya! ¡Nos vemos, crack! 🔥',
      '¡Buenísimo! Un gusto y a las órdenes 💪'
    ],
    userThanks: [
      'Genial, gracias crack!',
      'De una, mortal!',
      'Buenísimo, te pasaste!'
    ],

    askPrices: [
      '¿Cuánto sale la joda?',
      '¿Me decís los precios?',
      '¿Qué onda los precios?'
    ],
    botPrices: [
      '¡Mirá estos precios matadores! 🔥\n\n{priceList}\n\n¿Qué te tienta?',
      'Acá van los precios, regalados 😏:\n\n{priceList}',
      '¡Te paso los prices! 💰\n\n{priceList}\n\n¿Qué va?'
    ],
    askHours: [
      '¿Qué onda los horarios?',
      '¿Hasta qué hora andan?',
      '¿Horarios?'
    ],
    botHours: [
      'Abrimos así:\n{hours}\n\n¡Te esperamos! 🔥',
      'Los horarios:\n{hours}\n\nVenite cuando quieras 😎',
      'Horarios:\n{hours}\n\n¡No te lo pierdas!'
    ],
    askLocation: [
      '¿Por dónde quedan?',
      '¿Dónde están ustedes?',
      '¿Me tirás la dire?'
    ],
    botLocation: [
      'Estamos acá: {address} 📍 ¡Te esperamos!',
      'Caé a {address} 📍 ¡No te arrepentís!',
      'La dirección es {address} 📍 ¡Venite!'
    ],
    askPayments: [
      '¿Cómo se paga?',
      '¿Qué onda los pagos?',
      '¿Aceptan de todo?'
    ],
    botPayments: [
      'Aceptamos de todo: {paymentMethods} 💳 ¡Cero drama!',
      '¡Pagá como quieras! {paymentMethods} 💳',
      'Medios de pago: {paymentMethods} 💸 ¡Cero drama!'
    ],
    askDelivery: [
      '¿Mandan a domicilio?',
      '¿Tienen delivery?',
      '¿Llegan hasta mi casa?'
    ],
    botDelivery: [
      '¡Obvio! {deliveryInfo} 🛵',
      '{deliveryInfo} ¡Pedí tranqui! 🛵',
      'Re sí, {deliveryInfo} 🛵'
    ],
    askPromos: [
      '¿Qué promos hay?',
      '¿Tienen algo en oferta?',
      '¿Hay combos?'
    ],
    botPromos: [
      '¡Mirá estas promos 🔥!\n\n• 2x1 en {promoItem} los martes\n• Combo {comboItem} + birra por {comboPrice}\n\n¡Aprovechá!',
      'Promos 🔥:\n\n• {promoItem} con 20% OFF\n• Combo {comboItem} + acompañamiento\n\n¡No te lo pierdas!',
      '¡Las promos están ardiendo! 🔥\n\n• Martes de {promoItem} 2x1\n• {comboItem} + bebida gratis los jueves'
    ],
    askTurno: [
      '¿Puedo meter un turno?',
      'Quiero agendar turno!',
      '¿Cómo hago para sacar turno?'
    ],
    botTurno: [
      '¡Dale! ¿Para cuándo lo querés? 📅',
      '¡Vamos! ¿Qué día te copa? 📅',
      '¡Sí señor! ¿Qué día y horario te queda? 📅'
    ],
    userTurnoResponse: [
      'El jueves a la tarde va?',
      '¿El miércoles tipo 10?',
      '¿Hay algo el viernes?'
    ],
    botTurnoConfirm: [
      '¡Agendado! {turnoDay} te espero. ✅ ¡No faltes!',
      '¡Listo! {turnoDay} reservado. ¡Dale que va! ✅',
      '¡Hecho! {turnoDay} es tuyo. ✅'
    ],
    askPresupuesto: [
      '¿Me tiran un presupuesto?',
      'Necesito que me presupuesten algo.',
      '¿Cuánto me sale un laburo?'
    ],
    botPresupuesto: [
      '¡Dale! Contame qué necesitás y te armo algo 💪',
      '¡Vamos! ¿Qué laburo necesitás?',
      '¡Tirá data! ¿Qué necesitás que hagamos? 💪'
    ],
    userPresupuestoDetail: [
      'Necesito {serviceDesc}.',
      'Sería {serviceDesc}, ¿cuánto me sale?',
      'Es para {serviceDesc}.'
    ],
    botPresupuestoResponse: [
      'Por {serviceDesc}, te sale ${presupuestoPrice} aprox. ¿Le damos? 💪',
      'Presupuesto: {serviceDesc} — ${presupuestoPrice}. Sin compromiso 📋',
      '{serviceDesc}: ${presupuestoPrice} aprox. ¿Cerramos? 🤝'
    ],

    askOrder: [
      'Quiero pedir!',
      'Dameee, quiero hacer un pedido 🔥',
      '¿Qué tienen? Quiero pedir!'
    ],
    botOfferItems: [
      '¡Vamos! Mirá lo que tenemos 🔥:\n\n{itemList}\n\n¿Qué te pido?',
      '¡Dale! Acá el menú 😎:\n\n{itemList}\n\n¿Qué va?',
      '¡Opa! Opciones:\n\n{itemList}\n\n¿Qué te tienta?'
    ],
    userOrderItems: [
      '¡Mandame {orderItems}!',
      'Dame {orderItems}, crack.',
      'Poneme {orderItems} 🔥'
    ],
    botConfirmItems: [
      '¡Va como piña! {orderItems}. ✅',
      '¡Anotado! {orderItems}. ✅',
      '¡Sale! {orderItems}. ✅'
    ],
    botAskDeliveryOrRetiro: [
      '¿Te lo mando o pasás? 🛵',
      '¿Delivery o retirás?',
      '¿Lo llevamos o lo buscás?'
    ],
    userDeliveryChoice: [
      'Mandámelo!',
      'Delivery!',
      'Envío porfa!'
    ],
    userRetiroChoice: [
      'Paso a buscarlo.',
      'Lo retiro!',
      'Voy para allá.'
    ],
    botAskAddress: [
      '¿A dónde te lo mando? 📍',
      '¡Dale! ¿Dirección? 📍',
      '¿Cuál es la dire? 📍'
    ],
    userAddress: [
      'Rivadavia 450.',
      'Colón 1200.',
      'San Martín 890.'
    ],
    botAskPayment: [
      '¿Cómo pagás? ({paymentMethods}) 💸',
      '¿Con qué pagás, crack? {paymentMethods}',
      '¿Forma de pago? ({paymentMethods}) 💸'
    ],
    userPaymentChoice: [
      '{paymentChoice}!',
      'Con {paymentChoice}, dale.',
      '{paymentChoice} 💸'
    ],
    userUrgent: [
      'Lo necesito YA, ¿se puede?',
      '¿Me lo hacen para hoy?',
      'Es urgente, ¿llegan?'
    ],
    botUrgent: [
      '¡Tranqui! En {eta} min lo tenés 🚀',
      '¡Volamos! {eta} min y sale ⏱️',
      '¡Dale gas! {eta} minutos y listo 🔥'
    ],
    userPetFriendly: [
      '¿Puedo caer con el perro?',
      '¿Son pet friendly?',
      '¿Bancás mascotas?'
    ],
    botPetFriendlyYes: [
      '¡Obvio! Traé a tu compañerito 🐶🔥',
      '¡Sí señor! Pet friendly total 🐾',
      '¡Vení con tu mascota, son re bienvenidos! 🐶'
    ],
    botPetFriendlyNo: [
      'Uh no, mascotas no podemos bancarnos ahí dentro 😔',
      'No somos pet friendly, perdón crack 😔',
      'No aceptamos mascotas, pero te lo mandamos a tu casa 🏠'
    ],
    userComerLocal: [
      '¿Se puede morfar ahí?',
      '¿Tienen para comer en el local?',
      '¿Puedo sentarme a comer?'
    ],
    botComerLocalYes: [
      '¡Claro! Venite a morfar acá 🍽️🔥',
      '¡Sí! Hay mesas, caé tranqui 🍽️',
      '¡Obvio! Sentate y disfrutá 🍽️'
    ],
    botComerLocalNo: [
      'No tenemos mesas, pero te lo mandamos o lo retirás 📦',
      'Solo delivery/retiro por ahora, ¡pero está igual de bueno! 📦',
      'No hay salón, pero te lo enviamos calentito 📦🔥'
    ],

    customizations: [
      'Ey, sacale la cebolla a {item}.',
      'La {item} sin tomate, dale?',
      'Metele extra carne a {item}!',
      '¿Se le puede agregar cheddar a {item}?',
      '{item} sin picante, porfa.',
      'Cambiame las papas por batatas en {item}.',
      'La {item} con doble queso 🔥',
      'Sin mayo en {item}.'
    ],
    botCustomConfirm: [
      '¡Dale! {item}: {mod}. ✅',
      '¡Listo! Cambio en {item}: {mod}. ✅',
      '¡Hecho, crack! {item}: {mod}. ✅'
    ],
    botOrderSummary: [
      'Tu pedido queda así 🔥:\n\n{summary}\n\n¿Confirmo? ✅',
      'Mirá el resumen:\n\n{summary}\n\n¿Todo joya? ✅',
      'El pedido:\n\n{summary}\n\n¿Le damos?  ✅'
    ],
    userConfirmOrder: [
      'Dale, confirmo!',
      'Vamos! Confirmado.',
      'Sí, mandá!'
    ],
    botOrderConfirmed: [
      '¡BOOM! Pedido confirmado 🔥 ¡Ya sale!',
      '¡Listo papa! Confirmado 🎉 ¡Gracias crack!',
      '¡Confirmadísimo! Ya lo preparamos 🙌💪'
    ]
  }
};
