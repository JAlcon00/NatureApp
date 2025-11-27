# 🚀 Guía Rápida de Despliegue

## ✅ Archivos Listos

Todos los archivos necesarios ya están creados:

- ✅ `Dockerfile` - Build multi-stage (Node + Nginx)
- ✅ `nginx.conf` - Configuración optimizada
- ✅ `railway.json` - Config de Railway
- ✅ `.github/workflows/ci-cd.yml` - Pipeline completo
- ✅ `.dockerignore` - Optimización de build
- ✅ `src/environments/environment.prod.ts` - URL de API configurada

## 📝 Pasos para Desplegar

### 1️⃣ Subir a GitHub

```bash
# Si ya tienes el repositorio inicializado:
git add .
git commit -m "feat: Add Docker, Nginx and CI/CD pipeline for deployment"
git push origin main

# Si NO tienes repositorio:
git init
git add .
git commit -m "feat: Initial commit with deployment configuration"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/NatureApp.git
git push -u origin main
```

### 2️⃣ Configurar Secrets en GitHub

Ve a: `https://github.com/TU_USUARIO/NatureApp/settings/secrets/actions`

Crea estos secrets **ANTES** de hacer push:

| Secret | Valor | ¿Obligatorio? |
|--------|-------|---------------|
| `RAILWAY_TOKEN` | Token de Railway (Account Settings → Tokens) | ✅ Sí |
| `RAILWAY_PROJECT_ID` | ID del proyecto (Settings → Project ID) | ✅ Sí |
| `RAILWAY_SERVICE_NAME` | Nombre del servicio (ej: `frontend`) | ✅ Sí |
| `FRONTEND_URL` | URL del frontend desplegado | ⚠️ Después del primer deploy |

> 📖 **Guía detallada**: Ver [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) para instrucciones paso a paso.

### 3️⃣ Configurar Railway (Usar el MISMO proyecto del backend)

**✨ Recomendado: Agregar servicio al proyecto existente**

1. Ve a [Railway.app](https://railway.app)
2. Abre tu proyecto existente (donde está el backend)
3. Click en **"+ New"** (botón superior derecho)
4. Selecciona **"GitHub Repo"**
5. Busca y selecciona **"NatureApp"**
6. Railway detectará automáticamente el `Dockerfile`
7. **Importante**: Nombra el servicio como `frontend` (o el nombre que pusiste en `RAILWAY_SERVICE_NAME`)
8. Click en **"Deploy"**
9. Espera a que termine el build (3-5 minutos)
10. Ve a **Settings** → **Networking** → **"Generate Domain"**
11. Copia la URL y agrégala como secret `FRONTEND_URL` en GitHub

**Estructura final:**
```
📦 Tu Proyecto Railway
├── Backend Service (existente)
└── Frontend Service (nuevo) ← Este es el que acabas de crear
```

**Opción B - Deploy manual con Railway CLI**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Autenticarse (genera el token)
railway login

# Vincular al proyecto
railway link

# Desplegar
railway up

# Ver logs
railway logs
```

### 4️⃣ Verificar Despliegue

```bash
# Verificar que el backend funciona
curl https://natureapi-production.up.railway.app/api/places

# Verificar que el frontend funciona
curl https://TU-FRONTEND-URL.railway.app/health
# Debe responder: "healthy"

# Verificar en el navegador
open https://TU-FRONTEND-URL.railway.app
```

### 5️⃣ Ver el Pipeline de CI/CD

```bash
# Ve a GitHub Actions:
https://github.com/TU_USUARIO/NatureApp/actions

# Deberías ver el workflow ejecutándose con 4 jobs:
# ✓ Build & Test Angular
# ✓ Build & Push Docker Image
# ✓ Deploy to Railway
# ✓ Health Check
```

---

## 🎯 URLs de Entrega

Para entregar tu proyecto al profesor, proporciona:

```
🌐 Frontend: https://[TU-APP].railway.app
🔧 Backend: https://natureapi-production.up.railway.app
📦 GitHub: https://github.com/[TU-USUARIO]/NatureApp
📊 CI/CD: https://github.com/[TU-USUARIO]/NatureApp/actions
```

---

## ⚡ Comandos Útiles

```bash
# Build local para probar
npm install
npm run build -- --configuration production

# Probar Dockerfile localmente
docker build -t natureapp .
docker run -p 8080:80 natureapp
# Abre: http://localhost:8080

# Ver logs en Railway
railway logs --follow

# Redesplegar manualmente
railway up --detach
```

---

## 🐛 Troubleshooting Común

### "GitHub Actions falla en build"
```bash
# Solución: Verifica que el build funcione localmente
npm ci --legacy-peer-deps
npm run build -- --configuration production
```

### "Railway no detecta el Dockerfile"
```bash
# Solución: Verifica que railway.json esté en la raíz
cat railway.json
# Debe tener: "dockerfilePath": "Dockerfile"
```

### "El frontend no carga"
```bash
# Solución: Verifica los logs
railway logs

# O revisa el browser console para ver errores
```

### "Error de CORS al consumir API"
```bash
# Solución: Verifica que la URL en environment.prod.ts sea:
apiUrl: 'https://natureapi-production.up.railway.app/api'

# NO http:// si la API usa https://
```

---

## 📚 Documentación Completa

Para más detalles, consulta:

- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía completa de despliegue
- 📖 [API_DOCUMENT.md](./API_DOCUMENT.md) - Documentación de la API
- 📖 [SECURITY.md](./SECURITY.md) - Configuración de variables de entorno

---

## ✅ Checklist Final

Antes de entregar, verifica que:

- [ ] Código subido a GitHub
- [ ] GitHub Actions ejecutándose correctamente
- [ ] Railway conectado al repositorio
- [ ] Frontend accesible públicamente
- [ ] Backend accesible públicamente
- [ ] Frontend consume API correctamente
- [ ] Mapa de Mapbox funciona
- [ ] Navegación entre páginas funciona
- [ ] No hay errores en la consola del navegador

---

**¡Todo listo para desplegar! 🎉**

Si tienes problemas, revisa los logs en Railway y GitHub Actions.
