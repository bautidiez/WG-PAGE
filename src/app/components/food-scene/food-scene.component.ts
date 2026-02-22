import {
    Component, OnInit, OnDestroy, NgZone,
    ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface FoodItem {
    id: number;
    src: string;
    alt: string;
    x: number;
    y: number;
    originalY: number;
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
        const count = 22;
        const w = window.innerWidth;
        const h = window.innerHeight;
        for (let i = 0; i < count; i++) {
            this.foodItems.push(this.createItem(i, w, h));
        }
    }

    private createItem(id: number, bw: number, bh: number): FoodItem {
        const asset = this.assets[Math.floor(Math.random() * this.assets.length)];
        const scale = 0.35 + Math.random() * 0.45; // 0.35–0.80x
        const isMobile = bw < 768;
        const size = (isMobile ? 55 : 95) * scale;

        // Distribute: 40% left strip, 40% right strip, 20% top/bottom strips
        const roll = Math.random();
        let x: number, y: number;
        const maxAttempts = 60;
        const cx = bw / 2, cy = bh / 2;
        const forbidR = Math.min(bw, bh) * 0.28;

        let attempts = 0;
        do {
            if (roll < 0.4) {
                x = Math.random() * (bw * 0.22);
            } else if (roll < 0.8) {
                x = bw * 0.78 + Math.random() * (bw * 0.22 - size);
            } else {
                x = Math.random() * (bw - size);
            }
            y = Math.random() * (bh - size);
            attempts++;
        } while (
            Math.hypot(x + size / 2 - cx, y + size / 2 - cy) < forbidR &&
            attempts < maxAttempts
        );

        return {
            id, src: asset.src, alt: asset.alt,
            x, y, originalY: y,
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
            item.y = item.originalY + Math.sin(now * 1.0 + item.phase) * 13;
            // Direct DOM update — no Angular CD needed
            item.el.style.transform = `translate3d(${item.x}px,${item.y}px,0)`;
        }
    }

    // Called from template on hover
    onEnter(item: FoodItem) { item.isHovered = true; }
    onLeave(item: FoodItem) { item.isHovered = false; }
}
