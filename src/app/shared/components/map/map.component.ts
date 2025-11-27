import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../core/constants/environment';
import { Place } from '../../../core/models';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      #mapContainer 
      class="map-container"
      [style.height]="height"
      [style.width]="width">
    </div>
  `,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Input() places: Place[] = [];
  @Input() height: string = '400px';
  @Input() width: string = '100%';
  @Input() center: [number, number] = [-99.1332, 19.4326]; // Mexico City default
  @Input() zoom: number = 10;

  private map!: mapboxgl.Map;

  ngOnInit(): void {
    // Configurar el token de Mapbox
    mapboxgl.accessToken = environment.mapboxToken;
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/outdoors-v12', // Ideal para naturaleza
      center: this.center,
      zoom: this.zoom,
      trackResize: true,
      // Desactivar telemetría para evitar warnings de content blocker
      collectResourceTiming: false
    });

    this.map.on('load', () => {
      this.addPlaceMarkers();
    });

    // Agregar controles de navegación
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.FullscreenControl());
  }

  private addPlaceMarkers(): void {
    this.places.forEach(place => {
      if (place.latitude && place.longitude) {
        const accessibilityIcon = place.accessible ? '✓' : '✗';
        const accessibilityClass = place.accessible ? 'accessible' : 'not-accessible';
        
        // Crear popup con información completa del lugar
        const popup = new mapboxgl.Popup({ 
          offset: 35,
          maxWidth: '340px',
          className: 'custom-popup',
          anchor: 'bottom',
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
            <div class="map-popup">
              <div class="popup-header">
                <h4>${place.name}</h4>
                <span class="category-badge">${this.getMarkerIcon(place.category)} ${place.category}</span>
              </div>
              
              <div class="popup-content">
                <p class="description">${place.description || 'Sin descripción disponible'}</p>
                
                <div class="popup-info">
                  <div class="info-item">
                    <span class="icon">🏔️</span>
                    <span class="text"><strong>Elevación:</strong> ${place.elevationMeters}m</span>
                  </div>
                  
                  <div class="info-item">
                    <span class="icon">💰</span>
                    <span class="text"><strong>Entrada:</strong> $${place.entryFee} MXN</span>
                  </div>
                  
                  <div class="info-item ${accessibilityClass}">
                    <span class="icon">♿</span>
                    <span class="text"><strong>Accesible:</strong> ${accessibilityIcon}</span>
                  </div>
                  
                  <div class="info-item">
                    <span class="icon">🕐</span>
                    <span class="text"><strong>Horario:</strong> ${place.openingHours}</span>
                  </div>
                </div>
                
                <a href="/places/${place.id}" class="popup-link" onclick="event.preventDefault(); window.location.href='/places/${place.id}'">
                  Ver detalles completos →
                </a>
              </div>
            </div>
          `);

        // Crear marcador personalizado con animación
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
          <div class="marker-icon">${this.getMarkerIcon(place.category)}</div>
          <div class="marker-pulse"></div>
        `;

        new mapboxgl.Marker(markerElement)
          .setLngLat([place.longitude, place.latitude])
          .setPopup(popup)
          .addTo(this.map);
      }
    });

    // Ajustar la vista para mostrar todos los marcadores
    if (this.places.length > 0) {
      this.fitMapToMarkers();
    }
  }

  private getMarkerIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Parque Nacional': '🏞️',
      'Reserva Natural': '🌲',
      'Playa': '🏖️',
      'Montaña': '⛰️',
      'Sendero': '🥾',
      'Cascada': '💧',
      'Cenote': '🕳️',
      'Mirador': '🔭',
      'Volcán': '🌋',
      'Lago': '🏞️',
      'default': '📍'
    };
    return icons[category] || icons['default'];
  }

  private fitMapToMarkers(): void {
    const bounds = new mapboxgl.LngLatBounds();
    
    this.places.forEach(place => {
      if (place.latitude && place.longitude) {
        bounds.extend([place.longitude, place.latitude]);
      }
    });

    this.map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  }

  // Método público para centrar el mapa en un lugar específico
  public centerOnPlace(place: Place): void {
    if (place.latitude && place.longitude && this.map) {
      this.map.flyTo({
        center: [place.longitude, place.latitude],
        zoom: 14,
        duration: 1000
      });
    }
  }

  // Método público para actualizar los lugares en el mapa
  public updatePlaces(newPlaces: Place[]): void {
    this.places = newPlaces;
    if (this.map && this.map.loaded()) {
      // Limpiar marcadores existentes
      this.clearMarkers();
      // Agregar nuevos marcadores
      this.addPlaceMarkers();
    }
  }

  private clearMarkers(): void {
    // Remover todos los marcadores existentes
    const markers = document.querySelectorAll('.custom-marker');
    markers.forEach(marker => marker.remove());
  }
}