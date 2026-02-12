import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { FoodSceneComponent } from '../food-scene/food-scene.component';
import { RouterModule } from '@angular/router';

// --- INTERFACES ---
interface Benefit {
    icon: string;
    title: string;
    description: string;
}

interface Plan {
    name: string;
    price: string;
    features: string[];
}

interface ExchangeRate {
    blue: number;
    oficial: number;
    timestamp: Date;
}

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, FoodSceneComponent, RouterModule],
    styleUrl: './landing.component.css',
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef
    ) { }
    @ViewChild('threeCanvas') threeCanvas!: ElementRef<HTMLCanvasElement>;

    // --- Propiedades de Navegación y Scroll ---
    private timelineStarted = false;
    private observer?: IntersectionObserver;
    private animationId?: number;
    isScrolled: boolean = false;
    isMenuOpen: boolean = false;
    isLoading: boolean = true;
    isLangDropdownOpen: boolean = false;
    private mouseX: number = 0;
    private mouseY: number = 0;
    selectedBenefit: number | null = null;
    activeStep: number = 0;
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    renderer!: THREE.WebGLRenderer;

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        // Cerrar menú lateral si click fuera
        if (this.isMenuOpen && !target.closest('.side-menu') && !target.closest('.menu-toggle-btn')) {
            this.isMenuOpen = false;
        }

        // Cerrar dropdown de idiomas si click fuera
        if (this.isLangDropdownOpen && !target.closest('.language-dropdown')) {
            this.isLangDropdownOpen = false;
        }

        // Cerrar descripción de beneficio si click fuera
        if (this.selectedBenefit !== null &&
            !target.closest('.benefit-card-orbital') &&
            !target.closest('.benefit-description')) {
            this.selectedBenefit = null;
        }
    }

    onImageLoad(): void {
        console.log('✅ Imagen cargada correctamente');
    }

    onImageError(event: any): void {
        console.error('❌ Error cargando imagen:', event);
        // Fallback: usar placeholder
        event.target.src = 'https://via.placeholder.com/350/7c3aed/ffffff?text=AI+Benefits';
    }

    getBenefitOrbitalPosition(index: number): string {
        const width = window.innerWidth;
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;

        // En móvil, no aplicar transformación orbital
        if (isMobile) {
            return 'none';
        }

        const totalBenefits = 8;
        const angle = (360 / totalBenefits) * index - 90;
        // Reducción del radio en tablets para evitar desbordamiento
        const radius = isTablet ? 250 : 320;

        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return `translate(calc(-50% + \${x}px), calc(-50% + \${y}px))`;
    }

    selectBenefit(index: number): void {
        // Toggle selección
        const isSame = this.selectedBenefit === index;
        this.selectedBenefit = isSame ? null : index;

        if (this.selectedBenefit === null) return;

        // Esperar a que Angular pinte la descripción y el layout se actualice
        setTimeout(() => {
            const benefitCards = document.querySelectorAll('.benefit-card-orbital');
            const card = benefitCards[index] as HTMLElement | undefined;
            if (!card) return;

            // Preferimos centrar la descripción; si no existe, centramos la tarjeta
            const description = card.querySelector('.benefit-description') as HTMLElement | null;
            const targetElement = description || card;

            const rect = targetElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const isMobile = window.innerWidth < 768;
            const headerOffset = isMobile ? 70 : 90;

            // Queremos que el centro del elemento coincida con el centro visible (viewport - header)
            const visibleHeight = viewportHeight - headerOffset;
            const targetScroll =
                rect.top + window.pageYOffset
                - (visibleHeight / 2 - rect.height / 2)
                - (headerOffset / 2);

            // Evitar pasar límites del documento
            const maxScroll = document.body.scrollHeight - viewportHeight;
            const finalScroll = Math.max(0, Math.min(targetScroll, maxScroll));

            window.scrollTo({
                top: finalScroll,
                behavior: 'smooth'
            });
        }, 150); // pequeño delay para que *ngIf y CSS posicionen la descripción
    }

    // Agregar estas propiedades después de las existentes
    currentCurrency: 'USD' | 'ARS' = 'USD';
    exchangeRate: ExchangeRate = {
        blue: 1200, // Valor fallback
        oficial: 1000,
        timestamp: new Date()
    };
    isLoadingRate: boolean = false;

    // Sistema de traducción
    currentLanguage: string = 'es';
    // Reemplaza el objeto translations completo por este:

    translations: any = {
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
                    {
                        title: 'Atención 24/7',
                        description: 'Disponibilidad completa los 7 días de la semana, sin interrupciones ni horarios limitados.'
                    },
                    {
                        title: 'Combate la Indecisión',
                        description: 'Guía al cliente en el momento clave, reduciendo la fricción en el proceso de compra.'
                    },
                    {
                        title: 'Informa y Resuelve',
                        description: 'Responde consultas frecuentes sobre horarios, ubicación, medios de pago, promociones y condiciones del servicio.'
                    },
                    {
                        title: 'Acceso Directo y Unificado',
                        description: 'Sin formularios, sin instalaciones, sin registros. Todo desde el canal que el cliente ya usa.'
                    },
                    {
                        title: 'Experiencia Natural',
                        description: 'Conversaciones más humanas que interpretan lenguaje complejo, coloquial y preferencias del usuario.'
                    },
                    {
                        title: 'Soporte Rápido y Efectivo',
                        description: 'Acompañamiento del prospecto de compra en tiempo real, reduciendo la fricción y aumentando las conversiones.'
                    },
                    {
                        title: 'Gestión Automatizada',
                        description: 'Sistema de pedidos automatizado y fluido que elimina errores manuales y agiliza tu operación.'
                    },
                    {
                        title: 'Consulta Inteligente',
                        description: 'Acceso en tiempo real a base de datos de productos con recomendaciones personalizadas según el perfil del usuario.'
                    }
                ]
            },
            timeline: {
                title: '¿Cómo Empezamos?',
                subtitle: 'Tu chatbot funcionando en solo 7 días',
                steps: [
                    {
                        day: 'Día 1',
                        title: 'Reunión Inicial',
                        description: 'Analizamos tu negocio, identificamos necesidades y definimos objetivos claros.',
                        checklist: ['Llamada de 30 minutos', 'Definición de flujos', 'Acceso a plataformas']
                    },
                    {
                        day: 'Día 2-4',
                        title: 'Configuración',
                        description: 'Entrenamos tu chatbot con tu información, productos y respuestas personalizadas.',
                        checklist: ['Carga de base de conocimiento', 'Personalización de tono', 'Integración de canales']
                    },
                    {
                        day: 'Día 5-6',
                        title: 'Pruebas',
                        description: 'Realizamos pruebas exhaustivas y ajustes finos para garantizar respuestas perfectas.',
                        checklist: ['Tests de conversación', 'Revisión contigo', 'Ajustes finales']
                    },
                    {
                        day: 'Día 7',
                        title: '¡En Vivo!',
                        description: 'Activamos tu chatbot y comenzamos a capturar leads automáticamente.',
                        checklist: ['Lanzamiento oficial', 'Monitoreo inicial', 'Soporte continuo']
                    }
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
                {
                    name: 'Startup',
                    features: ['500 Conversaciones IA/mes', 'Integración en 1 canal', 'Soporte estándar', 'Reporte Básico de Leads']
                },
                {
                    name: 'Growth (Recomendado)',
                    features: ['2,500 Conversaciones IA/mes', 'Integración con 3 canales (Web, WSP, IG)', 'Integración con CRM', 'Reportes de Potabilidad Avanzados', 'Soporte prioritario']
                }
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
            menu: {
                close: '← Cerrar',
                tagline: 'WorthGrowth'
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
                    {
                        title: '24/7 Service',
                        description: 'Full availability 7 days a week, without interruptions or limited hours.'
                    },
                    {
                        title: 'Combat Indecision',
                        description: 'Guide the customer at the key moment, reducing friction in the purchase process.'
                    },
                    {
                        title: 'Inform and Resolve',
                        description: 'Answer frequently asked questions about hours, location, payment methods, promotions, and service conditions.'
                    },
                    {
                        title: 'Direct and Unified Access',
                        description: 'No forms, no installations, no registrations. Everything from the channel the customer already uses.'
                    },
                    {
                        title: 'Natural Experience',
                        description: 'More human conversations that interpret complex, colloquial language and user preferences.'
                    },
                    {
                        title: 'Fast and Effective Support',
                        description: 'Real-time support for purchase prospects, reducing friction and increasing conversions.'
                    },
                    {
                        title: 'Automated Management',
                        description: 'Automated and fluid order system that eliminates manual errors and streamlines your operation.'
                    },
                    {
                        title: 'Intelligent Inquiry',
                        description: 'Real-time access to product database with personalized recommendations based on user profile.'
                    }
                ]
            },
            timeline: {
                title: 'How Do We Start?',
                subtitle: 'Your chatbot up and running in just 7 days',
                steps: [
                    {
                        day: 'Day 1',
                        title: 'Initial Meeting',
                        description: 'We analyze your business, identify needs, and define clear objectives.',
                        checklist: ['30-minute call', 'Flow definition', 'Platform access']
                    },
                    {
                        day: 'Day 2-4',
                        title: 'Configuration',
                        description: 'We train your chatbot with your information, products, and customized responses.',
                        checklist: ['Knowledge base loading', 'Tone customization', 'Channel integration']
                    },
                    {
                        day: 'Day 5-6',
                        title: 'Testing',
                        description: 'We perform comprehensive tests and fine-tuning to ensure perfect responses.',
                        checklist: ['Conversation tests', 'Review with you', 'Final adjustments']
                    },
                    {
                        day: 'Day 7',
                        title: 'Live!',
                        description: 'We activate your chatbot and start capturing leads automatically.',
                        checklist: ['Official launch', 'Initial monitoring', 'Continuous support']
                    }
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
                {
                    name: 'Startup',
                    features: ['500 AI Conversations/month', '1-channel integration', 'Standard support', 'Basic Lead Report']
                },
                {
                    name: 'Growth (Recommended)',
                    features: ['2,500 AI Conversations/month', '3-channel integration (Web, WhatsApp, Instagram)', 'CRM Integration', 'Advanced Lead Reports', 'Priority support']
                }
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
            menu: {
                close: '← Close',
                tagline: 'WorthGrowth'
            }
        }
    };

    t(key: string): string {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        for (const k of keys) {
            value = value[k];
        }
        return value || key;
    }

    scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // --- Constante de WhatsApp ---
    private readonly WHATSAPP_NUMBER = '5493584171716';

    // Versión numérica para cálculos
    plansNumeric = [
        { name: 'Startup', priceUSD: 99 },
        { name: 'Growth (Recomendado)', priceUSD: 299 }
    ];

    // --- Listeners y Lifecycle Hooks ---
    ngOnInit(): void {
        this.isLoading = true;

        // Cotización
        this.fetchExchangeRate();
        setInterval(() => {
            this.fetchExchangeRate();
        }, 300000);
    }

    ngAfterViewInit(): void {
        // Listeners visuales
        this.setupVisibilityListener();

        // Three.js
        if (this.threeCanvas && this.scene) {
            this.initThree();
            this.animate(0);
        }

        // Animaciones de secciones y timeline
        this.observeElements();
        this.animateTimeline();

        // ⏱ Loading visible exactamente 2 segundos
        setTimeout(() => {
            this.ngZone.run(() => {
                this.isLoading = false;
                this.cdr.detectChanges();
            });
        }, 2000);
    }

    async fetchExchangeRate(): Promise<void> {
        this.isLoadingRate = true;

        try {
            // API gratuita de dólar argentina
            const response = await fetch('https://dolarapi.com/v1/dolares/blue');
            const data = await response.json();

            this.exchangeRate = {
                blue: data.venta || 1200, // Precio de venta
                oficial: data.compra || 1000,
                timestamp: new Date()
            };

            console.log('Cotización actualizada:', this.exchangeRate);
        } catch (error) {
            console.error('Error obteniendo cotización:', error);
            // Mantener valores fallback
        } finally {
            this.isLoadingRate = false;
        }
    }

    toggleCurrency(): void {
        this.currentCurrency = this.currentCurrency === 'USD' ? 'ARS' : 'USD';
    }

    formatPrice(usdPrice: number): string {
        if (this.currentCurrency === 'USD') {
            return `$${usdPrice}`;
        } else {
            const arsPrice = Math.round(usdPrice * this.exchangeRate.blue);
            return `$${arsPrice.toLocaleString('es-AR')}`;
        }
    }

    // Añadir después de los métodos existentes

    getBenefitsTranslated(): any[] {
        return this.translations[this.currentLanguage].benefits.items;
    }

    getTimelineSteps(): any[] {
        return this.translations[this.currentLanguage].timeline.steps;
    }

    getPlansTranslated(): any[] {
        return this.translations[this.currentLanguage].plans;
    }

    getCurrencyLabel(): string {
        return this.currentCurrency === 'USD' ? 'USD' : 'ARS';
    }

    getExchangeInfo(): string {
        if (this.currentCurrency !== 'ARS') return '';
        const rate = this.exchangeRate?.blue || 1200;
        return `Cotización Blue: $${rate}`;
    }

    getCommitmentItems(): any[] {
        return this.translations[this.currentLanguage].commitment.items;
    }

    getCurrentFlagUrl(): string {
        return this.currentLanguage === 'es' ? 'assets/flags/es.png' : 'assets/flags/usa.png';
    }

    changeLanguage(lang: string): void {
        this.currentLanguage = lang;
        this.isLangDropdownOpen = false;
        // Opcional: guardar en localStorage si quisieras persistencia
    }

    toggleLangDropdown(): void {
        this.isLangDropdownOpen = !this.isLangDropdownOpen;
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu(): void {
        console.log('Cerrando menú lateral');
        this.isMenuOpen = false;
    }

    openWhatsApp(messageType: string, isPlan: boolean = false): void {
        let message = '';
        const t = this.translations[this.currentLanguage].pricing;

        if (isPlan) {
            message = `Hola, me interesa contratar el plan ${messageType}.`;
        } else {
            message = `Hola, tengo una consulta sobre: ${messageType}`;
        }

        const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // --- Helpers de Animación y ThreeJS (mantener vacíos o mínimos si no se usan pero estaban referenciados) ---

    setupVisibilityListener(): void {
        const options = { root: null, threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Header scroll effect
                    if (window.scrollY > 50) {
                        this.isScrolled = true;
                    } else {
                        this.isScrolled = false;
                    }
                }
            });
        }, options);

        // Observar secciones principales
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Listener de scroll para header
        window.addEventListener('scroll', () => {
            this.isScrolled = window.scrollY > 50;
        });
    }

    initThree(): void {
        // Implementación básica o placeholder si se movió a otro componente
        // Si el FoodSceneComponent maneja todo, esto podría ser redundante aquí
        // Pero mantenemos estructura por compatibilidad
    }

    animate(time: number): void {
        // Loop de animación si fuera necesario
    }

    observeElements(): void {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }

    animateTimeline(): void {
        // Lógica de timeline si es necesaria
        const timelineData = document.querySelector('.timeline-section');
        if (!timelineData) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.activeStep = 1; // Iniciar animación
                    // Simular progresión
                    setTimeout(() => this.activeStep = 2, 1000);
                    setTimeout(() => this.activeStep = 3, 2000);
                    setTimeout(() => this.activeStep = 4, 3000);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(timelineData);
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
