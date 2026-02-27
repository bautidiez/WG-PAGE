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
        this.animateTimeline();
        setTimeout(() => {
            this.ngZone.run(() => { this.isLoading = false; this.cdr.detectChanges(); });
        }, 2000);
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

    animateTimeline(): void {
        const section = document.querySelector('.timeline-section');
        if (!section) return;

        // Respect prefers-reduced-motion — show everything immediately
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            this.activeStep = 4;
            const fill = section.querySelector('.timeline-line-fill');
            if (fill) fill.classList.add('animate');
            return;
        }

        // Already animated in this session? Show final state instantly
        if (sessionStorage.getItem('wg-timeline-animated') === '1') {
            this.activeStep = 4;
            const fill = section.querySelector('.timeline-line-fill');
            if (fill) fill.classList.add('animate');
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                // Fire once, then disconnect
                observer.disconnect();
                sessionStorage.setItem('wg-timeline-animated', '1');

                // 1. Start line drawing animation
                const fill = section.querySelector('.timeline-line-fill');
                if (fill) fill.classList.add('animate');

                // 2. Reveal steps sequentially with stagger
                const stepDelay = 800; // ms between each step
                const initialDelay = 400; // wait before first step
                this.ngZone.run(() => {
                    setTimeout(() => { this.activeStep = 1; this.cdr.detectChanges(); }, initialDelay);
                    setTimeout(() => { this.activeStep = 2; this.cdr.detectChanges(); }, initialDelay + stepDelay);
                    setTimeout(() => { this.activeStep = 3; this.cdr.detectChanges(); }, initialDelay + stepDelay * 2);
                    setTimeout(() => { this.activeStep = 4; this.cdr.detectChanges(); }, initialDelay + stepDelay * 3);
                });
            });
        }, { threshold: 0.4 });
        // Observe the timeline container (line+steps), not the whole section
        const target = section.querySelector('.timeline-container') || section;
        observer.observe(target);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }
}
