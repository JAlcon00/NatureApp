# 🔐 Configuración de GitHub Secrets y Railway

## 📍 Variables Necesarias

### ✅ **Secrets de GitHub Actions**

Ve a: `https://github.com/TU_USUARIO/NatureApp/settings/secrets/actions`

Click en **"New repository secret"** y crea los siguientes:

---

### 1️⃣ **RAILWAY_TOKEN** (Obligatorio)

**Dónde obtenerlo:**
```
1. Ve a Railway.app
2. Click en tu perfil (esquina superior derecha)
3. Account Settings
4. Tokens
5. Click "Create New Token"
6. Dale un nombre: "GitHub Actions NatureApp"
7. Copia el token generado
```

**Valor:** 
```
railway-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 2️⃣ **RAILWAY_PROJECT_ID** (Obligatorio)

**Dónde obtenerlo:**
```
1. Ve a tu proyecto en Railway (donde está tu backend)
2. Click en "Settings" (⚙️)
3. Busca "Project ID"
4. Copia el ID (algo como: a1b2c3d4-e5f6-7890-abcd-ef1234567890)
```

**Valor:**
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

---

### 3️⃣ **RAILWAY_SERVICE_NAME** (Obligatorio)

**Dónde obtenerlo:**
```
1. En Railway, dentro de tu proyecto
2. Verás los servicios (uno para el backend, crearás otro para frontend)
3. El nombre será algo como: "frontend" o "nature-app-frontend"
4. Si aún no lo has creado, usa: "frontend"
```

**Valor:**
```
frontend
```

**🔍 Nota:** Este será el nombre del nuevo servicio que crearás para el frontend en el mismo proyecto.

---

### 4️⃣ **FRONTEND_URL** (Recomendado)

**Dónde obtenerlo:**
```
1. Después de hacer el primer deploy en Railway
2. Ve al servicio de frontend
3. Settings → Networking → Generate Domain
4. Copia la URL generada
```

**Valor:**
```
https://natureapp-frontend-production-xxxx.up.railway.app
```

**⚠️ Nota:** Este secret solo se necesita para el health check. Puedes agregarlo después del primer deploy.

---

## 🚂 Configuración en Railway

### Opción 1: Conectar Repositorio (Recomendado)

**Pasos:**

1. Ve a tu proyecto existente en Railway (donde está el backend)
2. Click en **"+ New"** (botón superior derecho)
3. Selecciona **"GitHub Repo"**
4. Busca y selecciona **"NatureApp"**
5. Railway detectará automáticamente el `Dockerfile`
6. **Importante:** Cambia el nombre del servicio a `frontend` o el que pusiste en `RAILWAY_SERVICE_NAME`
7. Click en **"Deploy"**
8. Espera a que termine el build (3-5 minutos)
9. Ve a **Settings** → **Networking** → **"Generate Domain"**
10. Copia la URL y guárdala como secret `FRONTEND_URL` en GitHub

---

### Opción 2: Deploy Manual con CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Autenticarse
railway login

# Listar proyectos
railway list

# Vincular al proyecto existente
railway link [PROJECT_ID]

# Crear nuevo servicio para frontend
railway service create frontend

# Desplegar
railway up --service frontend

# Generar dominio
railway domain
```

---

## 📊 Resumen de Secrets

| Secret Name | ¿Obligatorio? | Cuándo agregarlo | Ejemplo de valor |
|-------------|---------------|------------------|------------------|
| `RAILWAY_TOKEN` | ✅ Sí | Antes del primer push | `railway-abc123...` |
| `RAILWAY_PROJECT_ID` | ✅ Sí | Antes del primer push | `a1b2c3d4-e5f6-...` |
| `RAILWAY_SERVICE_NAME` | ✅ Sí | Antes del primer push | `frontend` |
| `FRONTEND_URL` | ⚠️ Recomendado | Después del primer deploy | `https://tu-app.railway.app` |

---

## 🎯 Flujo Completo

### 1. Configurar Secrets en GitHub (primero)

```
GitHub → Repo → Settings → Secrets and variables → Actions
├─ RAILWAY_TOKEN
├─ RAILWAY_PROJECT_ID  
└─ RAILWAY_SERVICE_NAME
```

### 2. Hacer Push a GitHub

```bash
git add .
git commit -m "feat: Add deployment configuration"
git push origin main
```

### 3. GitHub Actions se ejecutará automáticamente

```
✓ Build & Test Angular
✓ Build & Push Docker Image
✓ Deploy to Railway (crea el servicio si no existe)
✓ Health Check
```

### 4. Generar dominio en Railway

```
Railway → Frontend Service → Settings → Networking → Generate Domain
```

### 5. Agregar FRONTEND_URL a GitHub Secrets

```
Copia la URL y agrégala como secret en GitHub
```

### 6. Push nuevamente (opcional)

```bash
git commit --allow-empty -m "chore: trigger deploy with frontend URL"
git push origin main
```

---

## 🔍 Verificar Configuración

### Comando para verificar que Railway está vinculado:

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Ver proyectos
railway list

# Ver servicios del proyecto
railway status
```

### Ver logs del deployment:

```bash
# Logs del servicio frontend
railway logs --service frontend

# O en el dashboard web:
Railway → Tu Proyecto → Frontend Service → Logs
```

---

## 🎨 Estructura Final en Railway

```
📦 Tu Proyecto Railway
│
├── 🔧 Backend Service (ya existente)
│   ├── Tipo: .NET API
│   ├── URL: https://natureapi-production.up.railway.app
│   └── Base de datos asociada
│
└── 🌐 Frontend Service (nuevo)
    ├── Tipo: Dockerfile
    ├── Repo: NatureApp
    ├── Build: Node 20 + Nginx
    └── URL: https://[nombre].up.railway.app
```

---

## ⚠️ Notas Importantes

1. **Mismo proyecto, diferentes servicios**: Backend y frontend están en el mismo proyecto pero son servicios separados.

2. **Variables de entorno**: No necesitas configurar variables en Railway porque ya están en `environment.prod.ts`.

3. **Auto-deploy**: Cada push a `main` hará un deploy automático via GitHub Actions.

4. **Costo**: Railway es gratis hasta $5/mes. Un proyecto con 2 servicios suele estar dentro del límite.

5. **Primer deploy**: El primer deploy puede tardar más (5-7 minutos) porque Railway debe crear el servicio y compilar todo.

---

## ✅ Checklist de Configuración

- [ ] `RAILWAY_TOKEN` agregado en GitHub Secrets
- [ ] `RAILWAY_PROJECT_ID` agregado en GitHub Secrets  
- [ ] `RAILWAY_SERVICE_NAME` agregado en GitHub Secrets
- [ ] Código subido a GitHub (`git push`)
- [ ] GitHub Actions ejecutándose
- [ ] Servicio frontend creado en Railway
- [ ] Dominio generado para frontend
- [ ] `FRONTEND_URL` agregado en GitHub Secrets (opcional)
- [ ] Frontend accesible públicamente
- [ ] Frontend consumiendo API correctamente

---

## 🆘 Troubleshooting

### "Error: Project not found"

**Solución:** Verifica que el `RAILWAY_PROJECT_ID` sea correcto:
```bash
railway list
# Copia el ID correcto
```

### "Error: Service not found"

**Solución:** El servicio se creará automáticamente en el primer deploy. Si falla:
```bash
railway service create frontend
```

### "GitHub Actions falla en deploy"

**Solución:** Verifica que los 3 secrets obligatorios estén configurados:
```
- RAILWAY_TOKEN ✓
- RAILWAY_PROJECT_ID ✓
- RAILWAY_SERVICE_NAME ✓
```

---

**¡Listo! Con estos secrets configurados, tu pipeline de CI/CD funcionará perfectamente.** 🚀
