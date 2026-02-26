import {
    Component, OnInit, OnDestroy, NgZone,
    ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface FoodItem {
    id: number;
    src: string;
    alt: string;
    xPercent: number;
    yPercent: number;
    floatY: number;
    phase: number;
    width: number;
    rotation: number;
    scale: number;
    zIndex: number;
    isHovered: boolean;
    el?: HTMLElement; // Direct DOM reference for performance
}

@Component({
    selector: 'app-food-scene',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './food-scene.component.html',
    styleUrls: ['./food-scene.component.css']
})
export class FoodSceneComponent implements OnInit, AfterViewInit, OnDestroy {

    foodItems: FoodItem[] = [];
    private animationFrameId = 0;
    private readonly isBrowser = typeof window !== 'undefined';

    private readonly assets = [
        { src: 'assets/pizza.png', alt: 'Pizza' },
        { src: 'assets/burger.png', alt: 'Burger' },
        { src: 'assets/sushi.png', alt: 'Sushi' },
        { src: 'assets/gohan.png', alt: 'Bowl' }
    ];

    constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        if (this.isBrowser) this.initItems();
    }

    ngAfterViewInit(): void {
        if (this.isBrowser) {
            this.cdr.detectChanges(); // render items once
            this.ngZone.runOutsideAngular(() => {
                // After first render, grab DOM refs for each wrapper
                requestAnimationFrame(() => {
                    const wrappers = document.querySelectorAll('.food-item-wrapper');
                    wrappers.forEach((el, i) => {
                        if (this.foodItems[i]) this.foodItems[i].el = el as HTMLElement;
                    });
                    this.startAnimationLoop();
                });
            });
        }
    }

    ngOnDestroy(): void {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }

    private initItems(): void {
        const isMobile = window.innerWidth < 768;
        const isDemo = window.location.pathname.includes('/demo');
        // Reduce count significantly on demo page, keep high on landing page
        const count = isDemo ? (isMobile ? 25 : 50) : (isMobile ? 55 : 120);
        const w = window.innerWidth;

        // We use a multiple of viewport height to guarantee logical spread over 5 standard screens
        // regardless of whether the DOM has fully rendered yet on init.
        const h = window.innerHeight * 5.5;

        // Calculate forbidden zones dynamically based on actual DOM elements on the first screen
        const forbiddenRects: { left: number, right: number, top: number, bottom: number }[] = [];
        if (this.isBrowser) {
            // Target the main containers we want to keep clean
            const selectors = isDemo ?
                '.demo-form-panel, .demo-preview-panel, .demo-title-wrap' :
                '.hero-content, .hero-image';

            const elements = document.querySelectorAll(selectors);
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                // Add generous padding block (60px) around the content where food cannot spawn
                forbiddenRects.push({
                    left: rect.left - 60,
                    right: rect.right + 60,
                    top: rect.top + window.scrollY - 60,
                    bottom: rect.bottom + window.scrollY + 60
                });
            });
        }

        for (let i = 0; i < count; i++) {
            this.foodItems.push(this.createItem(i, w, h, forbiddenRects));
        }
    }

    private createItem(id: number, bw: number, bh: number, forbiddenRects: { left: number, right: number, top: number, bottom: number }[]): FoodItem {
        const asset = this.assets[Math.floor(Math.random() * this.assets.length)];
        const scale = 0.35 + Math.random() * 0.45; // 0.35–0.80x
        const isMobile = bw < 768;
        const size = (isMobile ? 55 : 95) * scale;

        // Distribute strictly: 50% left margin (15%), 50% right margin (15%)
        const roll = Math.random();
        let x: number, y: number;
        const maxAttempts = 60;
        let attempts = 0;
        let overlaps = false;

        do {
            overlaps = false;
            if (roll < 0.5) {
                // Left margin
                x = Math.random() * (bw * 0.15);
            } else {
                // Right margin
                x = bw * 0.85 + Math.random() * (bw * 0.15 - size);
            }
            y = Math.random() * (bh - size);

            // Prevent spawning in the top 50% of the very first screen (Hero section header/nav area)
            if (typeof window !== 'undefined' && y < window.innerHeight * 0.5) {
                overlaps = true;
            }

            // Check bounding boxes for collision
            if (!overlaps) {
                for (const rect of forbiddenRects) {
                    const centerX = x + size / 2;
                    const centerY = y + size / 2;
                    if (centerX > rect.left && centerX < rect.right && centerY > rect.top && centerY < rect.bottom) {
                        overlaps = true;
                        break;
                    }
                }
            }

            attempts++;
        } while (overlaps && attempts < maxAttempts);

        // Fallback: If area is extremely congested, push the item safely outside the 1st screen text bounds 
        if (overlaps) {
            x = Math.random() < 0.5 ? Math.random() * (bw * 0.05) : bw - size - Math.random() * (bw * 0.05);
            if (y < window.innerHeight) {
                y += window.innerHeight; // push below the fold
            }
        }

        return {
            id, src: asset.src, alt: asset.alt,
            xPercent: (x / bw) * 100,
            yPercent: (y / bh) * 100,
            floatY: 0,
            phase: Math.random() * Math.PI * 2,
            width: size, rotation: 0,
            scale, zIndex: Math.floor(scale * 10),
            isHovered: false
        };
    }

    private startAnimationLoop(): void {
        const loop = () => {
            this.tick();
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }

    private tick(): void {
        const now = Date.now() / 1000;
        for (const item of this.foodItems) {
            if (item.isHovered || !item.el) continue;
            item.floatY = Math.sin(now * 1.0 + item.phase) * 13;
            // Direct DOM update — no Angular CD needed
            item.el.style.transform = `translate3d(0,${item.floatY}px,0)`;
        }
    }

    // Called from template on hover
    onEnter(item: FoodItem) { item.isHovered = true; }
    onLeave(item: FoodItem) { item.isHovered = false; }
}
