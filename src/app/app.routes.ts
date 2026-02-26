import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { Onboarding } from './components/admin/onboarding/onboarding';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { Subscription } from './components/admin/subscription/subscription';
import { Settings } from './components/admin/settings/settings';
import { Vincular } from './components/public/vincular/vincular';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin/onboarding', component: Onboarding, canActivate: [authGuard] },
    { path: 'admin/dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'admin/settings', component: Settings, canActivate: [authGuard] },
    { path: 'admin/subscription', component: Subscription, canActivate: [authGuard] },
    {
        path: 'demo',
        loadComponent: () =>
            import('./components/ficha-demo/ficha-demo.component').then(m => m.FichaDemoComponent)
    },
    { path: 'vincular/:uid', component: Vincular },
    { path: '**', redirectTo: '' }
];
