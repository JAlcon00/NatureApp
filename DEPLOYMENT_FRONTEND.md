# 📋 Guía Completa: Desplegar Frontend Angular en Railway

## 1️⃣ Preparar tu proyecto Angular localmente

### 1.1 Navega a tu proyecto Angular
```bash
cd /ruta/de/tu/proyecto-angular
```

### 1.2 Configura la URL de tu API

**Edita `src/environments/environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://natureapi-production.up.railway.app'
};
```

**Edita `src/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'  // Para desarrollo local
};
```

### 1.3 Usa la variable en tus servicios

**Ejemplo en tu servicio (ej: `places.service.ts`):**
```typescript
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPlaces() {
    return this.http.get(`${this.apiUrl}/api/places`);
  }

  getSummary(id: number) {
    return this.http.get(`${this.apiUrl}/api/places/${id}/summary`);
  }
}
```

---

## 2️⃣ Crear Dockerfile multi-stage

**Crea `Dockerfile` en la raíz del proyecto Angular:**

```dockerfile
# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build -- --configuration production

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar archivos compilados
COPY --from=build /app/dist/<NOMBRE_DE_TU_PROYECTO>/browser /usr/share/nginx/html

# Copiar configuración Nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

> ⚠️ **Reemplaza `<NOMBRE_DE_TU_PROYECTO>`** con el nombre en tu `angular.json` (campo `"projects"`).

---

## 3️⃣ Crear configuración Nginx

**Crea `nginx.conf` en la raíz:**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing - todas las rutas a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

---

## 4️⃣ Crear railway.json

**Crea `railway.json` en la raíz:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "nginx -g 'daemon off;'",
    "healthcheckPath": "/",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 5️⃣ Crear GitHub Actions workflow

**Crea `.github/workflows/ci-cd.yml`:**

```yaml
name: CI/CD Frontend Angular

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint --if-present
    
    - name: Build
      run: npm run build -- --configuration production
    
    - name: Test
      run: npm test -- --watch=false --browsers=ChromeHeadless

  build-docker:
    needs: build-and-test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Log in to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ghcr.io/${{ github.repository }}
        tags: |
          type=ref,event=branch
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-docker
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Install Railway CLI
      run: npm install -g @railway/cli
    
    - name: Deploy to Railway
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        RAILWAY_PROJECT_ID: ${{ secrets.RAILWAY_FRONTEND_PROJECT_ID }}
      run: |
        railway up --service <NOMBRE_SERVICIO> --detach

  health-check:
    needs: deploy
    runs-on: ubuntu-latest
    
    steps:
    - name: Wait for deployment
      run: sleep 30
    
    - name: Check health
      run: |
        curl -f ${{ secrets.FRONTEND_URL }} || exit 1
```

> ⚠️ **Reemplaza `<NOMBRE_SERVICIO>`** con el nombre del servicio en Railway (puede ser `frontend` o el nombre de tu proyecto).

---

## 6️⃣ Crear .gitignore (si no existe)

**Agrega estas líneas a `.gitignore`:**

```gitignore
# Angular
/dist/
/tmp/
/out-tsc/
/bazel-out/

# Node
node_modules/
npm-debug.log
yarn-error.log

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db
```

---

## 7️⃣ Subir a GitHub

```bash
cd /ruta/de/tu/proyecto-angular

# Inicializar git si no está
git init

# Agregar archivos
git add .

# Commit
git commit -m "feat: Add Docker, Nginx and CI/CD pipeline"

# Crear repo en GitHub (reemplaza con tu usuario)
# Opción A: Desde GitHub web, crea el repo vacío
# Opción B: Usa gh CLI:
gh repo create NatureFrontend --public --source=. --remote=origin --push
```

---

## 8️⃣ Configurar Railway

### 8.1 Crear nuevo servicio en Railway

**Opción A - En el mismo proyecto (Recomendado):**
1. Ve a tu proyecto `nature-api` en Railway
2. Click **"+ New"** → **"GitHub Repo"**
3. Selecciona tu repositorio del frontend
4. Railway detectará el Dockerfile automáticamente

**Opción B - Proyecto separado:**
1. Crea un nuevo proyecto en Railway
2. Conecta el repositorio del frontend

### 8.2 Generar dominio público
1. Click en el servicio del frontend
2. Settings → Networking → **"Generate Domain"**
3. Copia la URL (ej: `naturefrontend-production.up.railway.app`)

---

## 9️⃣ Configurar GitHub Secrets

En tu repositorio de GitHub → Settings → Secrets and variables → Actions:

**Crea estos secrets:**

| Secret Name | Valor | Dónde obtenerlo |
|------------|-------|-----------------|
| `RAILWAY_TOKEN` | Token de Railway | Railway → Account Settings → Tokens → Create token |
| `RAILWAY_FRONTEND_PROJECT_ID` | ID del proyecto | Railway → Proyecto → Settings → Project ID |
| `FRONTEND_URL` | URL pública | La URL generada en paso 8.2 |

---

## 🔟 Verificar despliegue

### Automático (GitHub Actions):
```bash
# Hacer un cambio y push
git add .
git commit -m "test: Trigger deployment"
git push origin main

# Ver el workflow en:
# https://github.com/TU_USUARIO/TU_REPO/actions
```

### Manual (opcional):
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Deploy manual
railway up
```

---

## ✅ Checklist Final

- [ ] `environment.prod.ts` apunta a tu API en Railway
- [ ] `Dockerfile` con nombre correcto del proyecto Angular
- [ ] `nginx.conf` creado
- [ ] `railway.json` creado
- [ ] `.github/workflows/ci-cd.yml` creado
- [ ] Código subido a GitHub
- [ ] Proyecto conectado en Railway
- [ ] Dominio público generado
- [ ] Secrets configurados en GitHub
- [ ] GitHub Actions ejecutándose
- [ ] Frontend accesible desde URL pública
- [ ] Frontend consume API correctamente

---

## 🧪 Probar funcionamiento

```bash
# Health del backend
curl https://natureapi-production.up.railway.app/health

# Frontend (debe devolver HTML)
curl https://TU-FRONTEND-URL.railway.app

# Probar desde navegador que el frontend carga y consume la API
```

---

## 📝 Notas Importantes

### Para el examen necesitas entregar:

✅ **Frontend Angular con Dockerfile**
- Dockerfile multi-stage (Node build + Nginx)
- Build de producción optimizado

✅ **GitHub Actions CI/CD (40 pts)**
- Pipeline de build (compilar Angular)
- Construir imagen Docker
- Subir a GitHub Container Registry
- Deploy automático a Railway

✅ **Despliegue en la nube (30 pts)**
- URL pública del frontend: `https://tu-frontend.railway.app`
- URL pública del backend: `https://natureapi-production.up.railway.app`
- Ambos funcionando
- Frontend consume API real desplegada

---

## 🆘 Troubleshooting

### Error: "Cannot find module '@angular/..."
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error en Dockerfile: "dist folder not found"
- Verifica el nombre del proyecto en `angular.json`
- Ajusta la ruta en el Dockerfile: `COPY --from=build /app/dist/TU_PROYECTO/browser`

### Error 404 en rutas de Angular
- Verifica que `nginx.conf` tenga: `try_files $uri $uri/ /index.html;`

### CORS error al consumir API
- Ya está configurado en tu backend (`ServiceExtensions.cs`)
- Verifica que uses la URL correcta en `environment.prod.ts`

### Railway no detecta Dockerfile
- Asegúrate de que `railway.json` esté en la raíz
- Verifica que `dockerfilePath` sea correcto

---

## 🎯 Resultado Final

Al terminar estos pasos tendrás:

1. ✅ **Backend .NET** desplegado: `https://natureapi-production.up.railway.app`
2. ✅ **Frontend Angular** desplegado: `https://tu-frontend.railway.app`
3. ✅ **CI/CD completo** en ambos repositorios
4. ✅ **Docker** en ambos proyectos
5. ✅ **Integración funcionando** - Frontend consume API real
6. ✅ **100 puntos** del examen cumplidos

---

**¡Éxito con tu proyecto!** 🚀
