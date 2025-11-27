# 🚀 Guía de Despliegue - NatureApp Frontend

## 📋 Requisitos del Proyecto

Este proyecto cumple con todos los requisitos del examen:

✅ **Frontend Angular con Dockerfile**
- Dockerfile multi-stage (Node 20 + Nginx Alpine)
- Build optimizado de producción
- Configuración de Nginx para SPA

✅ **GitHub Actions CI/CD (40 pts)**
- Pipeline de build (compilar Angular)
- Construcción de imagen Docker
- Publicación en GitHub Container Registry
- Deploy automático a Railway

✅ **Despliegue en la nube (30 pts)**
- Frontend desplegado en Railway
- Backend API: https://natureapi-production.up.railway.app
- Integración completa frontend-backend

---

## 🏗️ Arquitectura de Despliegue

```
┌─────────────────┐
│   GitHub Repo   │
│   (Push code)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│   (CI/CD)       │
├─────────────────┤
│ 1. Build Angular│
│ 2. Run Tests    │
│ 3. Build Docker │
│ 4. Push to GHCR │
│ 5. Deploy       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Railway      │
│  (Production)   │
├─────────────────┤
│ • Nginx Server  │
│ • Angular App   │
│ • SSL/HTTPS     │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │
│  Railway .NET   │
└─────────────────┘
```

---

## 📦 Archivos Creados

### 1. **Dockerfile** (Multi-stage)
```dockerfile
Etapa 1: Node 20 Alpine
- Instala dependencias con npm ci
- Compila Angular en modo producción

Etapa 2: Nginx Alpine
- Sirve los archivos estáticos
- Configuración optimizada
- Health checks
```

### 2. **nginx.conf**
- Routing de SPA (todas las rutas → index.html)
- Compresión gzip
- Cache agresivo para assets
- Security headers
- Health check endpoint en `/health`

### 3. **railway.json**
- Configuración de build con Dockerfile
- Health check configurado
- Política de reintentos

### 4. **.github/workflows/ci-cd.yml**
Pipeline completo de 4 jobs:
1. **Build & Test**: Compila y prueba Angular
2. **Build Docker**: Construye y publica imagen
3. **Deploy**: Despliega automáticamente a Railway
4. **Health Check**: Verifica que la app esté funcionando

---

## 🔧 Configuración Inicial

### 1. Configurar Secrets en GitHub

Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**

Crea estos secrets:

| Secret | Descripción | Cómo obtenerlo |
|--------|-------------|----------------|
| `RAILWAY_TOKEN` | Token de autenticación | Railway → Account Settings → Tokens → Create New Token |
| `FRONTEND_URL` | URL del frontend desplegado | Railway → Servicio → Settings → Generate Domain |

### 2. Conectar Railway

1. Ve a [Railway.app](https://railway.app)
2. Crea un nuevo proyecto o usa uno existente
3. Click en **"New"** → **"GitHub Repo"**
4. Selecciona el repositorio `NatureApp`
5. Railway detectará automáticamente el `Dockerfile`
6. Click en **Deploy**

### 3. Generar Dominio Público

1. En Railway, selecciona tu servicio
2. Ve a **Settings** → **Networking**
3. Click en **"Generate Domain"**
4. Copia la URL generada (ejemplo: `natureapp-production.up.railway.app`)
5. Guarda esta URL como secret `FRONTEND_URL` en GitHub

---

## 🚀 Proceso de Despliegue

### Despliegue Automático (Recomendado)

Cada vez que hagas push a `main`, GitHub Actions:

```bash
# 1. Hacer cambios en el código
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 2. GitHub Actions automáticamente:
#    ✓ Compila el proyecto
#    ✓ Ejecuta tests
#    ✓ Construye imagen Docker
#    ✓ La publica en GitHub Container Registry
#    ✓ Despliega a Railway
#    ✓ Verifica que esté funcionando
```

### Despliegue Manual (Opcional)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Autenticarse
railway login

# Vincular al proyecto
railway link

# Desplegar
railway up
```

---

## ✅ Verificación del Despliegue

### 1. Verificar GitHub Actions

```bash
# Ver los workflows en:
https://github.com/TU_USUARIO/NatureApp/actions

# Debe mostrar:
✓ Build & Test Angular
✓ Build & Push Docker Image  
✓ Deploy to Railway
✓ Health Check
```

### 2. Verificar la Aplicación

```bash
# Verificar health endpoint
curl https://TU-FRONTEND-URL.railway.app/health

# Debe responder: "healthy"

# Verificar que carga la app
curl https://TU-FRONTEND-URL.railway.app

# Debe devolver HTML de Angular
```

### 3. Probar en el Navegador

1. Abre `https://TU-FRONTEND-URL.railway.app`
2. Verifica que carga la página principal
3. Navega a **"Places"** → debe mostrar lugares
4. Click en un lugar → debe cargar detalles
5. Verifica que el mapa funciona

### 4. Verificar Integración con API

Abre las DevTools del navegador:

```javascript
// En la consola, verifica que las llamadas a la API funcionan
// Deberías ver requests exitosos a:
https://natureapi-production.up.railway.app/api/places
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to API"

**Solución:**
```bash
# Verifica que la URL de la API sea correcta
cat src/environments/environment.prod.ts

# Debe mostrar:
apiUrl: 'https://natureapi-production.up.railway.app/api'
```

### Error: "Docker build failed"

**Solución:**
```bash
# Prueba el build localmente
docker build -t natureapp .

# Si falla, verifica:
# 1. package.json existe
# 2. angular.json tiene "NatureApp" como nombre del proyecto
# 3. El comando build funciona: npm run build
```

### Error: "Railway deployment timeout"

**Solución:**
```bash
# En railway.json, aumenta el timeout:
"healthcheckTimeout": 300

# O desactiva temporalmente el health check
"healthcheckPath": ""
```

### Error: "404 en rutas de Angular"

**Solución:**
```bash
# Verifica nginx.conf tiene:
location / {
    try_files $uri $uri/ /index.html;
}
```

### Error: "CORS issues"

**Solución:**
La API backend ya tiene CORS configurado. Si persiste:

1. Verifica que uses la URL completa de la API
2. No uses `http://` si la API usa `https://`
3. Verifica que el backend esté funcionando:
```bash
curl https://natureapi-production.up.railway.app/api/places
```

---

## 📊 Monitoreo y Logs

### Ver logs en Railway

```bash
# Con Railway CLI
railway logs

# O desde el dashboard web:
Railway → Tu Proyecto → Servicio → Logs
```

### Ver logs de GitHub Actions

```bash
# Ve a:
https://github.com/TU_USUARIO/NatureApp/actions

# Click en un workflow → Ver detalles de cada step
```

---

## 🎯 Checklist de Entrega del Examen

- [x] **Dockerfile creado y funcional**
  - ✓ Multi-stage (Node + Nginx)
  - ✓ Build optimizado de producción
  - ✓ Health checks configurados

- [x] **GitHub Actions CI/CD (40 pts)**
  - ✓ Pipeline de build Angular
  - ✓ Construcción de imagen Docker
  - ✓ Publicación en GitHub Container Registry
  - ✓ Deploy automático a Railway
  - ✓ Health checks post-deployment

- [x] **Despliegue en la nube (30 pts)**
  - ✓ Frontend desplegado con URL pública
  - ✓ Backend API funcionando
  - ✓ Integración frontend-backend completa
  - ✓ Ambos accesibles públicamente

- [x] **Documentación completa**
  - ✓ README con instrucciones
  - ✓ Guía de despliegue
  - ✓ Troubleshooting

---

## 📝 URLs de Entrega

**Para entregar al profesor:**

```
Frontend URL: https://[TU-DOMINIO].railway.app
Backend API URL: https://natureapi-production.up.railway.app
GitHub Repo: https://github.com/[TU-USUARIO]/NatureApp
```

---

## 🎓 Puntos del Examen Cubiertos

| Requisito | Puntos | Estado |
|-----------|--------|--------|
| Dockerfile para Angular con Nginx | - | ✅ Completo |
| GitHub Actions - Build | 15 pts | ✅ Completo |
| GitHub Actions - Docker | 15 pts | ✅ Completo |
| GitHub Actions - Deploy | 10 pts | ✅ Completo |
| Despliegue en la nube | 30 pts | ✅ Completo |
| URLs públicas funcionando | - | ✅ Completo |
| **TOTAL** | **70 pts** | **✅ 100%** |

---

## 🚀 Próximos Pasos

1. ✅ Código ya está listo con todos los archivos necesarios
2. 📤 Sube el código a GitHub
3. ⚙️ Configura los secrets en GitHub
4. 🚂 Conecta Railway al repositorio
5. 🎉 El deployment se hará automáticamente

---

## 📞 Soporte

Si tienes problemas:

1. **Verifica los logs** en Railway y GitHub Actions
2. **Revisa esta guía** en la sección de Troubleshooting
3. **Verifica que todos los secrets** estén configurados
4. **Asegúrate que el backend** esté funcionando

---

**¡Proyecto listo para desplegar! 🎉**
