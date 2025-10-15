# 🌿 NatureApp - Explorador de Lugares Naturales de México

Una aplicación web moderna desarrollada con **Angular 20** que permite descubrir y explorar los lugares naturales más hermosos de México. Interfaz interactiva con mapas, navegación intuitiva y diseño responsivo para explorar parques nacionales, cascadas, cenotes, miradores y senderos.

## 🌟 Características Principales

- ✅ **Exploración interactiva** de lugares naturales con mapas de Mapbox
- ✅ **Navegación responsiva** optimizada para móviles y escritorio
- ✅ **Búsqueda y filtros avanzados** por categoría y dificultad
- ✅ **Detalles completos** de cada lugar con fotos, senderos y amenidades
- ✅ **Integración con API REST** de NatureAPI para datos en tiempo real
- ✅ **Configuración segura** de credenciales y variables de entorno
- ✅ **Arquitectura modular** con componentes reutilizables
- ✅ **Diseño moderno** con SCSS y componentes standalone
- ✅ **Carga optimizada** con lazy loading y performance mejorado

## 🏗️ Arquitectura del Frontend

### Estructura del Proyecto

```
src/
├── 📁 app/                          # Aplicación principal
│   ├── 📄 app.config.ts             # Configuración de la app
│   ├── 📄 app.routes.ts             # Rutas de navegación
│   ├── 📄 app.ts                    # Componente raíz
│   │
│   ├── 📁 core/                     # Módulo núcleo
│   │   ├── 📁 constants/            # Constantes globales
│   │   │   └── 📄 environment.ts    # Variables de ambiente
│   │   ├── 📁 models/               # Modelos TypeScript
│   │   │   ├── 📄 index.ts          # Exportaciones
│   │   │   └── 📄 place.model.ts    # Modelos de lugares
│   │   └── 📁 services/             # Servicios globales
│   │       ├── 📄 config.service.ts # Configuración segura
│   │       └── 📄 nature-api.service.ts # Cliente API
│   │
│   ├── 📁 features/                 # Características/páginas
│   │   ├── 📁 home/                 # Página principal
│   │   ├── 📁 places/               # Listado de lugares
│   │   │   └── 📁 place-detail/     # Detalle de lugar
│   │   └── 📁 trails/               # Senderos
│   │
│   └── 📁 shared/                   # Componentes compartidos
│       ├── 📁 components/           # Componentes reutilizables
│       │   ├── 📁 loading/          # Indicador de carga
│       │   ├── 📁 map/              # Componente de mapa
│       │   └── 📁 navbar/           # Barra de navegación
│       └── 📁 pipes/                # Pipes personalizados
│
├── 📁 environments/                 # Configuración por ambiente
│   ├── 📄 environment.ts           # Desarrollo
│   └── 📄 environment.prod.ts      # Producción
│
├── 📄 index.html                   # Página base HTML
├── 📄 main.ts                      # Bootstrap de la aplicación
└── 📄 styles.scss                  # Estilos globales
```

### Modelos de Datos TypeScript

#### **Place Interface**
```typescript
interface Place {
  id: number;
  name: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  accessible: boolean;
  entryFee: number;
  openingHours: string;
  createdAt?: string;
}
```

#### **PlaceDetail Interface**
```typescript
interface PlaceDetail extends Place {
  trails: Trail[];
  photos: Photo[];
  reviews: Review[];
  amenities: Amenity[];
}
```

#### **Trail Interface**
```typescript
interface Trail {
  id: number;
  placeId: number;
  name: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  difficulty: string;
  isLoop: boolean;
  path?: string;
}
```

## 🚀 Guía de Instalación y Configuración

### Prerrequisitos

- **Node.js 18+** y **npm** (o yarn/pnpm)
- **Angular CLI 20+** instalado globalmente
- **Git** para control de versiones
- **Token de Mapbox** (gratuito en [mapbox.com](https://www.mapbox.com/))

### Instalación Paso a Paso

#### 1. **Clonar el Repositorio**
```bash
git clone <url-del-repositorio>
cd NatureApp
```

#### 2. **Instalar Dependencias**
```bash
npm install
# o si prefieres yarn
yarn install
```

#### 3. **Configurar Variables de Entorno**

**Opción A: Archivo .env.local (Recomendado)**
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local
```

Editar `.env.local` con tus valores reales:
```bash
# URL de la API backend
API_URL=http://localhost:5000/api

# Token de Mapbox para mapas
MAPBOX_TOKEN=pk.eyJ1IjoianVhbmZyOTciLCJhIjoiY2x4cnhqZGZpMWUzdTJrb2Qxd2k5Z3huYSJ9.Kp99lB1snn3xzzi26jKy4w

# Ambiente de ejecución
NODE_ENV=development
```

**Opción B: Archivo de configuración JSON**
```bash
# Copiar archivo de configuración
cp public/assets/config.example.json public/assets/config.json
```

Editar `public/assets/config.json`:
```json
{
  "apiUrl": "http://localhost:5000/api",
  "mapboxToken": "tu_token_de_mapbox_aqui",
  "production": false
}
```

#### 4. **Obtener Token de Mapbox**

1. Ve a [Mapbox](https://www.mapbox.com/) y crea una cuenta gratuita
2. Accede a tu [Panel de Control](https://account.mapbox.com/)
3. Copia tu **Token de Acceso Público**
4. Pégalo en tu archivo `.env.local` o `config.json`

#### 5. **Ejecutar la Aplicación**
```bash
# Servidor de desarrollo
npm start
# o
ng serve

# La aplicación estará disponible en:
# http://localhost:4200
```

## 🛠️ Stack Tecnológico

### Frontend Framework
- **Angular 20** - Framework principal con las últimas características
- **TypeScript 5.8** - Lenguaje de programación tipado
- **RxJS 7.8** - Programación reactiva y manejo de observables

### UI y Estilos
- **SCSS** - Preprocesador CSS avanzado
- **Componentes Standalone** - Arquitectura moderna de Angular
- **Responsive Design** - Adaptable a todos los dispositivos

### Mapas y Geolocalización
- **Mapbox GL JS 3.15** - Mapas interactivos y visualización geográfica
- **@types/mapbox-gl** - Tipos TypeScript para Mapbox

### Herramientas de Desarrollo
- **Angular CLI 20** - Herramientas de línea de comandos
- **Angular DevKit** - Herramientas de construcción y desarrollo
- **Jasmine & Karma** - Testing framework

### Servicios y API
- **HttpClient** - Cliente HTTP de Angular para comunicación con API
- **ConfigService** - Servicio personalizado para manejo de configuración
- **NatureApiService** - Cliente para la API de lugares naturales

## 📱 Funcionalidades de la Aplicación

### 🏠 **Página Principal (Home)**
- Dashboard con lugares destacados
- Estadísticas generales
- Enlaces rápidos a secciones populares
- Mapa interactivo con vista general

### 🏞️ **Exploración de Lugares (Places)**
- **Listado completo** de todos los lugares naturales
- **Filtros avanzados** por:
  - Categoría (Cascada, Parque Nacional, Mirador, Cenote, Volcán)
  - Dificultad de senderos (Fácil, Moderado, Difícil, Extremo)
  - Accesibilidad
  - Costo de entrada
- **Búsqueda por texto** en nombres y descripciones
- **Vista de tarjetas** con información resumida
- **Vista de lista** para navegación rápida

### 🔍 **Detalle de Lugar (Place Detail)**
- **Información completa** del lugar seleccionado
- **Mapa interactivo** con ubicación exacta
- **Galería de fotos** con descripciones
- **Lista de senderos** disponibles con:
  - Distancia y tiempo estimado
  - Nivel de dificultad
  - Tipo de ruta (circular o lineal)
- **Amenidades disponibles** (baños, estacionamiento, restaurantes, etc.)
- **Reseñas de visitantes** con calificaciones
- **Información práctica**:
  - Horarios de apertura
  - Costo de entrada
  - Accesibilidad
  - Elevación sobre el nivel del mar

### 🥾 **Senderos (Trails)**
- **Catálogo de senderos** organizados por dificultad
- **Filtros por características**:
  - Longitud del sendero
  - Tiempo estimado
  - Tipo de terreno
  - Senderos circulares vs. lineales
- **Mapas de rutas** con trazado del camino
- **Perfil de elevación** para senderos de montaña

### 🗺️ **Componente de Mapa Interactivo**
- **Mapbox GL JS** para renderizado fluido
- **Marcadores personalizados** para cada tipo de lugar
- **Clusters** para agrupar lugares cercanos
- **Controles de navegación** (zoom, rotación, inclinación)
- **Popup informativo** al hacer clic en marcadores
- **Capas temáticas** (topográfica, satelital, terreno)

## 🔧 Scripts de Desarrollo

### Comandos Principales
```bash
# Iniciar servidor de desarrollo
npm start                    # ng serve
ng serve --open             # Abrir automáticamente en navegador
ng serve --port 4300        # Cambiar puerto por defecto

# Construir aplicación
npm run build               # ng build
ng build --configuration production  # Build optimizado para producción

# Testing
npm test                    # ng test (Karma + Jasmine)
ng test --watch=false       # Ejecutar tests una vez
ng test --code-coverage     # Generar reporte de cobertura

# Linting y formateo
ng lint                     # Verificar código
npm run format              # Formatear código (si está configurado)

# Generar componentes
ng generate component features/example
ng generate service core/services/example
ng generate interface core/models/example
```

### Comandos de Angular CLI
```bash
# Scaffolding de código
ng generate component shared/components/card
ng generate service core/services/places
ng generate interface core/models/trail
ng generate pipe shared/pipes/distance
ng generate directive shared/directives/highlight

# Análisis y optimización
ng build --stats-json        # Generar estadísticas de bundle
ng build --source-map       # Incluir source maps
ng analyze                  # Analizar tamaño del bundle (requiere webpack-bundle-analyzer)
```

## 🔒 Configuración de Seguridad

### Manejo Seguro de Credenciales

La aplicación implementa un sistema robusto para manejar credenciales sin exponerlas en el código fuente:

#### **ConfigService - Gestión Centralizada**
```typescript
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config = {
    apiUrl: this.getEnvVariable('API_URL', 'http://localhost:5000/api'),
    mapboxToken: this.getEnvVariable('MAPBOX_TOKEN', ''),
    production: this.getEnvVariable('NODE_ENV', 'development') === 'production'
  };

  get apiUrl(): string { return this.config.apiUrl; }
  get mapboxToken(): string { return this.config.mapboxToken; }
  get isProduction(): boolean { return this.config.production; }
}
```

#### **Uso en Componentes**
```typescript
import { ConfigService } from '@app/core/services/config.service';

@Component({...})
export class MapComponent {
  constructor(private configService: ConfigService) {}
  
  ngOnInit() {
    const mapboxToken = this.configService.mapboxToken;
    // Usar token de forma segura
  }
}
```

### Archivos Excluidos del Repositorio
Los siguientes archivos contienen credenciales y están en `.gitignore`:
- `.env.local`
- `.env.production`
- `public/assets/config.json`
- `environment.prod.ts` (con valores reales)

### Archivos de Ejemplo Incluidos
- `.env.example` - Plantilla para variables de entorno
- `public/assets/config.example.json` - Plantilla para configuración
- `SECURITY.md` - Guía completa de seguridad

## 🌐 Integración con API

### NatureApiService - Cliente HTTP

```typescript
@Injectable({ providedIn: 'root' })
export class NatureApiService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  // Obtener todos los lugares con filtros opcionales
  getPlaces(filters?: PlaceFilters): Observable<Place[]> {
    const params = new HttpParams({ fromObject: filters || {} });
    return this.http.get<Place[]>(`${this.configService.apiUrl}/places`, { params });
  }

  // Obtener detalle completo de un lugar
  getPlaceById(id: number): Observable<PlaceDetail> {
    return this.http.get<PlaceDetail>(`${this.configService.apiUrl}/places/${id}`);
  }

  // Crear nuevo lugar
  createPlace(place: CreatePlaceDto): Observable<Place> {
    return this.http.post<Place>(`${this.configService.apiUrl}/places`, place);
  }
}
```

### Tipos de Filtros Disponibles
```typescript
interface PlaceFilters {
  category?: string;      // 'Cascada', 'Parque Nacional', etc.
  difficulty?: string;    // 'Fácil', 'Moderado', 'Difícil', 'Extremo'
  accessible?: boolean;   // Solo lugares accesibles
  maxEntryFee?: number;   // Costo máximo de entrada
}
```

### Manejo de Errores
```typescript
// Interceptor para manejo global de errores
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejo centralizado de errores HTTP
        console.error('Error en API:', error);
        return throwError(() => error);
      })
    );
  }
}
```

## 🎨 Guía de Estilos y Componentes

### Sistema de Colores
```scss
// Paleta principal inspirada en la naturaleza
:root {
  --primary-green: #2d5f3e;      // Verde bosque
  --secondary-green: #4a7c59;    // Verde claro
  --accent-blue: #3498db;        // Azul agua
  --background-light: #f8f9fa;   // Fondo claro
  --text-dark: #2c3e50;          // Texto principal
  --warning-orange: #e67e22;     // Advertencias
  --success-green: #27ae60;      // Éxito
}
```

### Componentes Reutilizables

#### **LoadingComponent**
```typescript
@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container { /* estilos */ }
    .spinner { /* animación */ }
  `]
})
export class LoadingComponent {
  @Input() message = 'Cargando...';
}
```

#### **NavbarComponent**
```typescript
@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <a routerLink="/" class="logo">🌿 NatureApp</a>
      <div class="nav-links">
        <a routerLink="/home" routerLinkActive="active">Inicio</a>
        <a routerLink="/places" routerLinkActive="active">Lugares</a>
        <a routerLink="/trails" routerLinkActive="active">Senderos</a>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
```

### Responsive Design
```scss
// Breakpoints para diseño responsivo
$mobile: 768px;
$tablet: 1024px;
$desktop: 1200px;

@media (max-width: $mobile) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }
  
  .place-card {
    width: 100%;
    margin: 0.5rem 0;
  }
}
```

## 📊 Rendimiento y Optimización

### Estrategias Implementadas

#### **Lazy Loading de Rutas**
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'places', 
    loadComponent: () => import('./features/places/places.component')
      .then(m => m.PlacesComponent)
  },
  {
    path: 'places/:id',
    loadComponent: () => import('./features/places/place-detail/place-detail.component')
      .then(m => m.PlaceDetailComponent)
  }
];
```

#### **OnPush Change Detection**
```typescript
@Component({
  selector: 'app-place-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class PlaceCardComponent {
  @Input() place!: Place;
}
```

#### **TrackBy Functions**
```typescript
trackByPlaceId(index: number, place: Place): number {
  return place.id;
}
```

#### **Optimización de Imágenes**
```html
<img 
  [src]="photo.url" 
  [alt]="photo.description"
  loading="lazy"
  decoding="async">
```

### Bundle Optimization
```json
{
  "build": {
    "configurations": {
      "production": {
        "budgets": [
          {
            "type": "initial",
            "maximumWarning": "500kB",
            "maximumError": "1MB"
          },
          {
            "type": "anyComponentStyle",
            "maximumWarning": "8kB",
            "maximumError": "12kB"
          }
        ],
        "outputHashing": "all",
        "optimization": true,
        "sourceMap": false,
        "namedChunks": false,
        "extractLicenses": true,
        "vendorChunk": false,
        "buildOptimizer": true
      }
    }
  }
}
```

## 🧪 Testing

### Configuración de Tests
```typescript
// Configuración para TestBed
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [
      { provide: ConfigService, useValue: mockConfigService },
      NatureApiService
    ]
  }).compileComponents();
});
```

### Test de Componentes
```typescript
describe('PlacesComponent', () => {
  let component: PlacesComponent;
  let fixture: ComponentFixture<PlacesComponent>;
  let apiService: jasmine.SpyObj<NatureApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NatureApiService', ['getPlaces']);
    // configuración del test
  });

  it('should load places on init', () => {
    apiService.getPlaces.and.returnValue(of(mockPlaces));
    component.ngOnInit();
    expect(component.places()).toEqual(mockPlaces);
  });
});
```

### Test de Servicios
```typescript
describe('NatureApiService', () => {
  let service: NatureApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NatureApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch places', () => {
    const mockPlaces = [{ id: 1, name: 'Test Place' }];
    
    service.getPlaces().subscribe(places => {
      expect(places).toEqual(mockPlaces);
    });

    const req = httpMock.expectOne('/api/places');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlaces);
  });
});
```

## 🚀 Deployment

### Build para Producción
```bash
# Build optimizado
ng build --configuration production

# Verificar archivos generados
ls -la dist/NatureApp/

# Los archivos principales serán:
# - index.html (punto de entrada)
# - main.[hash].js (aplicación principal)
# - polyfills.[hash].js (polyfills)
# - styles.[hash].css (estilos)
```

### Variables de Entorno para Producción
```json
// public/assets/config.json (producción)
{
  "apiUrl": "https://api.tudominio.com/api",
  "mapboxToken": "tu_token_de_produccion",
  "production": true
}
```

### Configuración del Servidor
```nginx
# Configuración Nginx para SPA
server {
  listen 80;
  server_name tudominio.com;
  root /var/www/nature-app;
  index index.html;

  # Rutear todas las peticiones a index.html para SPA
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache para assets estáticos
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### Docker para Producción
```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=builder /app/dist/NatureApp /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Guía de Contribución

### Estándares de Desarrollo
- **Naming Conventions**: PascalCase para componentes, camelCase para métodos
- **File Structure**: Un componente por archivo, máximo 300 líneas
- **TypeScript**: Tipado estricto, interfaces para todos los datos
- **SCSS**: Variables CSS, mixins reutilizables, naming BEM

### Proceso de Contribución
1. **Fork** del repositorio en GitHub
2. **Crear rama** para nueva funcionalidad: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollo** siguiendo los estándares del proyecto
4. **Testing** completo de la funcionalidad
5. **Commit** con mensajes descriptivos: `git commit -m 'feat: agregar filtro por accesibilidad'`
6. **Push** a tu fork: `git push origin feature/nueva-funcionalidad`
7. **Pull Request** con descripción detallada

### Convenciones de Commit
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Cambios de formato/estilo
- `refactor:` - Refactorización de código
- `test:` - Agregrar o modificar tests
- `chore:` - Tareas de mantenimiento

## 📖 Documentación Adicional

### Enlaces Útiles
- **[Angular Official Docs](https://angular.dev/)** - Documentación oficial de Angular
- **[Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/api/)** - API de Mapbox
- **[RxJS Operators](https://rxjs.dev/guide/operators)** - Guía de operadores RxJS
- **[Angular Style Guide](https://angular.dev/style-guide)** - Guía de estilos oficial

### Recursos de Aprendizaje
- **[Angular University](https://angular-university.io/)** - Cursos avanzados de Angular
- **[Angular Blog](https://blog.angular.io/)** - Noticias y actualizaciones
- **[Mapbox Examples](https://docs.mapbox.com/mapbox-gl-js/examples/)** - Ejemplos de Mapbox

### API Backend
Consulta el archivo `API_DOCUMENT.md` para documentación completa del backend NatureAPI.

## 🔍 Solución de Problemas

### Errores Comunes

#### **Error: "Cannot read property of undefined"**
```typescript
// Usar optional chaining y nullish coalescing
const placeName = place?.name ?? 'Sin nombre';
const photoCount = place?.photos?.length ?? 0;
```

#### **Error: "Mapbox token not found"**
```typescript
// Verificar configuración en ConfigService
ngOnInit() {
  const token = this.configService.mapboxToken;
  if (!token) {
    console.error('Token de Mapbox no configurado');
    return;
  }
  // Inicializar mapa
}
```

#### **Error de CORS en desarrollo**
```typescript
// Configurar proxy para desarrollo
// angular.json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}

// proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:5000",
    "secure": true,
    "changeOrigin": true
  }
}
```

### Performance Issues
```typescript
// Usar OnPush para optimizar change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Implementar trackBy functions
trackByFn(index: number, item: any) {
  return item.id;
}

// Lazy loading de imágenes
<img loading="lazy" [src]="imageUrl">
```

## 👨‍💻 Autoría

### Autor Principal
**José de Jesús Almanza Contreras**
- 🎓 Desarrollador Frontend especializado en Angular
- 💻 Experto en aplicaciones web modernas y responsive
- 🌐 Enfoque en UX/UI y optimización de rendimiento



**© 2025 José de Jesús Almanza Contreras. Todos los derechos reservados.**
