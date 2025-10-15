# Configuración de Seguridad - NatureApp

## Variables de Entorno

Este proyecto utiliza variables de entorno para manejar credenciales sensibles de forma segura.

### Configuración para Desarrollo

1. Copia el archivo `.env.example` como `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` con tus valores reales:
   ```bash
   API_URL=http://localhost:5000/api
   MAPBOX_TOKEN=tu_token_de_mapbox_aqui
   NODE_ENV=development
   ```

3. Copia el archivo de configuración de assets:
   ```bash
   cp public/assets/config.example.json public/assets/config.json
   ```

4. Edita `public/assets/config.json` con tus valores:
   ```json
   {
     "apiUrl": "http://localhost:5000/api",
     "mapboxToken": "tu_token_de_mapbox_aqui",
     "production": false
   }
   ```

### Obtener Token de Mapbox

1. Ve a [Mapbox](https://www.mapbox.com/)
2. Crea una cuenta gratuita
3. Ve a tu panel de control
4. Copia tu token de acceso público
5. Pégalo en tu archivo `.env.local` y `config.json`

### Para Producción

**NUNCA** subas archivos con credenciales reales al repositorio. En producción:

1. Configura las variables de entorno en tu servidor
2. Usa servicios como Azure Key Vault, AWS Secrets Manager, etc.
3. Los archivos `.env.*` y `config.json` deben estar en `.gitignore`

### Archivos que NO deben subirse al repositorio

- `.env.local`
- `.env.production`
- `public/assets/config.json`
- Cualquier archivo con credenciales reales

### Archivos que SÍ deben subirse

- `.env.example`
- `public/assets/config.example.json`
- Este archivo README

## Uso en el Código

Para usar las credenciales en tu código, utiliza el `ConfigService`:

```typescript
import { ConfigService } from '@app/core/services/config.service';

constructor(private configService: ConfigService) {}

ngOnInit() {
  const apiUrl = this.configService.apiUrl;
  const mapboxToken = this.configService.mapboxToken;
}
```

## Validación

Antes de hacer commit, verifica que:
- [ ] No hay tokens hardcodeados en el código
- [ ] Los archivos de credenciales están en `.gitignore`
- [ ] Solo los archivos de ejemplo están en el repositorio