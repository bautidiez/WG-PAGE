import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mientras verifica si hay redirect pendiente -->
    @if (authService.isLoading()) {
      <div class="full-page-loader">
        <div class="loader-content">
          <img src="assets/logo.png" alt="WG Logo" class="loader-logo">
          <div class="loader-footer">
            <div class="loader-spinner"></div>
            <p class="loader-text">Iniciando sesión segura</p>
          </div>
        </div>
      </div>
    } @else {
      <div class="login-page">
        <!-- Background decorative elements -->
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>

        <div class="login-card">
          <div class="logo-container">
            <img src="assets/logo.png" alt="WG Logo" class="login-logo">
          </div>
          
          <h2 class="montserrat-bold">Bienvenido</h2>
          <p class="subtitle montserrat-regular">Gestiona tu negocio con la tecnología de WG</p>

          <div class="login-actions">
            <button 
              class="google-btn" 
              (click)="login()" 
              [disabled]="authService.isRedirecting()">
              
              @if (authService.isRedirecting()) {
                <span class="loader-small"></span>
                <span>Conectando...</span>
              } @else {
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
                <span>Ingresar con Google</span>
              }
            </button>
          </div>

          @if (error) {
            <div class="error-container">
              <span class="error-icon">⚠️</span>
              <p class="error-msg">{{ error }}</p>
            </div>
          }

          <div class="card-footer">
            <p>© 2024 WG Digital Soluctions</p>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap');

    :host {
      --color-primary: #7c3aed;
      --color-secondary: #8b5cf6;
      --color-white: #ffffff;
      --color-bg: #f8fafc;
      --color-text: #1e293b;
      --color-text-light: #64748b;
      --color-border: #e2e8f0;
      font-family: 'Montserrat', sans-serif;
    }

    .montserrat-bold { font-weight: 700; }
    .montserrat-regular { font-weight: 400; }

    .loader-small {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid #fff;
      border-radius: 50%;
      animation: spin-small 1s linear infinite;
    }

    @keyframes spin-small {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: var(--color-bg);
      padding: 24px;
      position: relative;
      overflow: hidden;
    }

    /* Decorative backgrounds */
    .bg-circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      opacity: 0.4;
    }
    .circle-1 {
      width: 400px;
      height: 400px;
      background: var(--color-primary);
      top: -100px;
      right: -100px;
    }
    .circle-2 {
      width: 300px;
      height: 300px;
      background: var(--color-secondary);
      bottom: -50px;
      left: -50px;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid var(--color-white);
      border-radius: 32px;
      padding: 48px;
      width: 100%;
      max-width: 440px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 10;
    }

    .logo-container {
      margin-bottom: 32px;
    }

    .login-logo {
      height: 72px;
      object-fit: contain;
    }

    h2 {
      color: var(--color-text);
      font-size: 32px;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    .subtitle {
      color: var(--color-text-light);
      margin-bottom: 40px;
      line-height: 1.6;
    }

    .google-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      background: var(--color-white);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      padding: 16px;
      border-radius: 16px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .google-btn:hover:not(:disabled) {
      background: #fafafa;
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border-color: var(--color-primary);
    }

    .google-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      background: var(--color-bg);
    }

    /* Transition to primary on redirecting */
    .google-btn[disabled]:not(:hover) {
       background: var(--color-primary);
       color: white;
       border: none;
    }

    .google-btn img {
      width: 22px;
    }

    .error-container {
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px;
      background: #fef2f2;
      border-radius: 12px;
      border: 1px solid #fee2e2;
    }

    .error-icon { font-size: 18px; }

    .error-msg {
      color: #dc2626;
      font-size: 14px;
      font-weight: 500;
      margin: 0;
    }

    .card-footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid var(--color-border);
    }

    .card-footer p {
      color: var(--color-text-light);
      font-size: 13px;
    }
  `]
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  error = '';

  async ngOnInit(): Promise<void> {
    await this.authService.authReady;
    this.cdr.detectChanges();

    if (this.authService.isAuthenticated()) {
      const data = this.authService.userData();
      if (data && !data.datosCompletados) {
        this.router.navigate(['/admin/onboarding']);
      } else if (data && (data.trialActivo || data.estadoSuscripcion === 'activa')) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/admin/dashboard']);
      }
    }
  }

  login(): void {
    this.error = '';
    this.authService.loginWithGoogle().catch(err => {
      if (err?.code !== 'auth/popup-closed-by-user') {
        this.error = 'Error al conectar con Google. Reintenta.';
        this.cdr.detectChanges();
      }
    });
  }
}
