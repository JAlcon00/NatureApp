import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NatureApiService } from '../../core/services/nature-api.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { MapComponent } from '../../shared/components/map/map.component';
import { Place } from '../../core/models';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, MapComponent],
  template: `
    <div class="places-container">
      <div class="header">
        <h1>🏞️ Lugares Naturales de México</h1>
        
        <div class="filters-section">
          <div class="view-toggles">
            <button 
              class="btn toggle-btn" 
              [class.active]="viewMode === 'list'"
              (click)="viewMode = 'list'">
              📋 Lista
            </button>
            <button 
              class="btn toggle-btn" 
              [class.active]="viewMode === 'map'"
              (click)="viewMode = 'map'">
              🗺️ Mapa
            </button>
          </div>
          
          <div class="filters">
            <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="filter-select">
              <option value="">🌍 Todas las categorías</option>
              <option value="Cascada">💧 Cascadas</option>
              <option value="Parque Nacional">🌲 Parques Nacionales</option>
              <option value="Mirador">🔭 Miradores</option>
              <option value="Cenote">🕳️ Cenotes</option>
              <option value="Volcán">🌋 Volcanes</option>
            </select>
            
            <button class="btn btn-clear" *ngIf="selectedCategory" (click)="clearFilters()">
              Limpiar filtros
            </button>
          </div>
          
          <div class="results-info" *ngIf="!loading">
            Mostrando {{ places.length }} lugar{{ places.length !== 1 ? 'es' : '' }}
          </div>
        </div>
      </div>

      <div class="places-content" *ngIf="!loading">
        <!-- Vista de Lista -->
        <div class="places-grid" *ngIf="viewMode === 'list' && places.length > 0">
          <div class="place-card" *ngFor="let place of places" (click)="viewDetail(place.id)">
            <div class="card-header">
              <h3>{{ place.name }}</h3>
              <span class="category-badge" [class]="getCategoryClass(place.category)">
                {{ place.category }}
              </span>
            </div>
            
            <div class="card-content">
              <div class="description" *ngIf="place.description">
                <p>{{ place.description | slice:0:120 }}{{ place.description.length > 120 ? '...' : '' }}</p>
              </div>
              
              <div class="info-grid">
                <div class="info-row">
                  <span class="label">🏔️ Elevación:</span>
                  <span class="value">{{ place.elevationMeters }}m</span>
                </div>
                
                <div class="info-row">
                  <span class="label">♿ Accesible:</span>
                  <span class="value" [class]="place.accessible ? 'accessible' : 'not-accessible'">
                    {{ place.accessible ? '✓ Sí' : '✗ No' }}
                  </span>
                </div>
                
                <div class="info-row">
                  <span class="label">💰 Costo:</span>
                  <span class="value fee">\${{ place.entryFee }} MXN</span>
                </div>
                
                <div class="info-row">
                  <span class="label">🕐 Horario:</span>
                  <span class="value hours">{{ place.openingHours }}</span>
                </div>

                <div class="info-row">
                  <span class="label">📍 Ubicación:</span>
                  <span class="value coordinates">{{ formatCoordinates(place.latitude, place.longitude) }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <button class="btn btn-detail">Ver Detalle Completo →</button>
            </div>
          </div>
        </div>

        <!-- Vista de Mapa -->
        <div class="map-section" *ngIf="viewMode === 'map' && places.length > 0">
          <app-map 
            [places]="places" 
            [height]="'60vh'"
            [center]="[-99.1332, 19.4326]"
            [zoom]="6">
          </app-map>
          
          <div class="map-legend">
            <h4>Leyenda del Mapa</h4>
            <div class="legend-items">
              <div class="legend-item">🏞️ Parque Nacional</div>
              <div class="legend-item">🌲 Reserva Natural</div>
              <div class="legend-item">🏖️ Playa</div>
              <div class="legend-item">⛰️ Montaña</div>
              <div class="legend-item">🥾 Sendero</div>
              <div class="legend-item">💧 Cascada</div>
              <div class="legend-item">🕳️ Cenote</div>
              <div class="legend-item">🔭 Mirador</div>
              <div class="legend-item">🌋 Volcán</div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="places.length === 0">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron lugares</h3>
          <p>No hay lugares que coincidan con los filtros seleccionados.</p>
          <button class="btn btn-primary" (click)="clearFilters()">Ver todos los lugares</button>
        </div>
      </div>

      <app-loading *ngIf="loading"></app-loading>
    </div>
  `,
  styleUrl: './places.component.scss'
})
export class PlacesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly natureApi = inject(NatureApiService);

  places: Place[] = [];
  selectedCategory = '';
  loading = false;
  viewMode: 'list' | 'map' = 'list';

  ngOnInit() {
    this.loadPlaces();
  }

  private loadPlaces() {
    this.loading = true;
    this.natureApi.getPlaces().subscribe({
      next: (places) => {
        this.places = places;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading places:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.loading = true;
    this.natureApi.getPlaces(this.selectedCategory || undefined).subscribe({
      next: (places) => {
        this.places = places;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering places:', error);
        this.loading = false;
      }
    });
  }

  clearFilters() {
    this.selectedCategory = '';
    this.loadPlaces();
  }

  viewDetail(id: number) {
    this.router.navigate(['/places', id]);
  }

  getCategoryClass(category: string): string {
    return category.toLowerCase().replace(/\s+/g, '-').replace(/[áéíóú]/g, (match) => {
      const accents: { [key: string]: string } = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
      return accents[match] || match;
    });
  }

  formatCoordinates(lat: number, lng: number): string {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}