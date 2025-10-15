# NatureAPI - API REST de Lugares Naturales de México 🌿

Una API REST robusta desarrollada en .NET 9 que gestiona lugares naturales de México (parques nacionales, cascadas, miradores, senderos) con coordenadas geográficas precisas, metadatos completos y relaciones complejas entre entidades.

## 🌟 Características Principales

- ✅ **Gestión completa de lugares naturales** con coordenadas GPS y metadatos detallados
- ✅ **Base de datos SQL Server** ejecutándose en contenedores Docker
- ✅ **Migraciones Entity Framework Core** con datos iniciales precargados
- ✅ **Validaciones robustas** implementadas con FluentValidation
- ✅ **Documentación automática interactiva** con Swagger/OpenAPI 3.0
- ✅ **Mapeo automático de objetos** con AutoMapper
- ✅ **Filtros avanzados** por categoría y dificultad de senderos
- ✅ **Arquitectura limpia** con separación de responsabilidades
- ✅ **Manejo de errores centralizado** con logging
- ✅ **Patrones de diseño** Repository y Service
- ✅ **Configuración modular** de Entity Framework

## 🏗️ Arquitectura del Proyecto

### Entidades del Dominio

El proyecto implementa las siguientes entidades con sus respectivas relaciones:

#### **Place** - Lugar Natural Principal
```csharp
{
  "id": 1,
  "name": "Cascadas de Agua Azul",
  "description": "Impresionantes cascadas de agua turquesa...",
  "category": "Cascada",
  "latitude": 17.2583,
  "longitude": -92.1167,
  "elevationMeters": 180,
  "accessible": true,
  "entryFee": 45.0,
  "openingHours": "8:00 AM - 5:00 PM",
  "createdAt": "2025-09-10T10:30:00Z"
}
```

#### **Trail** - Senderos y Rutas
```csharp
{
  "id": 1,
  "placeId": 1,
  "name": "Sendero Principal a las Cascadas",
  "distanceKm": 1.2,
  "estimatedTimeMinutes": 45,
  "difficulty": "Fácil",
  "path": "17.2583,-92.1167;17.2585,-92.1165",
  "isLoop": false
}
```

#### **Photo** - Galería de Imágenes
```csharp
{
  "id": 1,
  "placeId": 1,
  "url": "https://upload.wikimedia.org/...",
  "description": "Vista panorámica de las cascadas"
}
```

#### **Review** - Reseñas de Visitantes
```csharp
{
  "id": 1,
  "placeId": 1,
  "author": "Juan Pérez",
  "rating": 5,
  "comment": "Lugar espectacular, altamente recomendado",
  "createdAt": "2025-09-10T15:45:00Z"
}
```

#### **Amenity** - Servicios y Amenidades
```csharp
{
  "id": 1,
  "name": "Baños"
}
```

#### **PlaceAmenity** - Tabla Puente (Many-to-Many)
Implementa la relación N-N entre lugares y amenidades con clave primaria compuesta.

### Diagrama de Relaciones

```
Place (1) ←→ (N) Trail
  ↓
Place (1) ←→ (N) Photo
  ↓
Place (1) ←→ (N) Review
  ↓
Place (N) ←→ (N) Amenity (via PlaceAmenity)
```

## 🚀 Guía de Instalación Completa

### Prerrequisitos del Sistema

- **.NET 9 SDK** (versión 9.0.0 o superior)
- **Docker Desktop** (para SQL Server)
- **Git** (para clonar el repositorio)
- **Visual Studio 2022** / **Visual Studio Code** / **JetBrains Rider** (recomendado)

### Pasos de Instalación Detallados

#### 1. **Preparación del Entorno**
```bash
# Verificar instalación de .NET 9
dotnet --version

# Verificar Docker
docker --version
docker-compose --version
```

#### 2. **Clonar y Configurar el Proyecto**
```bash
# Clonar el repositorio
git clone <url-repositorio>
cd NatureAPI

# Verificar estructura del proyecto
ls -la
```

#### 3. **Configurar Base de Datos con Docker**
```bash
# Levantar SQL Server con Docker Compose
docker-compose up -d

# Verificar que el contenedor esté ejecutándose
docker ps

# Ver logs del contenedor (opcional)
docker-compose logs sqlserver
```

#### 4. **Configurar Cadena de Conexión**
Editar el archivo `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=NatureDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;MultipleActiveResultSets=true;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

#### 5. **Restaurar Dependencias y Migrar**
```bash
# Restaurar paquetes NuGet
dotnet restore

# Aplicar migraciones a la base de datos
cd NatureAPI
dotnet ef database update

# Verificar que las tablas se crearon correctamente
# Las tablas incluyen: Places, Trails, Photos, Reviews, Amenities, PlaceAmenities
```

#### 6. **Ejecutar la Aplicación**
```bash
# Ejecutar en modo desarrollo
dotnet run

# La aplicación estará disponible en:
# HTTPS: https://localhost:7001
# HTTP: http://localhost:5001
# Swagger UI: https://localhost:7001/swagger
```

## 📊 Datos de Demostración Precargados

El sistema incluye un **DataSeeder** completo que carga automáticamente:

### 🏞️ **5 Lugares Naturales Emblemáticos de México**

1. **Cascadas de Agua Azul** (Chiapas)
   - Categoría: Cascada
   - Coordenadas: 17.2583°N, 92.1167°W
   - Elevación: 180m
   - Accesible: Sí
   - Costo: $45 MXN

2. **Parque Nacional Desierto de los Leones** (CDMX)
   - Categoría: Parque Nacional
   - Coordenadas: 19.3069°N, 99.3128°W
   - Elevación: 3,200m
   - Accesible: No
   - Costo: Gratuito

3. **Hierve el Agua** (Oaxaca)
   - Categoría: Mirador
   - Coordenadas: 16.8667°N, 96.2833°W
   - Elevación: 1,800m
   - Accesible: No
   - Costo: $35 MXN

4. **Cenote Dos Ojos** (Quintana Roo)
   - Categoría: Cenote
   - Coordenadas: 20.2239°N, 87.3539°W
   - Elevación: 5m
   - Accesible: Sí
   - Costo: $350 MXN

5. **Nevado de Toluca** (Estado de México)
   - Categoría: Volcán
   - Coordenadas: 19.1089°N, 99.7581°W
   - Elevación: 4,680m
   - Accesible: No
   - Costo: $60 MXN

### 🥾 **Senderos con Diferentes Dificultades**
- **Fácil**: Senderos de acceso y miradores
- **Moderado**: Circuitos naturales y rutas interpretativas
- **Difícil**: Senderos de montaña con mayor exigencia física
- **Extremo**: Ascensos volcánicos y rutas de alta montaña

### 🏪 **12 Tipos de Amenidades**
Baños • Estacionamiento • Mirador • Área de picnic • Senderos marcados • Guías turísticos • Tienda de souvenirs • Restaurante • Acceso para discapacitados • Camping • Puente colgante • Zona de natación

### 📸 **Fotografías con URLs Reales**
Cada lugar incluye 2 fotografías con URLs válidas de Wikimedia Commons y descripciones detalladas.

## 🌐 Documentación Completa de la API

### **Endpoint: GET /api/places**
Obtiene la lista completa de lugares naturales con filtros opcionales.

#### Parámetros de Consulta
| Parámetro | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `category` | string | No | Filtrar por categoría (Cascada, Parque Nacional, Mirador, Cenote, Volcán) |
| `difficulty` | string | No | Filtrar por dificultad de senderos (Fácil, Moderado, Difícil, Extremo) |

#### Ejemplos de Uso
```bash
# Obtener todos los lugares
curl -X GET "https://localhost:7001/api/places" -H "accept: application/json"

# Filtrar por categoría
curl -X GET "https://localhost:7001/api/places?category=Cascada" -H "accept: application/json"

# Filtrar por dificultad
curl -X GET "https://localhost:7001/api/places?difficulty=Fácil" -H "accept: application/json"

# Filtros combinados
curl -X GET "https://localhost:7001/api/places?category=Parque Nacional&difficulty=Moderado" -H "accept: application/json"
```

#### Respuesta de Ejemplo
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
    "entryFee": 45.0,
    "openingHours": "8:00 AM - 5:00 PM"
  }
]
```

### **Endpoint: GET /api/places/{id}**
Obtiene el detalle completo de un lugar específico incluyendo todas las entidades relacionadas.

#### Parámetros de Ruta
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | int | ID único del lugar natural |

#### Ejemplo de Uso
```bash
curl -X GET "https://localhost:7001/api/places/1" -H "accept: application/json"
```

#### Respuesta Completa de Ejemplo
```json
{
  "id": 1,
  "name": "Cascadas de Agua Azul",
  "description": "Impresionantes cascadas de agua turquesa ubicadas en Chiapas...",
  "category": "Cascada",
  "latitude": 17.2583,
  "longitude": -92.1167,
  "elevationMeters": 180,
  "accessible": true,
  "entryFee": 45.0,
  "openingHours": "8:00 AM - 5:00 PM",
  "createdAt": "2025-09-10T10:30:00Z",
  "trails": [
    {
      "id": 1,
      "name": "Sendero Principal a las Cascadas",
      "distanceKm": 1.2,
      "estimatedTimeMinutes": 45,
      "difficulty": "Fácil",
      "isLoop": false
    }
  ],
  "photos": [
    {
      "id": 1,
      "url": "https://upload.wikimedia.org/wikipedia/commons/...",
      "description": "Vista panorámica de las cascadas de agua turquesa"
    }
  ],
  "reviews": [],
  "amenities": [
    { "id": 1, "name": "Baños" },
    { "id": 2, "name": "Estacionamiento" },
    { "id": 4, "name": "Área de picnic" }
  ]
}
```

### **Endpoint: POST /api/places**
Crea un nuevo lugar natural con validaciones exhaustivas.

#### Cuerpo de la Petición
```json
{
  "name": "Nuevo Lugar Natural",
  "description": "Descripción detallada del lugar con al menos 20 caracteres",
  "category": "Cascada",
  "latitude": 19.4326,
  "longitude": -99.1332,
  "elevationMeters": 2240,
  "accessible": true,
  "entryFee": 50.0,
  "openingHours": "9:00 AM - 6:00 PM"
}
```

#### Validaciones Implementadas
- **Nombre**: Requerido, máximo 200 caracteres
- **Descripción**: Requerida, mínimo 20 caracteres, máximo 1000
- **Categoría**: Requerida, máximo 50 caracteres
- **Latitud**: Entre -90 y 90 grados
- **Longitud**: Entre -180 y 180 grados
- **Elevación**: Número entero positivo
- **Costo de entrada**: Número decimal no negativo

#### Ejemplo de Uso
```bash
curl -X POST "https://localhost:7001/api/places" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cenote Zacil-Ha",
    "description": "Hermoso cenote de aguas cristalinas perfecto para nadar y snorkel en la Riviera Maya",
    "category": "Cenote",
    "latitude": 20.2100,
    "longitude": -87.4600,
    "elevationMeters": 3,
    "accessible": true,
    "entryFee": 200.0,
    "openingHours": "8:00 AM - 5:00 PM"
  }'
```

## 🛠️ Stack Tecnológico Completo

### Backend Framework
- **.NET 9** - Framework principal con las últimas características
- **ASP.NET Core 9** - Framework web con rendimiento optimizado

### Base de Datos y ORM
- **SQL Server 2022** - Sistema de gestión de base de datos
- **Entity Framework Core 9.0** - ORM con Code First approach
- **Entity Framework Tools** - Herramientas de migración y scaffolding

### Librerías y Herramientas
- **AutoMapper 13.0** - Mapeo automático entre DTOs y entidades
- **FluentValidation 11.3** - Validaciones fluidas y expresivas
- **Swashbuckle.AspNetCore 6.5** - Generación de documentación OpenAPI/Swagger

### Infraestructura
- **Docker & Docker Compose** - Contenedorización de servicios
- **SQL Server en Docker** - Base de datos containerizada para desarrollo

### Patrones de Diseño Implementados
- **Repository Pattern** - Abstracción de acceso a datos
- **Service Pattern** - Lógica de negocio encapsulada
- **Dependency Injection** - Inversión de control nativa de .NET
- **DTO Pattern** - Transferencia de datos optimizada
- **Configuration Pattern** - Configuración modular de EF Core

## 📁 Estructura Detallada del Proyecto

```
NatureAPI/
├── 📄 README.md                     # Documentación del proyecto
├── 📄 docker-compose.yml            # Configuración de contenedores
├── 📄 NatureAPI.sln                 # Solución de Visual Studio
│
├── 📂 NatureAPI/                    # Proyecto principal de la API
│   ├── 📄 Program.cs                # Punto de entrada y configuración
│   ├── 📄 appsettings.json          # Configuración de la aplicación
│   ├── 📄 NatureAPI.csproj          # Archivo de proyecto .NET
│   │
│   ├── 📂 Controllers/              # Controladores REST
│   │   └── 📄 PlacesController.cs   # API endpoints para lugares
│   │
│   ├── 📂 Data/                     # Capa de acceso a datos
│   │   ├── 📄 NatureDbContext.cs    # Contexto de Entity Framework
│   │   │
│   │   ├── 📂 Configurations/       # Configuraciones de EF Core
│   │   │   ├── 📄 PlaceConfiguration.cs
│   │   │   ├── 📄 EntityConfigurations.cs
│   │   │   └── 📄 RelationshipConfigurations.cs
│   │   │
│   │   └── 📂 Seeds/               # Datos iniciales
│   │       └── 📄 DataSeeder.cs    # Seeder principal
│   │
│   ├── 📂 Services/                # Capa de lógica de negocio
│   │   ├── 📂 Interfaces/          # Contratos de servicios
│   │   │   └── 📄 IPlaceService.cs
│   │   │
│   │   └── 📂 Implementations/     # Implementaciones concretas
│   │       └── 📄 PlaceService.cs
│   │
│   ├── 📂 Mappings/                # Perfiles de AutoMapper
│   │   └── 📄 MappingProfile.cs    # Configuración de mapeos
│   │
│   ├── 📂 Validators/              # Validadores FluentValidation
│   │   └── 📄 CreatePlaceDtoValidator.cs
│   │
│   ├── 📂 Extensions/              # Métodos de extensión
│   │   └── 📄 ServiceExtensions.cs # Configuración de servicios
│   │
│   └── 📂 Migrations/              # Migraciones de EF Core
│       ├── 📄 20250910_InitialCreate.cs
│       ├── 📄 20250910_InitialCreate.Designer.cs
│       └── 📄 NatureDbContextModelSnapshot.cs
│
└── 📂 NatureAPI.Models/            # Modelos y DTOs
    ├── 📄 NatureAPI.Models.csproj  # Proyecto de modelos
    │
    ├── 📂 Entities/                # Entidades del dominio
    │   ├── 📄 Place.cs             # Entidad principal
    │   ├── 📄 Trail.cs             # Senderos
    │   ├── 📄 Photo.cs             # Fotografías
    │   ├── 📄 Review.cs            # Reseñas
    │   ├── 📄 Amenity.cs           # Amenidades
    │   └── 📄 PlaceAmenity.cs      # Tabla puente
    │
    └── 📂 DTOs/                    # Data Transfer Objects
        ├── 📄 PlaceDto.cs          # DTOs de lugares
        └── 📄 SupportingDto.cs     # DTOs de apoyo
```

## 🔧 Configuración Avanzada

### Variables de Entorno para Docker
Crear archivo `.env` para personalizar la configuración:
```env
# Base de datos
SA_PASSWORD=YourStrong@Passw0rd
DB_NAME=NatureDB
DB_PORT=1433

# API
ASPNETCORE_ENVIRONMENT=Development
API_PORT_HTTPS=7001
API_PORT_HTTP=5001
```

### Configuración de Logging
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.EntityFrameworkCore": "Information"
      }
    },
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "logs/nature-api-.txt",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 7
        }
      }
    ]
  }
}
```

### Configuración de CORS para Producción
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://yourdomain.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## 🧪 Validaciones y Reglas de Negocio

### Validaciones de Coordenadas Geográficas
- **Latitud**: Rango válido de -90° a +90°
- **Longitud**: Rango válido de -180° a +180°
- **Precisión**: 6 decimales para coordenadas GPS precisas

### Validaciones de Campos
```csharp
public class CreatePlaceDtoValidator : AbstractValidator<CreatePlaceDto>
{
    public CreatePlaceDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es requerido")
            .Length(3, 200).WithMessage("El nombre debe tener entre 3 y 200 caracteres");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("La descripción es requerida")
            .Length(20, 1000).WithMessage("La descripción debe tener entre 20 y 1000 caracteres");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("La latitud debe estar entre -90 y 90 grados");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("La longitud debe estar entre -180 y 180 grados");

        RuleFor(x => x.EntryFee)
            .GreaterThanOrEqualTo(0).WithMessage("El costo de entrada no puede ser negativo");
    }
}
```

## 📖 Documentación Interactiva

### Swagger UI
Accede a la documentación interactiva completa en:
- **URL**: `https://localhost:7001/swagger`
- **Características**:
  - Exploración de todos los endpoints
  - Pruebas en tiempo real desde el navegador
  - Ejemplos de requests y responses
  - Esquemas de validación detallados
  - Códigos de estado HTTP explicados

### OpenAPI Specification
- **JSON**: `https://localhost:7001/swagger/v1/swagger.json`
- **Compatible** con herramientas como Postman, Insomnia, y generadores de clientes

## 🚀 Comandos Útiles para Desarrollo

### Entity Framework Commands
```bash
# Crear nueva migración
dotnet ef migrations add NombreMigracion

# Aplicar migraciones
dotnet ef database update

# Revertir migración
dotnet ef database update PreviousMigrationName

# Generar script SQL
dotnet ef migrations script

# Eliminar última migración
dotnet ef migrations remove
```

### Docker Commands
```bash
# Levantar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Limpiar volúmenes
docker-compose down -v

# Reconstruir imágenes
docker-compose up --build
```

### Desarrollo y Testing
```bash
# Ejecutar en modo watch (auto-reload)
dotnet watch run

# Ejecutar tests (si existen)
dotnet test

# Verificar formato de código
dotnet format

# Restaurar paquetes
dotnet restore --force
```

## 🔍 Solución de Problemas Comunes

### Error: "Cannot connect to SQL Server"
```bash
# Verificar que Docker esté ejecutándose
docker ps

# Verificar logs del contenedor
docker-compose logs sqlserver

# Reiniciar contenedor
docker-compose restart sqlserver
```

### Error: "Identity column cannot be inserted"
Este error se resuelve automáticamente con el DataSeeder actualizado que no asigna IDs explícitos.

### Error: "Migration already applied"
```bash
# Ver migraciones aplicadas
dotnet ef migrations list

# Revertir y volver a aplicar
dotnet ef database update 0
dotnet ef database update
```

## 🤝 Guía de Contribución

### Proceso de Desarrollo
1. **Fork** del repositorio
2. **Crear rama** para la nueva característica: `git checkout -b feature/nueva-caracteristica`
3. **Desarrollo** siguiendo las convenciones del proyecto
4. **Commit** con mensajes descriptivos: `git commit -m 'Agregar validación de coordenadas'`
5. **Push** a la rama: `git push origin feature/nueva-caracteristica`
6. **Pull Request** con descripción detallada

### Estándares de Código
- **Naming Conventions**: Pascal Case para clases, Camel Case para métodos
- **Documentación**: XML comments para APIs públicas
- **Validaciones**: Usar FluentValidation para reglas de negocio
- **Logging**: Implementar logging structured con niveles apropiados

### Testing Guidelines
- Unit tests para servicios y validadores
- Integration tests para endpoints
- Cobertura mínima del 80%

## 📡 Guía para Frontend: Endpoints REST y Consumo

### Endpoints Disponibles

#### 1. Listar todos los lugares
- **GET /api/places**
- **Parámetros opcionales:**
  - `category` (string): Filtra por categoría (ej. "Cascada", "Parque", "Mirador")
  - `difficulty` (string): Filtra por dificultad de senderos (ej. "Fácil", "Moderado", "Difícil")
- **Ejemplo:**
```http
GET /api/places?category=Cascada&difficulty=Fácil
```
- **Response:**
```json
[
  {
    "id": 1,
    "name": "Cascadas de Agua Azul",
    "category": "Cascada",
    ...
  },
  ...
]
```

#### 2. Detalle de un lugar por Id
- **GET /api/places/{id}**
- **Ejemplo:**
```http
GET /api/places/1
```
- **Response:**
```json
{
  "id": 1,
  "name": "Cascadas de Agua Azul",
  "description": "...",
  "trails": [ ... ],
  "photos": [ ... ],
  "reviews": [ ... ],
  "amenities": [ ... ]
}
```

#### 3. Crear un nuevo lugar
- **POST /api/places**
- **Body:**
```json
{
  "name": "Nuevo Parque",
  "description": "...",
  "category": "Parque",
  "latitude": 19.4326,
  "longitude": -99.1332,
  "elevationMeters": 2200,
  "accessible": true,
  "entryFee": 0,
  "openingHours": "6:00 AM - 8:00 PM"
}
```
- **Validaciones:**
  - Latitud debe estar entre -90 y 90
  - Longitud entre -180 y 180
- **Response:**
```json
{
  "id": 2,
  "name": "Nuevo Parque",
  ...
}
```

### Recomendaciones para Consumo desde Frontend

- Usar `fetch` o `axios` para realizar peticiones HTTP.
- Todas las respuestas son en formato JSON.
- Para crear lugares, enviar el body en formato JSON y usar el header `Content-Type: application/json`.
- Los endpoints de detalle incluyen las relaciones (trails, photos, reviews, amenities).
- Los filtros se aplican como query params en el endpoint de listado.

#### Ejemplo con fetch (JavaScript)
```js
fetch('http://localhost:5000/api/places?category=Cascada')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Ejemplo con Axios
```js
import axios from 'axios';
axios.get('http://localhost:5000/api/places/1')
  .then(res => console.log(res.data));
```

---

## 👤 Autoría

Desarrollado por **José de Jesús Almanza Contreras**
Octubre 2025

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para más detalles.

```
MIT License

Copyright (c) 2025 José de Jesús Almanza Contreras

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Autoría y Reconocimientos

### Autor Principal
**José de Jesús Almanza Contreras**
- 🎓 Desarrollador Full Stack 
- 💼 Experto en arquitecturas de microservicios y APIs REST
- 🌐 Enfoque en desarrollo de aplicaciones escalables y robustas

### Tecnologías y Herramientas Utilizadas
- Microsoft .NET 9 Framework
- Entity Framework Core ORM
- SQL Server Database Engine
- Docker Containerization Platform
- AutoMapper Object Mapping
- FluentValidation Library
- Swagger/OpenAPI Documentation

### Inspiración del Proyecto
Este proyecto nace de la pasión por la naturaleza mexicana y el deseo de crear una plataforma tecnológica que facilite el descubrimiento y exploración de los maravillosos lugares naturales que México tiene para ofrecer.

---


### Tiempo de Respuesta
- **Issues críticos**: 24-48 horas
- **Mejoras y sugerencias**: 3-5 días hábiles
- **Preguntas generales**: 1-2 días hábiles

---

**© 2025 José de Jesús Almanza Contreras. Todos los derechos reservados.**
