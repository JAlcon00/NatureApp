import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NatureApiService } from '../../../core/services/nature-api.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PlaceDetail } from '../../../core/models';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div class="place-detail-container" *ngIf="place && !loading">
      <div class="detail-header">
        <button class="btn-back" (click)="goBack()">
          ← Volver a lugares
        </button>
        
        <div class="title-section">
          <h1>{{ place.name }}</h1>
          <span class="category-badge" [class]="getCategoryClass(place.category)">
            {{ place.category }}
          </span>
        </div>
      </div>

      <div class="detail-content">
        <!-- Información principal -->
        <div class="main-info-section">
          <div class="info-card">
            <h2>📋 Información General</h2>
            <div class="info-grid">
              <div class="info-item" *ngIf="place.description">
                <label>Descripción:</label>
                <p>{{ place.description }}</p>
              </div>
              
              <div class="info-row">
                <div class="info-item">
                  <label>📍 Coordenadas:</label>
                  <p class="coordinates">{{ place.latitude }}, {{ place.longitude }}</p>
                </div>
                
                <div class="info-item">
                  <label>🏔️ Elevación:</label>
                  <p><strong>{{ place.elevationMeters }}</strong> metros</p>
                </div>
              </div>

              <div class="info-row">
                <div class="info-item">
                  <label>♿ Accesibilidad:</label>
                  <p [class]="place.accessible ? 'accessible' : 'not-accessible'">
                    {{ place.accessible ? '✓ Accesible' : '✗ No accesible' }}
                  </p>
                </div>
                
                <div class="info-item">
                  <label>💰 Costo de entrada:</label>
                  <p class="fee"><strong>\${{ place.entryFee }}</strong> MXN</p>
                </div>
              </div>

              <div class="info-item">
                <label>🕐 Horario de operación:</label>
                <p class="hours">{{ place.openingHours }}</p>
              </div>

              <div class="info-item" *ngIf="place.createdAt">
                <label>📅 Registrado el:</label>
                <p>{{ formatDate(place.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Amenidades -->
        <div class="amenities-section" *ngIf="place.amenities && place.amenities.length > 0">
          <div class="info-card">
            <h2>🏕️ Servicios y Amenidades</h2>
            <div class="amenities-grid">
              <span class="amenity-chip" *ngFor="let amenity of place.amenities">
                {{ amenity.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Senderos -->
        <div class="trails-section" *ngIf="place.trails && place.trails.length > 0">
          <div class="info-card">
            <h2>🥾 Senderos Disponibles</h2>
            <div class="trails-grid">
              <div class="trail-card" *ngFor="let trail of place.trails">
                <div class="trail-header">
                  <h4>{{ trail.name }}</h4>
                  <span class="difficulty-badge" [class]="getDifficultyClass(trail.difficulty)">
                    {{ trail.difficulty }}
                  </span>
                </div>
                
                <div class="trail-info">
                  <div class="trail-stat">
                    <span class="icon">📏</span>
                    <span class="label">Distancia:</span>
                    <span class="value">{{ trail.distanceKm }} km</span>
                  </div>
                  
                  <div class="trail-stat">
                    <span class="icon">⏱️</span>
                    <span class="label">Tiempo estimado:</span>
                    <span class="value">{{ trail.estimatedTimeMinutes }} min</span>
                  </div>
                  
                  <div class="trail-stat">
                    <span class="icon">{{ trail.isLoop ? '🔄' : '➡️' }}</span>
                    <span class="label">Tipo:</span>
                    <span class="value">{{ trail.isLoop ? 'Circuito' : 'Ida y vuelta' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Galería de fotos -->
        <div class="photos-section" *ngIf="place.photos && place.photos.length > 0">
          <div class="info-card">
            <h2>📸 Galería de Fotos</h2>
            <div class="photos-grid">
              <div class="photo-item" *ngFor="let photo of place.photos">
                <img [src]="photo.url" [alt]="photo.description" loading="lazy" (click)="openPhoto(photo.url)">
                <div class="photo-description">
                  <p>{{ photo.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reseñas -->
        <div class="reviews-section" *ngIf="place.reviews && place.reviews.length > 0">
          <div class="info-card">
            <h2>⭐ Reseñas de Visitantes</h2>
            <div class="reviews-grid">
              <div class="review-card" *ngFor="let review of place.reviews">
                <div class="review-header">
                  <div class="author">{{ review.author }}</div>
                  <div class="rating">
                    <span *ngFor="let star of getStars(review.rating)">{{ star }}</span>
                  </div>
                </div>
                <p class="review-comment">{{ review.comment }}</p>
                <div class="review-date">{{ formatDate(review.createdAt) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-loading *ngIf="loading"></app-loading>

    <div class="error-state" *ngIf="!loading && !place">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h2>Lugar no encontrado</h2>
        <p>No se pudo cargar la información de este lugar.</p>
        <button class="btn btn-primary" (click)="goBack()">Volver a lugares</button>
      </div>
    </div>
  `,
  styleUrl: './place-detail.component.scss'
})
export class PlaceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly natureApi = inject(NatureApiService);

  place: PlaceDetail | null = null;
  loading = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadPlaceDetail(id);
      }
    });
  }

  private loadPlaceDetail(id: number) {
    this.loading = true;
    this.natureApi.getPlaceDetail(id).subscribe({
      next: (place) => {
        this.place = place;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading place detail:', error);
        this.place = null;
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/places']);
  }

  getCategoryClass(category: string): string {
    return category.toLowerCase().replace(/\s+/g, '-').replace(/[áéíóú]/g, (match) => {
      const accents: { [key: string]: string } = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
      return accents[match] || match;
    });
  }

  getDifficultyClass(difficulty: string): string {
    return `difficulty-${difficulty.toLowerCase()}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? '⭐' : '☆');
    }
    return stars;
  }

  openPhoto(url: string) {
    // En una app más completa, abriríamos un modal o lightbox
    window.open(url, '_blank');
  }
}