import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NatureApiService } from '../../../core/services/nature-api.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PlaceDetail, AISummary } from '../../../core/models';

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
        <!-- Resumen con IA -->
        <div class="ai-summary-section">
          <div class="ai-card">
            <div class="ai-sparkle-bg"></div>
            <div class="ai-header">
              <div class="ai-icon-wrapper">
                <svg class="ai-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                        fill="currentColor" opacity="0.3"/>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="ai-header-text">
                <h2>Resumen Inteligente</h2>
                <p class="ai-subtitle">Generado con IA · GPT-4o Mini</p>
              </div>
            </div>
            
            <div class="ai-body">
              <button 
                class="btn-ai" 
                (click)="generateAISummary()" 
                [disabled]="loadingAI"
                *ngIf="!aiSummary && !loadingAI && !aiError">
                <span class="btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" stroke-width="2" 
                          stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span class="btn-text">Generar Resumen</span>
              </button>
              
              <div class="ai-loading" *ngIf="loadingAI">
                <div class="loading-wrapper">
                  <div class="dot-pulse">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                  </div>
                  <p>Analizando información del lugar...</p>
                  <span class="loading-subtext">Esto puede tardar unos segundos</span>
                </div>
              </div>
              
              <div class="ai-content" *ngIf="aiSummary && !loadingAI">
                <div class="ai-badge">
                  <svg class="badge-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" 
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Verificado por IA</span>
                </div>
                
                <div class="ai-summary-text" [innerHTML]="formatSummary(aiSummary.summary)"></div>
                
                <div class="ai-footer">
                  <div class="ai-metadata">
                    <div class="metadata-chip">
                      <svg class="chip-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ aiSummary.model }}</span>
                    </div>
                    <div class="metadata-chip">
                      <svg class="chip-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ formatDate(aiSummary.generatedAt) }}</span>
                    </div>
                  </div>
                  <button class="btn-regenerate" (click)="generateAISummary()">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Regenerar
                  </button>
                </div>
              </div>
              
              <div class="ai-error" *ngIf="aiError && !loadingAI">
                <div class="error-content">
                  <svg class="error-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h3>No se pudo generar el resumen</h3>
                  <p>{{ aiError }}</p>
                  <button class="btn-retry" (click)="generateAISummary()">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

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
  
  // Propiedades para IA
  aiSummary: AISummary | null = null;
  loadingAI = false;
  aiError: string | null = null;

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

  generateAISummary() {
    if (!this.place) return;
    
    // Limpiar estado anterior
    this.aiSummary = null;
    this.aiError = null;
    this.loadingAI = true;
    
    this.natureApi.getPlaceSummary(this.place.id).subscribe({
      next: (summary) => {
        this.aiSummary = summary;
        this.loadingAI = false;
      },
      error: (error) => {
        console.error('Error generating AI summary:', error);
        this.aiError = 'No se pudo generar el resumen. Por favor, intenta de nuevo.';
        this.loadingAI = false;
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

  formatSummary(summary: string): string {
    // Convertir el texto plano en HTML con mejor formato
    return summary
      .split('\n\n')
      .map(paragraph => {
        // Detectar listas
        if (paragraph.includes('- ')) {
          const items = paragraph.split('\n').filter(line => line.trim());
          const listItems = items.map(item => {
            if (item.trim().startsWith('- ')) {
              return `<li>${item.trim().substring(2)}</li>`;
            }
            return `<p class="list-intro">${item}</p>`;
          }).join('');
          return `<ul>${listItems}</ul>`;
        }
        // Párrafos normales
        return `<p>${paragraph}</p>`;
      })
      .join('');
  }
}