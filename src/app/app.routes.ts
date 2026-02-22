import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'demo',
        loadComponent: () =>
            import('./components/ficha-demo/ficha-demo.component').then(m => m.FichaDemoComponent)
    },
    { path: '**', redirectTo: '' }
];
