import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NatureApiService } from '../../core/services/nature-api.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { Place } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1>🌿 Descubre la Naturaleza de México 🇲🇽</h1>
        <p>Explora los lugares más hermosos y senderos naturales del país</p>
      </div>

      <div class="stats-grid" *ngIf="!loading">
        <div class="stat-card">
          <div class="stat-number">{{ totalPlaces }}</div>
          <div class="stat-label">Lugares Naturales</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalTrails }}</div>
          <div class="stat-label">Senderos</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalCategories }}</div>
          <div class="stat-label">Categorías</div>
        </div>
      </div>

      <div class="quick-access">
        <h2>Explora México Natural</h2>
        <div class="action-buttons">
          <button class="btn btn-primary" (click)="goToPlaces()">
            📍 Ver Todos los Lugares
          </button>
          <button class="btn btn-secondary" (click)="goToTrails()">
            🥾 Explorar Senderos
          </button>
        </div>
      </div>

      <div class="featured-places" *ngIf="featuredPlaces.length > 0 && !loading">
        <h2>Lugares Destacados</h2>
        <div class="places-grid">
          <div class="place-card" *ngFor="let place of featuredPlaces" (click)="goToPlaceDetail(place.id)">
            <div class="place-header">
              <h3>{{ place.name }}</h3>
              <span class="category-badge" [class]="getCategoryClass(place.category)">
                {{ place.category }}
              </span>
            </div>
            <div class="place-info">
              <div class="info-item">
                <span class="icon">🏔️</span>
                <span>{{ place.elevationMeters }}m</span>
              </div>
              <div class="info-item">
                <span class="icon">💰</span>
                <span>\${{ place.entryFee }} MXN</span>
              </div>
              <div class="info-item">
                <span class="icon">♿</span>
                <span>{{ place.accessible ? 'Accesible' : 'No accesible' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <app-loading *ngIf="loading"></app-loading>
    </div>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly natureApi = inject(NatureApiService);

  totalPlaces = 0;
  totalTrails = 0;
  totalCategories = 0;
  featuredPlaces: Place[] = [];
  loading = false;

  ngOnInit() {
    this.loadHomeData();
  }

  private loadHomeData() {
    this.loading = true;
    
    // Cargar lugares
    this.natureApi.getPlaces().subscribe({
      next: (places) => {
        this.totalPlaces = places.length;
        this.featuredPlaces = places.slice(0, 3); // Mostrar solo 3 lugares destacados
        
        // Calcular categorías únicas
        const uniqueCategories = new Set(places.map(p => p.category));
        this.totalCategories = uniqueCategories.size;
        
        // Estimación simple de trails (en una app real, harías una llamada específica)
        this.totalTrails = places.length * 2;
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading home data:', error);
        this.loading = false;
      }
    });
  }

  goToPlaces() {
    this.router.navigate(['/places']);
  }

  goToTrails() {
    this.router.navigate(['/trails']);
  }

  goToPlaceDetail(id: number) {
    this.router.navigate(['/places', id]);
  }

  getCategoryClass(category: string): string {
    return category.toLowerCase().replace(/\s+/g, '-').replace(/[áéíóú]/g, (match) => {
      const accents: { [key: string]: string } = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
      return accents[match] || match;
    });
  }
}