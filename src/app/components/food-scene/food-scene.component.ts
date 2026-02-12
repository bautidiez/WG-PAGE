import { Component, OnInit, OnDestroy, NgZone, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FoodItem {
    id: number;
    src: string;
    alt: string;

    // Physics state
    x: number;
    y: number;

    // Levitation state
    originalY: number;
    phase: number;    // Random start phase for sine wave

    // Visual properties
    width: number;
    rotation: number;
    scale: number;
    zIndex: number;

    // Interaction state
    isHovered: boolean;
}

@Component({
    selector: 'app-food-scene',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './food-scene.component.html',
    styleUrls: ['./food-scene.component.css'] // Only for static styles (mask, shadow), not motion
})
export class FoodSceneComponent implements OnInit, AfterViewInit, OnDestroy {
    foodItems: FoodItem[] = [];
    private assets = [
        { src: 'assets/pizza.png', alt: 'Pizza' },
        { src: 'assets/burger.png', alt: 'Burger' },
        { src: 'assets/sushi.png', alt: 'Sushi' },
        { src: 'assets/gohan.png', alt: 'Bowl' }
    ];

    private animationFrameId: number = 0;
    private isBrowser: boolean;

    constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {
        this.isBrowser = typeof window !== 'undefined';
    }


    ngOnInit(): void {
        if (this.isBrowser) {
            this.initItems();
        }
    }

    ngAfterViewInit(): void {
        if (this.isBrowser) {
            this.startAnimationLoop();
        }
    }

    ngOnDestroy(): void {
        this.stopAnimationLoop();
    }

    private initItems(): void {
        const itemCount = 18; // Increased from 12 to 18 for more density on sides
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < itemCount; i++) {
            this.foodItems.push(this.createRandomItem(i, width, height));
        }
    }

    private createRandomItem(id: number, boundW: number, boundH: number): FoodItem {
        const asset = this.assets[Math.floor(Math.random() * this.assets.length)];
        // Reduce scale a bit
        const scale = 0.4 + Math.random() * 0.4; // 0.4x to 0.8x

        // Reponsive base size - Significantly smaller but visible
        const isMobile = window.innerWidth < 768;
        const baseSize = isMobile ? 60 : 100;
        const size = baseSize * scale;

        // Random position distribution - Biased towards sides
        // 40% Left, 40% Right, 20% Uniform (but avoiding center)
        const sideBias = Math.random();

        // Center coordinates for exclusion logic
        const cx = boundW / 2;
        const cy = boundH / 2;
        const forbiddenRadius = Math.min(boundW, boundH) * 0.25;

        let x = 0, y = 0;
        let attempts = 0;
        let found = false;

        while (!found && attempts < 50) {
            if (sideBias < 0.4) {
                // Left 20%
                x = Math.random() * (boundW * 0.2 - size);
            } else if (sideBias < 0.8) {
                // Right 20% (starting from 80%)
                x = (boundW * 0.8) + Math.random() * (boundW * 0.2 - size);
            } else {
                // Anywhere
                x = Math.random() * (boundW - size);
            }

            y = Math.random() * (boundH - size);

            // Check distance from center to item center
            const dx = (x + size / 2) - cx;
            const dy = (y + size / 2) - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > forbiddenRadius) {
                found = true;
            }
            attempts++;
        }

        // If we couldn't find a spot (rare), x,y are from last random attempt, which is fine.

        return {
            id,
            src: asset.src,
            alt: asset.alt,
            x,
            y,
            originalY: y,
            phase: Math.random() * Math.PI * 2,
            width: size,
            rotation: 0, // No initial rotation
            scale,
            zIndex: Math.floor(scale * 10),
            isHovered: false
        };
    }

    private startAnimationLoop(): void {
        // Run outside Angular to prevent Change Detection on every frame
        this.ngZone.runOutsideAngular(() => {
            const loop = () => {
                this.updatePhysics();
                this.animationFrameId = requestAnimationFrame(loop);
            };
            this.animationFrameId = requestAnimationFrame(loop);
        });
    }

    private stopAnimationLoop(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    private updatePhysics(): void {
        // Use a time basis for sine wave
        const now = Date.now() / 1000; // Seconds

        for (const item of this.foodItems) {
            if (item.isHovered) continue; // Pause movement on hover for easier interaction

            // Levitation logic
            // y = originalY + sin(time * speed + phase) * amplitude
            // Amplitude: 10-15px
            // Speed: 1-2 rad/s

            const amplitude = 12;
            const speed = 1.0;

            item.y = item.originalY + Math.sin(now * speed + item.phase) * amplitude;

            // No x update, no rotation update
        }

        // We are outside Angular zone.
        // If we rely on [style.transform] binding, CD won't run.
        // We need to trigger CD manually? Or use direct DOM manipulation?
        // Triggering CD 60 times/sec for 20 items is heavy.
        // But since we use *ngFor, bindings update only on check.
        // Let's rely on standard binding but trigger detectChanges? 
        // Actually, for smoothness, direct DOM is better, but harder in "Angular way".
        // Compromise: Run detectChanges() inside the loop.
        this.cdr.detectChanges();
    }
}
