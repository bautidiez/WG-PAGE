
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

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
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    styleUrl: './app.component.css',
    template: `
<div class="app-container" [class.loading]="isLoading"> <!-- Loading Screen --> <div class="loading-screen" *ngIf="isLoading"> <div class="loading-content"> <img src="assets/logo.png" alt="WorthGrowth Logo" class="loading-logo" width="120" height="120" fetchpriority="high"> <div class="loading-spinner"></div> </div> </div>
<canvas #threeCanvas class="three-canvas"></canvas>

<!-- Header --><header class="header" [class.scrolled]="isScrolled"> <nav class="nav-container"> <div class="logo-container" (click)="scrollToTop()"> <div class="logo-badge"> <img src="assets/logo.png" alt="WorthGrowth" class="logo-img"> </div> </div>

<!-- Selector de idioma -->
<div class="language-dropdown">
  <button class="lang-dropdown-btn" (click)="toggleLangDropdown()">
    <img [src]="getCurrentFlagUrl()" class="flag-icon" [alt]="currentLanguage">
    <span class="arrow-down">▼</span>
  </button>
  
  <div class="lang-dropdown-menu" [class.open]="isLangDropdownOpen">
    <button (click)="changeLanguage('es')" class="lang-option" [class.active]="currentLanguage === 'es'">
      <img src="assets/flags/es.png" class="flag-icon" alt="Español">
      <span>Español</span>
    </button>
    <button (click)="changeLanguage('en')" class="lang-option" [class.active]="currentLanguage === 'en'">
      <img src="assets/flags/usa.png" class="flag-icon" alt="English">
      <span>English</span>
    </button>
  </div>
</div>

<!-- Menú hamburguesa solo móvil -->
<button class="menu-toggle-btn" (click)="toggleMenu()">
  <span class="menu-icon">{{ isMenuOpen ? '✕' : '☰' }}</span>
</button>

<!-- Links desktop -->
<div class="nav-links-desktop">
  <a href="#inicio" class="nav-link">{{ t('nav.home') }}</a>
  <a href="#servicio" class="nav-link">{{ t('nav.services') }}</a>
  <a href="#video" class="nav-link">{{ t('nav.video') }}</a>
  <a href="#precios" class="nav-link">{{ t('nav.pricing') }}</a>
</div>

<button class="nav-button" (click)="openWhatsApp('Consulta General Header')">
  <svg class="whatsapp-svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366"/>
  </svg>
  <span class="nav-btn-text">{{ t('nav.contact') }}</span>
</button>
</nav> </header><!-- Side Menu --><div class="side-menu" [class.open]="isMenuOpen"> <button class="close-menu-btn" (click)="closeMenu()"> {{ t('menu.close') }} </button> <div class="menu-logo"> <span class="logo-text-menu">WG</span> <p class="menu-tagline">{{ t('menu.tagline') }}</p> </div> <a href="#inicio" (click)="closeMenu()">{{ t('nav.home') }}</a> <a href="#servicio" (click)="closeMenu()">{{ t('nav.services') }}</a> <a href="#video" (click)="closeMenu()">{{ t('nav.video') }}</a> <a href="#precios" (click)="closeMenu()">{{ t('nav.pricing') }}</a> </div><!-- Hero Section --><section class="hero-section" id="inicio"> <div class="container"> <div class="hero-layout"> <div class="hero-content"> <h1 class="hero-title montserrat-extrabold"> <span class="gradient-text">{{ t('hero.title') }}</span> <span class="subtitle-dark">{{ t('hero.subtitle') }}</span> </h1>

    <div class="hero-cta-container">
      <button class="primary-button" (click)="openWhatsApp('Demo de Hero')">
        {{ t('hero.cta') }}
        <span class="arrow">→</span>
      </button>
      <p class="hero-cta-hint">{{ t('hero.hint') }}</p>
    </div>
  </div>

  <div class="hero-image">
    <img 
      src="assets/stock_1.png" 
      alt="AI Chatbot Illustration" 
      class="hero-img"
      loading="eager"
      decoding="async"
      fetchpriority="high"
      width="850"
      height="auto">
  </div>
</div>
</div> </section><section class="benefits-section" id="servicio"> <div class="container"> <div class="section-header"> <h2 class="section-title">{{ t('benefits.title') }}</h2> <p class="section-subtitle">{{ t('benefits.subtitle') }}</p> </div>

<div class="benefits-orbital-container">
  <!-- Imagen central -->
  <div class="benefits-center-image">
    <img 
      src="assets/stock_2.png" 
      alt="AI Benefits" 
      class="central-stock-img"
      (load)="onImageLoad()"
      (error)="onImageError($event)">
  </div>
  
  <!-- Beneficios orbitales -->
  <div 
    *ngFor="let benefit of getBenefitsTranslated(); let i = index"
    class="benefit-card-orbital"
    [class.active]="selectedBenefit === i"
    [style.transform]="getBenefitOrbitalPosition(i)"
    (click)="selectBenefit(i)">
    
    <div class="benefit-card-content">
      <img
        class="benefit-icon"
        [src]="'assets/benefits/logo' + (i + 1) + '.png'"
        [alt]="'Icono beneficio ' + (i + 1)"
        loading="lazy"
        decoding="async"
      >

      <h4 class="benefit-title">{{ benefit.title }}</h4>
    </div>
    
    <!-- Descripción expandida -->
    <div class="benefit-description" *ngIf="selectedBenefit === i">
      <p>{{ benefit.description }}</p>
    </div>
  </div>
</div>
</div> </section><!-- Timeline Section --><section class="timeline-section" id="proceso"> <div class="container"> <div class="section-header"> <h2 class="section-title">{{ t('timeline.title') }}</h2> <p class="section-subtitle">{{ t('timeline.subtitle') }}</p> </div>

<div class="timeline-container">
  <div class="timeline-line">
    <div class="timeline-line-fill"></div>
  </div>
  
  <div class="timeline-step" 
      *ngFor="let step of getTimelineSteps(); let i = index"
      [class.active]="activeStep >= (i + 1)">
    <div class="step-dot"></div>
    <div class="step-content">
      <div class="step-day">{{ step.day }}</div>
      <h3 class="step-title">{{ step.title }}</h3>
      <p class="step-description">{{ step.description }}</p>
      <ul class="step-checklist">
        <li *ngFor="let item of step.checklist">✓ {{ item }}</li>
      </ul>
    </div>
  </div>
</div>
</div> </section><!-- Video Section --><section class="chatbot-video-section" id="video"> <div class="container"> <div class="section-header"> <h2 class="section-title">{{ t('video.title') }}</h2> <p class="section-subtitle">{{ t('video.subtitle') }}</p> </div> <div class="video-placeholder"> <p class="video-cta-text">{{ t('video.placeholder') }}</p> <button class="primary-button" (click)="openWhatsApp('Demo Video')"> {{ t('video.cta') }} </button> </div> </div> </section><!-- Pricing Section --><section class="pricing-section" id="precios"> <div class="container"> <div class="section-header"> <h2 class="section-title">{{ t('pricing.title') }}</h2> <p class="section-subtitle">{{ t('pricing.subtitle') }}</p>

  <div class="currency-selector">
    <button 
      class="currency-btn" 
      [class.active]="currentCurrency === 'USD'"
      (click)="currentCurrency = 'USD'">
      USD ($)
    </button>
    <button 
      class="currency-btn" 
      [class.active]="currentCurrency === 'ARS'"
      (click)="currentCurrency = 'ARS'">
      ARS ($)
    </button>
  </div>
  
  <div class="exchange-info" *ngIf="currentCurrency === 'ARS'">
    <span class="exchange-icon">💱</span>
    <span>{{ getExchangeInfo() }}</span>
    <button class="refresh-btn" (click)="fetchExchangeRate()" [disabled]="isLoadingRate">
      <span [class.spinning]="isLoadingRate">🔄</span>
    </button>
  </div>
</div>

<div class="pricing-grid">
  <div class="plan-card" *ngFor="let plan of getPlansTranslated(); let i = index" [class.highlight]="i === 1">
    <div class="plan-header">
      <span class="plan-badge">PLAN</span>
      <h3 class="plan-name">{{ plan.name }}</h3>
    </div>
    
    <div class="price-container">
      <p class="plan-price">
        {{ formatPrice(plansNumeric[i].priceUSD) }}
        <span class="currency-label">{{ getCurrencyLabel() }}</span>
        <span class="price-period">{{ t('pricing.perMonth') }}</span>
      </p>
    </div>
    
    <ul class="plan-features">
      <li *ngFor="let feature of plan.features">✓ {{ feature }}</li>
    </ul>
    
    <button class="plan-button" (click)="openWhatsApp('Plan ' + plan.name, true)">
      {{ t('pricing.hire') }} <span class="arrow">→</span>
    </button>
  </div>
</div>

<div class="cta-meeting">
  <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--color-primary);">
    {{ t('pricing.needMore') }}
  </h3>
  <p style="margin-bottom: 1.5rem; font-size: 1.125rem; line-height: 1.6;">
    {{ t('pricing.meetingDesc') }}
  </p>
  <p style="margin-bottom: 1.5rem; color: var(--color-light);">
    {{ t('pricing.meetingTopics') }}
  </p>
  <button class="secondary-button" (click)="openWhatsApp('Solicitud Reunión Detallada')">
    📅 {{ t('pricing.scheduleMeeting') }}
  </button>
</div>
</div> </section><!-- Commitment Section --><section class="commitment-section"> <div class="container"> <h2 class="commitment-title">{{ t('commitment.title') }}</h2>

<div class="commitment-grid-fullwidth">
  <div class="commitment-item-animated" *ngFor="let item of getCommitmentItems()">
    <span class="commitment-check">✓</span>
    <div>
      <h4>{{ item.title }}</h4>
      <p>{{ item.description }}</p>
    </div>
  </div>
</div>

<div class="commitment-button-container">
  <a href="https://worthgrowth.com/" target="_blank" class="commitment-link">
    {{ t('commitment.cta') }}
    <img src="assets/mouse.png" alt="mouse" class="mouse-icon">
  </a>
</div>
</div> </section><!-- Footer --><footer class="footer"> <div class="container footer-content"> <div class="footer-grid-new"> <div class="footer-column-brand"> <div class="footer-logo-container"> <img src="assets/logo.png" alt="WorthGrowth" class="footer-logo-img"> <div class="footer-brand-name"> <span class="footer-brand-w">W</span>orth<span class="footer-brand-g">G</span>rowth </div> </div> <a href="https://worthgrowth.com/" target="_blank" class="footer-link-main"> {{ t('footer.mainPage') }} </a> </div>

  <!-- Navegación footer -->
  <div class="footer-column-nav">
    <h4 class="footer-heading">{{ t('footer.navigation') }}</h4>

    <a href="#inicio" class="footer-nav-link">
      {{ t('nav.home') }}
    </a>

    <a href="#servicio" class="footer-nav-link">
      {{ t('nav.services') }}
    </a>

    <a href="#video" class="footer-nav-link">
      {{ t('nav.video') }}
    </a>

    <a href="#precios" class="footer-nav-link">
      {{ t('nav.pricing') }}
    </a>

    <a
      href=""
      (click)="openWhatsApp('Solicitud Demo Footer'); $event.preventDefault()"
      class="footer-nav-link"
      style="cursor: pointer; font-weight: 600;"
    >
      {{ t('footer.requestDemo') }}
    </a>
  </div>

  <div class="footer-column-contact">
    <h4 class="footer-heading">{{ t('footer.contact') }}</h4>
    <p class="footer-text">{{ t('footer.contactDesc') }}</p>
    <a href="https://wa.me/5493584171716" target="_blank" class="footer-contact">
      📱 +54 9 358 417-1716
    </a>
    <a href="mailto:bautistadiez@worthgrowth.com" class="footer-contact">
      ✉️ bautistadiez&#64;worthgrowth.com
    </a>
    <p class="footer-response">{{ t('footer.response') }}</p>
  </div>
</div>

<div class="footer-bottom">
  <p class="copyright-text">{{ t('footer.copyright') }}</p>
</div>
</div> </footer><!-- Floating Buttons -->
<button class="whatsapp-float"
[class.visible]="isScrolled"
(click)="openWhatsApp('Consulta Rápida Flotante')"
title="WhatsApp">
<svg class="whatsapp-svg-float" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="white"/>
</svg>
</button>
`
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
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

        return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
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
                copyright: '© 2024 WorthGrowth AI. Todos los derechos reservados.',
                mainPage: 'Página principal →',
                requestDemo: 'Solicitar Demo'
            },
            menu: {
                close: '← Cerrar',
                tagline: 'WorthGrowth AI'
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
                copyright: '© 2024 WorthGrowth AI. All rights reserved.',
                mainPage: 'Main page →',
                requestDemo: 'Request Demo'
            },
            menu: {
                close: '← Close',
                tagline: 'WorthGrowth AI'
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
        if (this.threeCanvas) {
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

    getCommitmentItems(): any[] {
        return this.translations[this.currentLanguage].commitment.items;
    }

    getCurrencyLabel(): string {
        return this.currentCurrency === 'USD' ? 'USD' : 'ARS';
    }

    getExchangeInfo(): string {
        if (this.currentCurrency === 'ARS') {
            return `Cotización: $${this.exchangeRate.blue.toLocaleString('es-AR')} (Blue)`;
        }
        return '';
    }

    private timelineObserver?: IntersectionObserver;

    private animateTimeline(): void {
        const timelineSection = document.querySelector('.timeline-section');
        if (!timelineSection) {
            console.warn('⚠️ Timeline section no encontrada');
            return;
        }

        const startIfNeeded = () => {
            if (this.timelineStarted) return;
            this.timelineStarted = true;

            const lineFill = document.querySelector('.timeline-line-fill');
            if (lineFill) {
                lineFill.classList.add('animate');
            }

            // Aseguramos que al menos el primer paso esté activo
            this.activeStep = 1;
            this.startTimelineAnimation();
        };

        this.timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startIfNeeded();
                    this.timelineObserver?.disconnect();
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });

        this.timelineObserver.observe(timelineSection);

        // Por si ya está visible cuando se crea el observer
        const rect = timelineSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            startIfNeeded();
            this.timelineObserver.disconnect();
        }
    }

    private startTimelineAnimation(): void {
        const totalSteps = this.getTimelineSteps().length; // normalmente 4
        const stepDuration = 800; // Reduced from 1000ms for smoother flow

        let currentStep = 1;
        this.activeStep = 1; // "Reunión Inicial"

        // Ejecutamos el temporizador fuera de Angular para no saturar,
        // y volvemos a Angular solo cuando toca actualizar la vista.
        this.ngZone.runOutsideAngular(() => {
            const intervalId = setInterval(() => {
                currentStep++;

                if (currentStep > totalSteps) {
                    clearInterval(intervalId);
                    return;
                }

                this.ngZone.run(() => {
                    this.activeStep = currentStep;   // Día 2 -> Día 3 -> Día 4
                    this.cdr.markForCheck();
                });

            }, stepDuration);
        });
    }

    toggleLangDropdown(): void {
        this.isLangDropdownOpen = !this.isLangDropdownOpen;
    }

    getCurrentFlagUrl(): string {
        return this.currentLanguage === 'es'
            ? 'assets/flags/es.png'
            : 'assets/flags/usa.png';
    }

    changeLanguage(lang: string): void {
        this.currentLanguage = lang;
        this.isLangDropdownOpen = false; // Cerrar dropdown al seleccionar
    }
    // 👇 AGREGAR ESTA FUNCIÓN COMPLETA
    private observeElements(): void {
        // ✅ Asignar a propiedad de clase
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1
        });

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('fade-in-section');
            this.observer!.observe(section);
        });
    }

    @HostListener('window:scroll')
    onScroll(): void {
        this.isScrolled = window.scrollY > 50;
    }

    resizeThree(): void {
        const canvas = this.threeCanvas.nativeElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    @HostListener('window:resize')
    onResize(): void {
        this.resizeThree();

        // Forzar re-render de posiciones orbitales
        if (this.selectedBenefit !== null) {
            const temp = this.selectedBenefit;
            this.selectedBenefit = null;
            setTimeout(() => {
                this.selectedBenefit = temp;
            }, 50);
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    // --- Lógica de Menú ---
    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu(): void {
        this.isMenuOpen = false;
    }

    // Nuevo método auxiliar para limpiar Three.js
    private cleanupThreeJS(): void {
        this.scene.traverse((object: any) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((mat: any) => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }

    // --- Lógica de WhatsApp (CTA Único) ---
    openWhatsApp(context: string, isPlan: boolean = false): void {
        let defaultMessage: string;

        if (isPlan) {
            defaultMessage = `¡Hola WorthGrowth! 👋
Estoy muy interesado en contratar el servicio de Chatbot IA para automatizar mi negocio.

📋 Plan seleccionado: ${context}

Me gustaría recibir:
✅ Detalles completos del plan
✅ Proceso de implementación
✅ Tiempos de activación
✅ Pasos para comenzar

¿Podrían ayudarme con esta información?`;
        } else if (context.includes('Reunión')) {
            defaultMessage = `¡Hola WorthGrowth! 👋

Me gustaría agendar una reunión con un experto para que me expliquen en detalle:

📊 Funcionamiento del sistema de Chatbot IA
🔗 Cómo se integra con mis plataformas actuales
💼 Soluciones personalizadas para mi negocio
📈 ROI esperado y casos de éxito

¿Cuándo podríamos coordinar una llamada?`;
        } else {
            defaultMessage = `¡Hola WorthGrowth! 👋

Estoy interesado en automatizar mi negocio con su Chatbot IA.

Mi consulta específica es sobre: ${context}

¿Podrían brindarme más información?`;
        }

        const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`;
        window.open(url, '_blank');
    }

    ngOnDestroy(): void {
        // Detener la animación de Three.js
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Limpiar la escena 3D
        if (this.scene && this.renderer) {
            this.cleanupThreeJS();
            this.renderer.dispose();
        }

        // Limpiar el observer de intersección
        if (this.observer) {
            this.observer.disconnect();
        }

        // Limpiar el observer del timeline
        if (this.timelineObserver) {
            this.timelineObserver.disconnect();
        }
    }

    // --- Lógica de Three.js (Fondo 3D Red de Datos) ---
    // --- Lógica de Three.js (Fondo 3D Red de Datos) ---
    // Variables para Three.js
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private lines!: THREE.LineSegments;
    private particleCount = 400;
    private particlePositions!: Float32Array;

    initThree(): void {
        const canvas = this.threeCanvas.nativeElement;

        if (!canvas.clientWidth || !canvas.clientHeight) {
            console.warn('⚠️ Canvas sin dimensiones, reintentando...');
            let retries = 0;
            const maxRetries = 10;

            const checkDimensions = () => {
                if (canvas.clientWidth && canvas.clientHeight) {
                    this.setupThreeScene(canvas);
                } else if (retries < maxRetries) {
                    retries++;
                    requestAnimationFrame(checkDimensions);
                } else {
                    console.error('❌ Canvas nunca obtuvo dimensiones');
                }
            };

            requestAnimationFrame(checkDimensions);
            return;
        }

        this.setupThreeScene(canvas);
    }

    private setupThreeScene(canvas: HTMLCanvasElement): void {
        const isMobile = window.innerWidth < 768;
        this.particleCount = isMobile ? 200 : 400;

        this.scene = new THREE.Scene();

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = isMobile ? 60 : 50;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: !isMobile,
            alpha: true,
            powerPreference: isMobile ? 'default' : 'high-performance'
        });

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        console.log('✅ Three.js inicializado:', { width, height, isMobile });

        const lineOpacity = isMobile ? 0.25 : 0.45;

        this.particlePositions = new Float32Array(this.particleCount * 3);

        for (let i = 0; i < this.particleCount; i++) {
            this.particlePositions[i * 3] = (Math.random() - 0.5) * 200;
            this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }

        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(this.particleCount * this.particleCount * 3);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x7c3aed,
            transparent: true,
            opacity: lineOpacity,
            blending: THREE.AdditiveBlending
        });

        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lines);

        console.log('✅ Escena Three.js lista con', this.particleCount, 'partículas');
    }

    animate = (time: number) => {
        this.animationId = requestAnimationFrame(this.animate);

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            this.particlePositions[i3 + 1] += Math.sin(time * 0.0003 + i) * 0.03;
            this.particlePositions[i3] += Math.cos(time * 0.0002 + i) * 0.02;

            if (this.particlePositions[i3 + 1] > 100) this.particlePositions[i3 + 1] = -100;
            if (this.particlePositions[i3] > 100) this.particlePositions[i3] = -100;
        }

        if (this.lines) {
            const linePositions = this.lines.geometry.attributes['position'].array as Float32Array;
            let vertexIndex = 0;

            for (let i = 0; i < this.particleCount; i++) {
                for (let j = i + 1; j < this.particleCount; j++) {
                    const dx = this.particlePositions[i * 3] - this.particlePositions[j * 3];
                    const dy = this.particlePositions[i * 3 + 1] - this.particlePositions[j * 3 + 1];
                    const dz = this.particlePositions[i * 3 + 2] - this.particlePositions[j * 3 + 2];
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (distance < 25) {
                        linePositions[vertexIndex++] = this.particlePositions[i * 3];
                        linePositions[vertexIndex++] = this.particlePositions[i * 3 + 1];
                        linePositions[vertexIndex++] = this.particlePositions[i * 3 + 2];

                        linePositions[vertexIndex++] = this.particlePositions[j * 3];
                        linePositions[vertexIndex++] = this.particlePositions[j * 3 + 1];
                        linePositions[vertexIndex++] = this.particlePositions[j * 3 + 2];
                    }
                }
            }

            this.lines.geometry.setDrawRange(0, vertexIndex / 3);
            this.lines.geometry.attributes['position'].needsUpdate = true;
            this.lines.rotation.y = time * 0.00003;
        }

        this.camera.position.x += (this.mouseX * 2 - this.camera.position.x) * 0.015;
        this.camera.position.y += (-this.mouseY * 2 - this.camera.position.y) * 0.015;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    };

    // ✅ AGREGAR MÉTODO FALTANTE
    private setupVisibilityListener(): void {
        // ✅ Detectar cuando la página se vuelve visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.scene && this.renderer) {
                this.renderer.render(this.scene, this.camera);
            }
        });
    }
}
