import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // ✅ ESPERAR hasta que sepamos si hay usuario o no (incluyendo resultados de redirect)
    await authService.authReady;

    if (authService.isAuthenticated()) {
        return true;
    }

    // No autenticado → login
    return router.createUrlTree(['/login']);
};
