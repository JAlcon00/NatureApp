import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, switchMap } from 'rxjs';
import { Place, PlaceDetail, Trail, AISummary } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NatureApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Obtener todos los lugares con filtros opcionales
   * GET /api/places
   */
  getPlaces(category?: string, difficulty?: string): Observable<Place[]> {
    let url = `${this.baseUrl}/places`;
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return this.http.get<Place[]>(url);
  }

  /**
   * Obtener detalle completo de un lugar específico
   * GET /api/places/{id}
   */
  getPlaceDetail(id: number): Observable<PlaceDetail> {
    return this.http.get<PlaceDetail>(`${this.baseUrl}/places/${id}`);
  }

  /**
   * Obtener todos los senderos de todos los lugares
   * Combina múltiples llamadas para obtener información completa
   */
  getAllTrails(): Observable<(Trail & { placeName: string })[]> {
    return this.getPlaces().pipe(
      switchMap(places => {
        // Obtener detalles de cada lugar para acceder a sus trails
        const detailRequests = places.map(place => 
          this.getPlaceDetail(place.id).pipe(
            map(detail => ({
              place: detail,
              trails: detail.trails.map(trail => ({
                ...trail,
                placeName: detail.name
              }))
            }))
          )
        );
        
        return forkJoin(detailRequests);
      }),
      map(placesWithTrails => {
        // Combinar todos los trails en un solo array
        return placesWithTrails.flatMap(item => item.trails);
      })
    );
  }

  /**
   * Obtener categorías disponibles (derivadas de los lugares)
   */
  getCategories(): Observable<string[]> {
    return this.getPlaces().pipe(
      map(places => {
        const categories = places.map(place => place.category);
        return [...new Set(categories)].sort();
      })
    );
  }

  /**
   * Obtener dificultades disponibles (derivadas de los trails)
   */
  getDifficulties(): Observable<string[]> {
    return this.getAllTrails().pipe(
      map(trails => {
        const difficulties = trails.map(trail => trail.difficulty);
        return [...new Set(difficulties)].sort();
      })
    );
  }

  /**
   * Buscar lugares por nombre
   */
  searchPlacesByName(searchTerm: string): Observable<Place[]> {
    return this.getPlaces().pipe(
      map(places => 
        places.filter(place => 
          place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  /**
   * Obtener resumen generado por IA (GPT-4o-mini)
   * GET /api/places/{id}/summary
   */
  getPlaceSummary(id: number): Observable<AISummary> {
    return this.http.get<AISummary>(`${this.baseUrl}/places/${id}/summary`);
  }
}