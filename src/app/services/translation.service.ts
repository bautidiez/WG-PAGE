import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranslationService {

    private _lang = signal<'es' | 'en'>('es');

    readonly currentLanguage = computed(() => this._lang());

    changeLanguage(lang: 'es' | 'en'): void {
        this._lang.set(lang);
    }

    t(key: string): string {
        const keys = key.split('.');
        let value: any = this.translations[this._lang()];
        for (const k of keys) {
            value = value?.[k];
        }
        return value ?? key;
    }

    getItems<T>(key: string): T[] {
        const keys = key.split('.');
        let value: any = this.translations[this._lang()];
        for (const k of keys) {
            value = value?.[k];
        }
        return Array.isArray(value) ? value : [];
    }

    // ─────────────────────────────────────────────
    //  DATOS DE TRADUCCIÓN
    // ─────────────────────────────────────────────
    readonly translations: Record<string, any> = {
        es: {
            nav: {
                home: 'Inicio',
                video: 'Chatbot en Acción',
                services: 'Servicios',
                pricing: 'Precios',
                contact: 'Contactar'
            },
            hero: {
                title: 'Gestión de Comandas',
                subtitle: 'en Lenguaje Natural',
                cta: 'Solicitar Demo',
                hint: '✨ Sin compromiso • Respuesta inmediata'
            },
            menu: { close: '← Cerrar', tagline: 'WorthGrowth' },
            video: {
                title: 'El Chatbot en Acción',
                subtitle: 'Observa cómo nuestro Agente IA transforma una simple consulta en una oportunidad calificada.',
                placeholder: '[Aquí irá tu VIDEO ilustrativo del Chatbot]',
                cta: 'Ver Funcionamiento Ahora'
            },
            benefits: {
                title: 'Resultados Reales',
                subtitle: 'Potencia asegurada mediante métodos innovadores y centrados en el cierre.',
                items: [
                    { title: 'Atención 24/7', description: 'Disponibilidad completa los 7 días de la semana, sin interrupciones ni horarios limitados.' },
                    { title: 'Combate la Indecisión', description: 'Guía al cliente en el momento clave, reduciendo la fricción en el proceso de compra.' },
                    { title: 'Informa y Resuelve', description: 'Responde consultas frecuentes sobre horarios, ubicación, medios de pago, promociones y condiciones del servicio.' },
                    { title: 'Acceso Directo y Unificado', description: 'Sin formularios, sin instalaciones, sin registros. Todo desde el canal que el cliente ya usa.' },
                    { title: 'Experiencia Natural', description: 'Conversaciones más humanas que interpretan lenguaje complejo, coloquial y preferencias del usuario.' },
                    { title: 'Soporte Rápido y Efectivo', description: 'Acompañamiento del prospecto de compra en tiempo real, reduciendo la fricción y aumentando las conversiones.' },
                    { title: 'Gestión Automatizada', description: 'Sistema de pedidos automatizado y fluido que elimina errores manuales y agiliza tu operación.' },
                    { title: 'Consulta Inteligente', description: 'Acceso en tiempo real a base de datos de productos con recomendaciones personalizadas según el perfil del usuario.' }
                ]
            },
            timeline: {
                title: '¿Cómo Empezamos?',
                subtitle: 'Tu chatbot funcionando en solo 7 días',
                steps: [
                    { day: 'Día 1', title: 'Reunión Inicial', description: 'Analizamos tu negocio, identificamos necesidades y definimos objetivos claros.', checklist: ['Llamada de 30 minutos', 'Definición de flujos', 'Acceso a plataformas'] },
                    { day: 'Día 2-4', title: 'Configuración', description: 'Entrenamos tu chatbot con tu información, productos y respuestas personalizadas.', checklist: ['Carga de base de conocimiento', 'Personalización de tono', 'Integración de canales'] },
                    { day: 'Día 5-6', title: 'Pruebas', description: 'Realizamos pruebas exhaustivas y ajustes finos para garantizar respuestas perfectas.', checklist: ['Tests de conversación', 'Revisión contigo', 'Ajustes finales'] },
                    { day: 'Día 7', title: '¡En Vivo!', description: 'Activamos tu chatbot y comenzamos a capturar leads automáticamente.', checklist: ['Lanzamiento oficial', 'Monitoreo inicial', 'Soporte continuo'] }
                ]
            },
            pricing: {
                title: 'Planes y Precios',
                subtitle: 'Soluciones escalables para tu negocio.',
                hire: 'Contratar',
                perMonth: '/ mes',
                needMore: '¿Necesitas más información?',
                meetingDesc: 'Agenda una demo en vivo con nuestro equipo.',
                meetingTopics: 'Demo completa, integración y precio.',
                scheduleMeeting: 'Agendar Demo',
                exchangeInfo: 'Cotización'
            },
            plans: [
                { name: 'Startup', features: ['500 Conversaciones IA/mes', 'Integración en 1 canal', 'Soporte estándar', 'Reporte Básico de Leads'] },
                { name: 'Growth (Recomendado)', features: ['2,500 Conversaciones IA/mes', 'Integración con 3 canales (Web, WSP, IG)', 'Integración con CRM', 'Reportes de Potabilidad Avanzados', 'Soporte prioritario'] }
            ],
            commitment: {
                title: 'Nuestros Compromisos',
                items: [
                    { title: 'Prueba del servicio', description: 'Testea la solución sin riesgos antes de comprometerte.' },
                    { title: 'Eficacia del sistema', description: 'Resultados medibles desde el primer día.' },
                    { title: 'Conversaciones ilimitadas', description: 'Sin restricciones artificiales en tu crecimiento.' },
                    { title: 'Presupuesto adaptado', description: 'Soluciones flexibles según tus necesidades.' }
                ],
                cta: 'Conócenos'
            },
            footer: {
                navigation: 'Navegación',
                contact: 'Contacto',
                contactDesc: 'Nuestro equipo está disponible para resolver tus dudas.',
                response: '⚡ Respuesta en menos de 24hs',
                copyright: '© 2024 WorthGrowth. Todos los derechos reservados.',
                mainPage: 'Página principal →',
                requestDemo: 'Solicitar Demo'
            },
            demo: {
                backLink: '← Volver al inicio',
                badge: 'DEMO',
                title: 'Generador de Ficha Comercial',
                subtitle: 'Completá los campos y obtené tu ficha lista al instante.',
                form: {
                    menuTitle: 'Menú / Servicios',
                    menuHint: 'Listá tus productos o servicios. Formatos admitidos: texto / pdf / excel / link',
                    menuPlaceholder: 'Ej:\nPIZZAS\nMuzzarella - $3500\nNapolitana - $4000\n\nEMPANADAS\nDe carne - $700\nDe pollo - $700',
                    hoursTitle: 'Horarios',
                    hoursHint: '¿Cuándo atendés?',
                    hoursPlaceholder: 'Ej:\nLunes a viernes: 10 a 20hs\nSábados: 10 a 14hs\nDomingos: cerrado',
                    locationTitle: 'Ubicación',
                    locationHint: 'Dirección o zona donde estás',
                    locationPlaceholder: 'Ej: Av. Corrientes 1234, CABA',
                    socialTitle: 'Redes Sociales / Contacto',
                    socialHint: 'Instagram, WhatsApp, web, etc.',
                    socialPlaceholder: 'Ej:\nInstagram: @mipizzeria\nWhatsApp: 11 5555-1234',
                    btnGenerate: 'Generar Ficha',
                    btnGenerating: 'Procesando...'
                },
                preview: {
                    placeholderTitle: 'Tu ficha aparecerá aquí',
                    placeholderHint: 'Completá al menos el menú o la ubicación y presioná Generar Ficha.',
                    loading: 'Organizando tu información...',
                    btnCopy: 'Copiar texto',
                    btnCopied: 'Copiado ✓',
                    btnReset: 'Nueva ficha',
                    btnActivate: 'Activar Agente IA con estos datos',
                    activateHint: 'Enviá tu ficha para que configuremos tu chatbot personalizado',
                    descTitle: 'Descripción',
                    hoursTitle: 'Horarios',
                    locationTitle: 'Ubicación',
                    socialTitle: 'Redes Sociales / Contacto',
                    menuTitle: 'Menú / Catálogo'
                }
            }
        },
        en: {
            nav: {
                home: 'Home',
                video: 'Chatbot in Action',
                services: 'Services',
                pricing: 'Pricing',
                contact: 'Contact'
            },
            hero: {
                title: 'Order Management',
                subtitle: 'in Natural Language',
                cta: 'Request Demo',
                hint: '✨ No commitment • Immediate response'
            },
            menu: { close: '← Close', tagline: 'WorthGrowth' },
            video: {
                title: 'The Chatbot in Action',
                subtitle: 'Watch how our AI Agent transforms a simple inquiry into a qualified opportunity.',
                placeholder: '[Your illustrative Chatbot VIDEO will go here]',
                cta: 'See How It Works Now'
            },
            benefits: {
                title: 'Real Results',
                subtitle: 'Guaranteed power through innovative and closing-focused methods.',
                items: [
                    { title: '24/7 Service', description: 'Full availability 7 days a week, without interruptions or limited hours.' },
                    { title: 'Combat Indecision', description: 'Guide the customer at the key moment, reducing friction in the purchase process.' },
                    { title: 'Inform and Resolve', description: 'Answer frequently asked questions about hours, location, payment methods, promotions, and service conditions.' },
                    { title: 'Direct and Unified Access', description: 'No forms, no installations, no registrations. Everything from the channel the customer already uses.' },
                    { title: 'Natural Experience', description: 'More human conversations that interpret complex, colloquial language and user preferences.' },
                    { title: 'Fast and Effective Support', description: 'Real-time support for purchase prospects, reducing friction and increasing conversions.' },
                    { title: 'Automated Management', description: 'Automated and fluid order system that eliminates manual errors and streamlines your operation.' },
                    { title: 'Intelligent Inquiry', description: 'Real-time access to product database with personalized recommendations based on user profile.' }
                ]
            },
            timeline: {
                title: 'How Do We Start?',
                subtitle: 'Your chatbot up and running in just 7 days',
                steps: [
                    { day: 'Day 1', title: 'Initial Meeting', description: 'We analyze your business, identify needs, and define clear objectives.', checklist: ['30-minute call', 'Flow definition', 'Platform access'] },
                    { day: 'Day 2-4', title: 'Configuration', description: 'We train your chatbot with your information, products, and customized responses.', checklist: ['Knowledge base loading', 'Tone customization', 'Channel integration'] },
                    { day: 'Day 5-6', title: 'Testing', description: 'We perform comprehensive tests and fine-tuning to ensure perfect responses.', checklist: ['Conversation tests', 'Review with you', 'Final adjustments'] },
                    { day: 'Day 7', title: 'Live!', description: 'We activate your chatbot and start capturing leads automatically.', checklist: ['Official launch', 'Initial monitoring', 'Continuous support'] }
                ]
            },
            pricing: {
                title: 'Plans and Pricing',
                subtitle: 'Scalable solutions for your business.',
                hire: 'Hire',
                perMonth: '/ month',
                needMore: 'Need more information?',
                meetingDesc: 'Schedule a live demo with our team.',
                meetingTopics: 'Full demo, integration, and pricing.',
                scheduleMeeting: 'Schedule Demo',
                exchangeInfo: 'Exchange Rate'
            },
            plans: [
                { name: 'Startup', features: ['500 AI Conversations/month', '1-channel integration', 'Standard support', 'Basic Lead Report'] },
                { name: 'Growth (Recommended)', features: ['2,500 AI Conversations/month', '3-channel integration (Web, WhatsApp, Instagram)', 'CRM Integration', 'Advanced Lead Reports', 'Priority support'] }
            ],
            commitment: {
                title: 'Our Commitments',
                items: [
                    { title: 'Service Trial', description: 'Test the solution risk-free before committing.' },
                    { title: 'System Effectiveness', description: 'Measurable results from day one.' },
                    { title: 'Unlimited Conversations', description: 'No artificial restrictions on your growth.' },
                    { title: 'Flexible Budget', description: 'Adaptable solutions according to your needs.' }
                ],
                cta: 'Get to Know Us'
            },
            footer: {
                navigation: 'Navigation',
                contact: 'Contact',
                contactDesc: 'Our team is available to answer your questions.',
                response: '⚡ Response in less than 24 hours',
                copyright: '© 2024 WorthGrowth. All rights reserved.',
                mainPage: 'Main page →',
                requestDemo: 'Request Demo'
            },
            demo: {
                backLink: '← Back to home',
                badge: 'DEMO',
                title: 'Business Profile Generator',
                subtitle: 'Fill in the fields and get your profile ready instantly.',
                form: {
                    menuTitle: 'Menu / Services',
                    menuHint: 'List your products or services. Supported formats: text / pdf / excel / link',
                    menuPlaceholder: 'Ex:\nPIZZAS\nMargherita - $35\nPepperoni - $40\n\nEMPANADAS\nMeat - $7\nChicken - $7',
                    hoursTitle: 'Hours',
                    hoursHint: 'When are you open?',
                    hoursPlaceholder: 'Ex:\nMonday to Friday: 10am to 8pm\nSaturdays: 10am to 2pm\nSundays: closed',
                    locationTitle: 'Location',
                    locationHint: 'Address or area where you are located',
                    locationPlaceholder: 'Ex: 123 Main St, NY',
                    socialTitle: 'Social Media / Contact',
                    socialHint: 'Instagram, WhatsApp, website, etc.',
                    socialPlaceholder: 'Ex:\nInstagram: @mypizzeria\nWhatsApp: +1 555-1234',
                    btnGenerate: 'Generate Profile',
                    btnGenerating: 'Processing...'
                },
                preview: {
                    placeholderTitle: 'Your profile will appear here',
                    placeholderHint: 'Fill in at least the menu or location and press Generate Profile.',
                    loading: 'Organizing your information...',
                    btnCopy: 'Copy text',
                    btnCopied: 'Copied ✓',
                    btnReset: 'New profile',
                    btnActivate: 'Activate AI Agent with this data',
                    activateHint: 'Send your profile so we can configure your personalized chatbot',
                    descTitle: 'Description',
                    hoursTitle: 'Hours',
                    locationTitle: 'Location',
                    socialTitle: 'Social Media / Contact',
                    menuTitle: 'Menu / Catalog'
                }
            }
        }
    };
}
