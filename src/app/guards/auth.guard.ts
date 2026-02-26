import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);

    return authState(auth).pipe(
        take(1),
        map(user => {
            if (user) {
                return true; // Authorize access
            } else {
                // Redirigir al login y guardar la URL que intentaron acceder (opcional)
                router.navigate(['/login']);
                return false;
            }
        })
    );
};
