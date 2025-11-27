# 🤖 Guía de Integración API con IA - Frontend Angular

## 📋 Endpoints Disponibles

### URL Base
```typescript
// Producción
const API_URL = 'https://natureapi-production.up.railway.app';

// Desarrollo
const API_URL = 'http://localhost:5000';
```

---

## 🌍 Endpoints de Lugares

### 1. Listar Todos los Lugares
```http
GET /api/places
```

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Cascadas de Agua Azul",
    "category": "Cascada",
    "latitude": 17.2583,
    "longitude": -92.1167,
    "elevationMeters": 180,
    "accessible": true,
    "entryFee": 45,
    "openingHours": "8:00 AM - 5:00 PM"
  }
]
```

**Ejemplo Angular**:
```typescript
// places.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Place {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  accessible: boolean;
  entryFee: number;
  openingHours: string;
}

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private apiUrl = `${environment.apiUrl}/api/places`;

  constructor(private http: HttpClient) {}

  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl);
  }
}
```

---

### 2. Obtener Lugar por ID
```http
GET /api/places/{id}
```

**Parámetros**:
- `id` (number): ID del lugar

**Respuesta**:
```json
{
  "id": 1,
  "name": "Cascadas de Agua Azul",
  "description": "Impresionantes cascadas con agua color turquesa...",
  "category": "Cascada",
  "latitude": 17.2583,
  "longitude": -92.1167,
  "elevationMeters": 180,
  "accessible": true,
  "entryFee": 45,
  "openingHours": "8:00 AM - 5:00 PM",
  "createdAt": "2025-11-26T10:00:00Z",
  "trails": [
    {
      "id": 1,
      "name": "Sendero Principal",
      "distanceKm": 1.2,
      "estimatedTimeMinutes": 30,
      "difficulty": "Fácil",
      "isLoop": false
    }
  ],
  "photos": [
    {
      "id": 1,
      "url": "https://example.com/photo.jpg",
      "description": "Vista panorámica"
    }
  ],
  "amenities": [
    { "id": 1, "name": "Baños" },
    { "id": 2, "name": "Estacionamiento" }
  ],
  "reviews": [
    {
      "id": 1,
      "author": "Juan Pérez",
      "rating": 5,
      "comment": "Hermoso lugar!",
      "createdAt": "2025-11-20T15:30:00Z"
    }
  ]
}
```

**Ejemplo Angular**:
```typescript
getPlaceById(id: number): Observable<Place> {
  return this.http.get<Place>(`${this.apiUrl}/${id}`);
}
```

---

## 🤖 Endpoints con Inteligencia Artificial (IA)

### 3. Obtener Resumen con IA ⭐
```http
GET /api/places/{id}/summary
```

**Descripción**: Genera un resumen inteligente y atractivo del lugar usando GPT-4o-mini de OpenAI.

**Parámetros**:
- `id` (number): ID del lugar

**Respuesta**:
```json
{
  "placeId": 1,
  "summary": "Las Cascadas de Agua Azul en Chiapas son un espectacular conjunto de caídas de agua color turquesa ubicado a 180 metros de elevación. Este lugar accesible ofrece senderos de dificultad fácil, incluyendo el Sendero Principal (1.2 km) y el Circuito Completo (3.5 km). El sitio cuenta con amenidades completas: baños, estacionamiento, área de picnic, guías turísticos, tienda de souvenirs, restaurante y zona de natación. Con una entrada de $45 MXN, es ideal para familias y aventureros. Los visitantes destacan su belleza natural y recomiendan visitarlo de noviembre a abril durante la época seca."
}
```

**Ejemplo Angular**:
```typescript
// Interface
export interface PlaceSummary {
  placeId: number;
  summary: string;
}

// Servicio
getPlaceSummary(id: number): Observable<PlaceSummary> {
  return this.http.get<PlaceSummary>(`${this.apiUrl}/${id}/summary`);
}
```

**Componente de ejemplo**:
```typescript
// place-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-place-detail',
  template: `
    <div class="place-detail" *ngIf="place">
      <h1>{{ place.name }}</h1>
      <p>{{ place.description }}</p>

      <!-- Resumen con IA -->
      <div class="ai-summary">
        <h3>🤖 Resumen generado con IA</h3>
        <button (click)="generateSummary()" 
                [disabled]="loadingSummary"
                class="btn btn-primary">
          {{ loadingSummary ? 'Generando...' : 'Generar Resumen con IA' }}
        </button>
        
        <div *ngIf="summary" class="summary-content">
          <p>{{ summary }}</p>
        </div>
        
        <div *ngIf="summaryError" class="alert alert-warning">
          {{ summaryError }}
        </div>
      </div>
    </div>
  `
})
export class PlaceDetailComponent implements OnInit {
  place: Place | null = null;
  summary: string = '';
  loadingSummary = false;
  summaryError: string = '';

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlace(id);
  }

  loadPlace(id: number) {
    this.placesService.getPlaceById(id).subscribe({
      next: (place) => this.place = place,
      error: (err) => console.error('Error cargando lugar:', err)
    });
  }

  generateSummary() {
    if (!this.place) return;

    this.loadingSummary = true;
    this.summaryError = '';

    this.placesService.getPlaceSummary(this.place.id).subscribe({
      next: (result) => {
        this.summary = result.summary;
        this.loadingSummary = false;
      },
      error: (err) => {
        this.summaryError = 'Error al generar resumen. Intenta nuevamente.';
        this.loadingSummary = false;
        console.error('Error:', err);
      }
    });
  }
}
```

**CSS de ejemplo**:
```css
/* place-detail.component.css */
.ai-summary {
  background: #f8f9fa;
  border-left: 4px solid #007bff;
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 0.5rem;
}

.ai-summary h3 {
  color: #007bff;
  margin-bottom: 1rem;
}

.summary-content {
  background: white;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
  line-height: 1.6;
}

.btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.alert-warning {
  background: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
}
```

---

### 4. Filtrar Lugares por Categoría
```http
GET /api/places?category={category}
```

**Parámetros**:
- `category` (string): Categoría del lugar (Cascada, Parque Nacional, Cenote, Volcán, Mirador)

**Ejemplo Angular**:
```typescript
getPlacesByCategory(category: string): Observable<Place[]> {
  return this.http.get<Place[]>(`${this.apiUrl}?category=${category}`);
}
```

---

## 🔒 Configuración de CORS

El backend ya tiene CORS configurado para aceptar peticiones de cualquier origen en desarrollo. En producción, asegúrate de que tu dominio frontend esté permitido.

**Headers incluidos en las respuestas**:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## ⚙️ Configuración en Angular

### 1. Configurar Environments

**`src/environments/environment.ts` (Desarrollo)**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'
};
```

**`src/environments/environment.prod.ts` (Producción)**:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://natureapi-production.up.railway.app'
};
```

### 2. Importar HttpClientModule

**`app.config.ts` (Angular 17+)**:
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
```

**O en `app.module.ts` (Angular 16 y anteriores)**:
```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ]
})
export class AppModule { }
```

---

## 🧪 Manejo de Errores

### Interceptor de Errores (Opcional pero Recomendado)

```typescript
// error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        errorMessage = `Error ${error.status}: ${error.message}`;
      }

      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};

// Registrar en app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([errorInterceptor]))
  ]
};
```

---

## 📊 Ejemplos de Uso Completos

### Lista de Lugares con Categorías

```typescript
// places-list.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-places-list',
  template: `
    <div class="container">
      <h1>Lugares Naturales de México</h1>

      <!-- Filtro por categoría -->
      <div class="filters">
        <button (click)="filterByCategory('')" 
                [class.active]="selectedCategory === ''">
          Todos
        </button>
        <button (click)="filterByCategory('Cascada')" 
                [class.active]="selectedCategory === 'Cascada'">
          Cascadas
        </button>
        <button (click)="filterByCategory('Parque Nacional')" 
                [class.active]="selectedCategory === 'Parque Nacional'">
          Parques
        </button>
        <button (click)="filterByCategory('Cenote')" 
                [class.active]="selectedCategory === 'Cenote'">
          Cenotes
        </button>
      </div>

      <!-- Cargando -->
      <div *ngIf="loading" class="loading">
        <p>Cargando lugares...</p>
      </div>

      <!-- Lista de lugares -->
      <div class="places-grid" *ngIf="!loading">
        <div class="place-card" *ngFor="let place of places">
          <h3>{{ place.name }}</h3>
          <p class="category">{{ place.category }}</p>
          <p class="location">📍 {{ place.latitude }}, {{ place.longitude }}</p>
          <p class="elevation">⛰️ {{ place.elevationMeters }}m</p>
          <p class="fee">💵 ${{ place.entryFee }} MXN</p>
          <p class="hours">🕐 {{ place.openingHours }}</p>
          <button (click)="viewDetails(place.id)" class="btn-details">
            Ver Detalles
          </button>
          <button (click)="generateSummary(place.id)" 
                  class="btn-ai"
                  [disabled]="loadingSummary[place.id]">
            {{ loadingSummary[place.id] ? '⏳' : '🤖' }} IA
          </button>
        </div>
      </div>

      <!-- Modal de resumen IA -->
      <div class="modal" *ngIf="showSummaryModal" (click)="closeSummary()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <span class="close" (click)="closeSummary()">&times;</span>
          <h2>🤖 Resumen generado con IA</h2>
          <p>{{ currentSummary }}</p>
        </div>
      </div>
    </div>
  `
})
export class PlacesListComponent implements OnInit {
  places: Place[] = [];
  selectedCategory = '';
  loading = false;
  loadingSummary: { [key: number]: boolean } = {};
  showSummaryModal = false;
  currentSummary = '';

  constructor(private placesService: PlacesService) {}

  ngOnInit() {
    this.loadPlaces();
  }

  loadPlaces() {
    this.loading = true;
    this.placesService.getPlaces().subscribe({
      next: (places) => {
        this.places = places;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando lugares:', err);
        this.loading = false;
      }
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.loading = true;

    if (category === '') {
      this.placesService.getPlaces().subscribe({
        next: (places) => {
          this.places = places;
          this.loading = false;
        }
      });
    } else {
      this.placesService.getPlacesByCategory(category).subscribe({
        next: (places) => {
          this.places = places;
          this.loading = false;
        }
      });
    }
  }

  viewDetails(id: number) {
    // Navegar a la página de detalles
    // this.router.navigate(['/places', id]);
  }

  generateSummary(id: number) {
    this.loadingSummary[id] = true;

    this.placesService.getPlaceSummary(id).subscribe({
      next: (result) => {
        this.currentSummary = result.summary;
        this.showSummaryModal = true;
        this.loadingSummary[id] = false;
      },
      error: (err) => {
        console.error('Error generando resumen:', err);
        this.loadingSummary[id] = false;
        alert('Error al generar resumen con IA');
      }
    });
  }

  closeSummary() {
    this.showSummaryModal = false;
    this.currentSummary = '';
  }
}
```

---

## 🎨 CSS Completo para los Componentes

```css
/* places-list.component.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filters button {
  padding: 0.5rem 1.5rem;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.filters button:hover {
  background: #007bff;
  color: white;
}

.filters button.active {
  background: #007bff;
  color: white;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #6c757d;
}

.places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.place-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.place-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.place-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.place-card .category {
  color: #007bff;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.place-card p {
  margin: 0.5rem 0;
  color: #6c757d;
}

.btn-details, .btn-ai {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 1rem;
  margin-right: 0.5rem;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-details {
  background: #28a745;
  color: white;
}

.btn-details:hover {
  background: #218838;
}

.btn-ai {
  background: #007bff;
  color: white;
}

.btn-ai:hover {
  background: #0056b3;
}

.btn-ai:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* Modal */
.modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}

.modal-content {
  background-color: white;
  margin: 5% auto;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 80%;
  max-width: 600px;
  position: relative;
  animation: slideDown 0.3s;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close {
  position: absolute;
  right: 1rem;
  top: 1rem;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  color: #6c757d;
}

.close:hover {
  color: #000;
}

.modal-content h2 {
  color: #007bff;
  margin-bottom: 1rem;
}

.modal-content p {
  line-height: 1.6;
  color: #2c3e50;
}
```

---

## ✅ Checklist de Integración

- [ ] Configurar `environment.ts` y `environment.prod.ts` con URLs correctas
- [ ] Importar `HttpClientModule` o usar `provideHttpClient()`
- [ ] Crear servicio `PlacesService` con todos los métodos
- [ ] Crear interfaces TypeScript para los modelos (Place, PlaceSummary, etc.)
- [ ] Implementar componente de lista de lugares
- [ ] Implementar componente de detalle de lugar
- [ ] Agregar botón para generar resumen con IA
- [ ] Implementar manejo de errores con interceptor
- [ ] Agregar estados de carga (spinners, skeleton screens)
- [ ] Probar en desarrollo local
- [ ] Probar con API en producción (Railway)

---

## 🚀 Despliegue Final

Una vez integrado todo:

1. **Compilar Angular**:
   ```bash
   npm run build -- --configuration production
   ```

2. **Verificar que use la URL correcta**:
   - Revisa que `environment.prod.ts` apunte a Railway
   - Confirma que el build use el environment correcto

3. **Desplegar frontend a Railway** (siguiendo `DEPLOYMENT_FRONTEND.md`)

4. **Probar la integración completa**:
   - Frontend en Railway consume Backend en Railway
   - Endpoint de IA funciona correctamente
   - CORS configurado correctamente

---

## 📞 URLs Finales del Proyecto

- **Backend API**: `https://natureapi-production.up.railway.app`
- **Frontend**: `https://tu-frontend.railway.app`
- **Swagger**: `https://natureapi-production.up.railway.app/`
- **Health Check**: `https://natureapi-production.up.railway.app/health`

---

## 🆘 Problemas Comunes

### Error de CORS
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solución**: Verifica que el backend tenga CORS habilitado (ya está configurado).

### Error 404 en producción
**Solución**: Asegúrate de que Nginx tenga `try_files $uri $uri/ /index.html;`

### Resumen con IA no se genera
**Solución**: 
- Verifica que `OPENAI_API_KEY` esté configurada en Railway
- Revisa los logs del backend en Railway

### Environment incorrecto
**Solución**: Angular usa el environment correcto según:
```bash
ng build --configuration production  # usa environment.prod.ts
ng serve                             # usa environment.ts
```

---

¡Listo para integrar! 🎉
