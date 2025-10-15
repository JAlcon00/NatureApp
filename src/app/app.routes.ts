import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'places', 
    loadComponent: () => import('./features/places/places.component').then(m => m.PlacesComponent)
  },
  { 
    path: 'places/:id', 
    loadComponent: () => import('./features/places/place-detail/place-detail.component').then(m => m.PlaceDetailComponent)
  },
  { 
    path: 'trails', 
    loadComponent: () => import('./features/trails/trails.component').then(m => m.TrailsComponent)
  },
  { path: '**', redirectTo: '/home' }
];
