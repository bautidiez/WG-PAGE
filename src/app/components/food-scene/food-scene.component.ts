import { Component, OnInit, OnDestroy, NgZone, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FoodItem {
    id: number;
    src: string;
    alt: string;

    // Physics state
    x: number;
    y: number;
    vx: number;
    vy: number;

    // Visual properties
    width: number;
    rotation: number;
    rotationSpeed: number;
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
        const itemCount = 20; // 20 items is good density
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < itemCount; i++) {
            this.foodItems.push(this.createRandomItem(i, width, height));
        }
    }

    private createRandomItem(id: number, boundW: number, boundH: number): FoodItem {
        const asset = this.assets[Math.floor(Math.random() * this.assets.length)];
        const scale = 0.4 + Math.random() * 0.5; // 0.4x to 0.9x (Smaller items)

        // Responsive base size
        const isMobile = window.innerWidth < 768;
        const baseSize = isMobile ? 45 : 120; // Mobile: 45px (smaller), Desktop: 120px (restored to original large size)

        // Random position within bounds
        const x = Math.random() * (boundW - 100);
        const y = Math.random() * (boundH - 100);

        // Velocity: "Gravitational" feel = steady but slow, drifting
        // Giving them random directions
        // Speed range: 0.2 to 0.8 pixels per frame (approx 12-48px per sec at 60fps)
        const speed = 0.3 + Math.random() * 0.5;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        return {
            id,
            src: asset.src,
            alt: asset.alt,
            x,
            y,
            vx,
            vy,
            width: baseSize * scale,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 0.4, // Slow rotation
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
        const boundW = window.innerWidth;
        const boundH = window.innerHeight;

        for (const item of this.foodItems) {
            if (item.isHovered) continue; // Pause movement on hover for easier interaction

            // Update Position
            item.x += item.vx;
            item.y += item.vy;
            item.rotation += item.rotationSpeed;

            // Bounce off walls (Walls are screen ends)
            // Check X
            if (item.x <= 0) {
                item.x = 0;
                item.vx *= -1;
            } else if (item.x + item.width >= boundW) {
                item.x = boundW - item.width;
                item.vx *= -1;
            }

            // Check Y
            if (item.y <= 0) {
                item.y = 0;
                item.vy *= -1;
            } else if (item.y + item.width >= boundH) { // Assuming square-ish aspect for simplicity of bounds
                item.y = boundH - item.width;
                item.vy *= -1;
            }
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
