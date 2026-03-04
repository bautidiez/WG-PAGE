import {
    Component, OnInit, AfterViewInit, OnDestroy,
    ElementRef, ViewChild, HostListener, NgZone, ChangeDetectorRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { FoodSceneComponent } from '../food-scene/food-scene.component';
import { Router, RouterModule } from '@angular/router';
import { ChatbotEnAccionComponent } from '../../sections/chatbot-en-accion/chatbot-en-accion.component';
import { TranslationService } from '../../services/translation.service';
import { WhatsAppService } from '../../services/whatsapp.service';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, FoodSceneComponent, RouterModule, ChatbotEnAccionComponent],
    styleUrl: './landing.component.css',
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

    // ── Services ──────────────────────────────────────────────
    readonly translation = inject(TranslationService);
    readonly whatsapp = inject(WhatsAppService);
    readonly exchangeRateSvc = inject(ExchangeRateService);
    private ngZone = inject(NgZone);
    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);

    // ── View ──────────────────────────────────────────────────
    @ViewChild('threeCanvas') threeCanvas!: ElementRef<HTMLCanvasElement>;

    // ── State ─────────────────────────────────────────────────
    isScrolled = false;
    isMenuOpen = false;
    isLoading = true;
    isLangDropdownOpen = false;
    selectedBenefit: number | null = null;
    activeStep = 0;
    currentCurrency: 'USD' | 'ARS' = 'USD';
    private timelineAnimated = false;

    // Three.js (kept for canvas compatibility)
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    renderer!: THREE.WebGLRenderer;

    private animationId?: number;
    private observer?: IntersectionObserver;

    // ── Delegation helpers (used in template) ─────────────────
    t(key: string): string { return this.translation.t(key); }
    get currentLanguage() { return this.translation.currentLanguage(); }
    getCurrentFlagUrl(): string { return this.currentLanguage === 'es' ? 'assets/flags/es.png' : 'assets/flags/usa.png'; }
    changeLanguage(lang: 'es' | 'en') { this.translation.changeLanguage(lang); }
    toggleLangDropdown() { this.isLangDropdownOpen = !this.isLangDropdownOpen; }

    getBenefitsTranslated(): any[] { return this.translation.getItems('benefits.items'); }
    getTimelineSteps(): any[] { return this.translation.getItems('timeline.steps'); }
    getPlansTranslated(): any[] { return this.translation.getItems('plans'); }
    getCommitmentItems(): any[] { return this.translation.getItems('commitment.items'); }

    getHeroImage(): string {
        return this.currentLanguage === 'en' ? 'assets/gastro_hero_eng.png' : 'assets/gastro_hero.png';
    }

    // ── Exchange rate helpers ─────────────────────────────────
    get isLoadingRate() { return this.exchangeRateSvc.isLoading(); }
    fetchExchangeRate() { this.exchangeRateSvc.fetchRate(); }
    getExchangeInfo(): string { return this.currentCurrency !== 'ARS' ? '' : this.exchangeRateSvc.getInfo(); }

    formatPrice(usdPrice: number): string {
        if (this.currentCurrency === 'USD') return `$${usdPrice}`;
        const arsPrice = Math.round(usdPrice * this.exchangeRateSvc.rate().blue);
        return `$${arsPrice.toLocaleString('es-AR')}`;
    }

    getCurrencyLabel(): string { return this.currentCurrency; }

    plansNumeric = [
        { name: 'Startup', priceUSD: 99 },
        { name: 'Growth (Recomendado)', priceUSD: 299 }
    ];

    // ── WhatsApp ──────────────────────────────────────────────
    openWhatsApp(messageType: string, isPlan = false): void {
        this.whatsapp.open(messageType, isPlan);
    }

    // ── Navigation ────────────────────────────────────────────
    scrollToTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    goToDemo(): void { this.router.navigate(['/demo']); }
    toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
    closeMenu(): void { this.isMenuOpen = false; }

    // ── Benefit orbital ───────────────────────────────────────
    getBenefitOrbitalPosition(index: number): string {
        const totalBenefits = 8;
        const angle = (360 / totalBenefits) * index - 90;
        const radius = window.innerWidth < 1200 ? 270 : 320;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }

    selectBenefit(index: number): void {
        const isSame = this.selectedBenefit === index;
        this.selectedBenefit = isSame ? null : index;
        if (this.selectedBenefit === null) return;
        setTimeout(() => {
            const cards = document.querySelectorAll('.benefit-card-orbital');
            const card = cards[index] as HTMLElement | undefined;
            if (!card) return;
            const desc = card.querySelector('.benefit-description') as HTMLElement | null;
            const target = desc || card;
            const rect = target.getBoundingClientRect();
            const vh = window.innerHeight;
            const isMobile = window.innerWidth < 768;
            const headerOffset = isMobile ? 70 : 90;
            const visibleHeight = vh - headerOffset;
            const targetScroll = rect.top + window.pageYOffset - (visibleHeight / 2 - rect.height / 2) - (headerOffset / 2);
            window.scrollTo({ top: Math.max(0, Math.min(targetScroll, document.body.scrollHeight - vh)), behavior: 'smooth' });
        }, 150);
    }

    onImageLoad(): void { /* intentionally empty */ }
    onImageError(event: any): void {
        event.target.src = 'https://via.placeholder.com/350/7c3aed/ffffff?text=AI+Benefits';
    }

    // ── Lifecycle ─────────────────────────────────────────────
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (this.isMenuOpen && !target.closest('.side-menu') && !target.closest('.menu-toggle-btn')) this.isMenuOpen = false;
        if (this.isLangDropdownOpen && !target.closest('.language-dropdown')) this.isLangDropdownOpen = false;
        if (this.selectedBenefit !== null && !target.closest('.benefit-card-orbital') && !target.closest('.benefit-description')) this.selectedBenefit = null;
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.exchangeRateSvc.fetchRate();
        setInterval(() => this.exchangeRateSvc.fetchRate(), 300_000);
    }

    ngAfterViewInit(): void {
        this.setupVisibilityListener();
        if (this.threeCanvas && this.scene) { this.initThree(); this.animate(0); }
        this.observeElements();

        setTimeout(() => {
            this.ngZone.run(() => {
                this.isLoading = false;
                this.cdr.detectChanges();

                // Siempre iniciar animaciones
                this.initTimelineAnimations();

                setTimeout(() => ScrollTrigger.refresh(), 100);
            });
        }, 2000);
    }

    private initTimelineAnimations(): void {
        // Adjust for mobile vs desktop using width
        const isDesktop = window.innerWidth >= 768;
        const yMultiplier = isDesktop ? 1 : 0.5;

        // Rendimiento y prevenir FOUC usando gsap.set
        gsap.set(['.timeline-section .section-title', '.timeline-section .section-subtitle'], { opacity: 0, y: 30 * yMultiplier });
        gsap.set('.timeline-card', { opacity: 0, y: 60 * yMultiplier });
        gsap.set('.timeline-pill', { opacity: 0, y: -40 * yMultiplier });
        gsap.set('.timeline-dot', { opacity: 0, scale: 0 });
        gsap.set('.timeline-line-gsap', isDesktop ? { width: '0%' } : { height: '0%' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.timeline-section',
                start: 'top 75%',
                once: true,
            }
        });

        tl.to('.timeline-section .section-title', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform' })
            .to('.timeline-section .section-subtitle', { y: 0, opacity: 1, duration: 0.5, clearProps: 'transform' }, '-=0.3')
            .to('.timeline-line-gsap', isDesktop ? { width: '100%', duration: 1.5, ease: 'power2.inOut' } : { height: '100%', duration: 1.5, ease: 'power2.inOut' }, '-=0.2')
            .to('.timeline-pill', { y: 0, opacity: 1, stagger: 0.15, ease: 'back.out(2.5)', duration: 0.7, clearProps: 'transform' }, '-=1.2')
            .to('.timeline-dot', { scale: 1, opacity: 1, stagger: 0.2, ease: 'back.out(2)', duration: 0.5, clearProps: 'transform' }, '-=0.8')
            .to('.timeline-card', { y: 0, opacity: 1, stagger: 0.18, ease: 'power3.out', duration: 0.7, clearProps: 'transform' }, '-=0.3');

        this.initParallax();
    }

    private initParallax(): void {
        gsap.to('.emoji-left', {
            scrollTrigger: { trigger: '.timeline-section', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
            y: -80, rotation: 15
        });
        gsap.to('.emoji-right', {
            scrollTrigger: { trigger: '.timeline-section', start: 'top bottom', end: 'bottom top', scrub: 2 },
            y: -40, rotation: -10
        });
        gsap.to('.emoji-bg', {
            scrollTrigger: { trigger: '.timeline-section', scrub: 3 },
            y: -20
        });
    }

    setupVisibilityListener(): void {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) this.isScrolled = window.scrollY > 50;
            });
        }, { root: null, threshold: 0.1 });
        document.querySelectorAll('section').forEach(s => observer.observe(s));
        window.addEventListener('scroll', () => { this.isScrolled = window.scrollY > 50; });
    }

    initThree(): void { /* handled by FoodSceneComponent */ }
    animate(_time: number): void { /* loop if needed */ }

    observeElements(): void {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }

    // Animación antigua mediante scroll variables properties eliminada a favor de GSAP

    ngOnDestroy(): void {
        this.observer?.disconnect();
        if (this.animationId) cancelAnimationFrame(this.animationId);
        ScrollTrigger.getAll().forEach(t => t.kill());
    }
}
