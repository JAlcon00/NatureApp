import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NatureApiService } from '../../core/services/nature-api.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { Trail } from '../../core/models';

@Component({
  selector: 'app-trails',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div class="trails-container">
      <div class="header">
        <h1>🥾 Senderos y Rutas de México</h1>
        <p>Descubre todos los senderos disponibles en nuestros lugares naturales</p>
      </div>

      <div class="trails-content" *ngIf="!loading">
        <div class="stats-bar" *ngIf="allTrails.length > 0">
          <div class="stat">
            <span class="number">{{ allTrails.length }}</span>
            <span class="label">Senderos totales</span>
          </div>
          <div class="stat">
            <span class="number">{{ formatDistance(getTotalDistance()) }}</span>
            <span class="label">km totales</span>
          </div>
          <div class="stat">
            <span class="number">{{ getDifficultyCount('Fácil') }}</span>
            <span class="label">Fáciles</span>
          </div>
          <div class="stat">
            <span class="number">{{ getDifficultyCount('Moderado') }}</span>
            <span class="label">Moderados</span>
          </div>
        </div>

        <div class="trails-grid" *ngIf="allTrails.length > 0">
          <div class="trail-card" *ngFor="let trail of allTrails" (click)="viewPlace(trail.placeId)">
            <div class="trail-header">
              <h3>{{ trail.name }}</h3>
              <span class="difficulty-badge" [class]="getDifficultyClass(trail.difficulty)">
                {{ trail.difficulty }}
              </span>
            </div>
            
            <div class="trail-info">
              <div class="info-grid">
                <div class="info-item">
                  <span class="icon">📏</span>
                  <div class="info-content">
                    <span class="label">Distancia</span>
                    <span class="value">{{ formatDistance(trail.distanceKm) }} km</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="icon">⏱️</span>
                  <div class="info-content">
                    <span class="label">Tiempo</span>
                    <span class="value">{{ trail.estimatedTimeMinutes }} min</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="icon">{{ trail.isLoop ? '🔄' : '➡️' }}</span>
                  <div class="info-content">
                    <span class="label">Tipo</span>
                    <span class="value">{{ trail.isLoop ? 'Circuito' : 'Ida y vuelta' }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="icon">📍</span>
                  <div class="info-content">
                    <span class="label">Lugar</span>
                    <span class="value place-name">{{ trail.placeName }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="trail-footer">
              <button class="btn btn-detail">Ver Lugar Completo →</button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="allTrails.length === 0">
          <div class="empty-icon">🥾</div>
          <h3>No hay senderos disponibles</h3>
          <p>Actualmente no tenemos información de senderos disponibles.</p>
          <button class="btn btn-primary" (click)="goToPlaces()">Explorar Lugares</button>
        </div>
      </div>

      <app-loading *ngIf="loading"></app-loading>
    </div>
  `,
  styleUrl: './trails.component.scss'
})
export class TrailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly natureApi = inject(NatureApiService);

  allTrails: (Trail & { placeName: string })[] = [];
  loading = false;

  ngOnInit() {
    this.loadAllTrails();
  }

  private loadAllTrails() {
    this.loading = true;
    this.natureApi.getAllTrails().subscribe({
      next: (trails) => {
        this.allTrails = trails;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading trails:', error);
        this.loading = false;
      }
    });
  }

  viewPlace(placeId: number) {
    this.router.navigate(['/places', placeId]);
  }

  goToPlaces() {
    this.router.navigate(['/places']);
  }

  getDifficultyClass(difficulty: string): string {
    return `difficulty-${difficulty.toLowerCase()}`;
  }

  getTotalDistance(): number {
    return this.allTrails.reduce((total, trail) => total + trail.distanceKm, 0);
  }

  getDifficultyCount(difficulty: string): number {
    return this.allTrails.filter(trail => trail.difficulty === difficulty).length;
  }

  formatDistance(distance: number): string {
    return distance % 1 === 0 ? distance.toString() : distance.toFixed(1);
  }
}