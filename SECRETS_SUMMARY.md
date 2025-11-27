# 🎯 Resumen Ejecutivo - Variables y Configuración

## ✅ Lo que necesitas configurar

### 📋 **GitHub Secrets (3 obligatorios + 1 opcional)**

Ir a: `https://github.com/TU_USUARIO/NatureApp/settings/secrets/actions`

#### 1. **RAILWAY_TOKEN** ✅ OBLIGATORIO
```
Dónde: Railway → Perfil → Account Settings → Tokens → Create New Token
Ejemplo: railway-abc123def456...
```

#### 2. **RAILWAY_PROJECT_ID** ✅ OBLIGATORIO
```
Dónde: Railway → Tu Proyecto → Settings → Project ID
Ejemplo: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

#### 3. **RAILWAY_SERVICE_NAME** ✅ OBLIGATORIO
```
Valor: frontend
(O el nombre que le quieras dar al servicio de frontend)
```

#### 4. **FRONTEND_URL** ⚠️ OPCIONAL (agregar después)
```
Dónde: Railway → Frontend Service → Settings → Generate Domain
Ejemplo: https://natureapp-frontend-production.up.railway.app
```

---

## 🚂 Railway: Mismo Proyecto, Dos Servicios

### Arquitectura en Railway:

```
┌────────────────────────────────────────────┐
│  TU PROYECTO RAILWAY (existente)          │
│  ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890 │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  🔧 Backend Service                  │ │
│  │  ├─ Tipo: .NET API                   │ │
│  │  ├─ Repo: NatureAPI                  │ │
│  │  └─ URL: natureapi-production...     │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  🌐 Frontend Service (NUEVO)         │ │
│  │  ├─ Tipo: Docker (Nginx)             │ │
│  │  ├─ Repo: NatureApp                  │ │
│  │  ├─ Name: frontend                   │ │
│  │  └─ URL: [generada después]          │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### Ventajas:
- ✅ Todo en un solo proyecto
- ✅ Más fácil de gestionar
- ✅ Costos centralizados
- ✅ Red privada entre servicios

---

## 📝 Pasos Rápidos (Orden correcto)

### 1️⃣ **PRIMERO: Configurar GitHub Secrets**
```bash
# Ve a GitHub y configura los 3 secrets obligatorios:
# - RAILWAY_TOKEN
# - RAILWAY_PROJECT_ID
# - RAILWAY_SERVICE_NAME
```

### 2️⃣ **Hacer Push a GitHub**
```bash
git add .
git commit -m "feat: Add deployment configuration"
git push origin main
```

### 3️⃣ **GitHub Actions se ejecutará**
```
✓ Build Angular
✓ Build Docker
✓ Deploy to Railway (crea automáticamente el servicio "frontend")
```

### 4️⃣ **Generar dominio en Railway**
```bash
# Ve a Railway → Frontend Service → Settings → Generate Domain
# Copia la URL
```

### 5️⃣ **Agregar FRONTEND_URL a GitHub (opcional)**
```bash
# Pega la URL como secret en GitHub
# Haz otro push para activar el health check
```

---

## 🎬 Script de Configuración Rápida

```bash
# 1. Obtener información de Railway
echo "1. Ve a Railway.app y obtén estos valores:"
echo "   - Token: Account Settings → Tokens"
echo "   - Project ID: Tu Proyecto → Settings → Project ID"
echo ""

# 2. Configurar secrets en GitHub
echo "2. Ve a GitHub → Settings → Secrets → Actions"
echo "   Crea estos 3 secrets:"
echo "   - RAILWAY_TOKEN = [tu-token]"
echo "   - RAILWAY_PROJECT_ID = [tu-project-id]"
echo "   - RAILWAY_SERVICE_NAME = frontend"
echo ""

# 3. Subir código
echo "3. Subir código a GitHub:"
git add .
git commit -m "feat: Add deployment configuration"
git push origin main

echo ""
echo "4. Espera a que GitHub Actions termine (3-5 min)"
echo "5. Ve a Railway y genera el dominio para el servicio 'frontend'"
echo "6. Agrega la URL como secret FRONTEND_URL en GitHub (opcional)"
echo ""
echo "✅ ¡Listo!"
```

---

## 🔍 Cómo Verificar que Todo Está Bien

### ✅ Secrets configurados en GitHub
```
GitHub → Repo → Settings → Secrets and variables → Actions

Deberías ver:
✓ RAILWAY_TOKEN
✓ RAILWAY_PROJECT_ID
✓ RAILWAY_SERVICE_NAME
✓ FRONTEND_URL (después del primer deploy)
```

### ✅ GitHub Actions ejecutándose
```
GitHub → Repo → Actions

Deberías ver:
✓ Build & Test Angular (verde)
✓ Build & Push Docker Image (verde)
✓ Deploy to Railway (verde)
✓ Health Check (verde o amarillo)
```

### ✅ Servicios en Railway
```
Railway → Tu Proyecto

Deberías ver:
✓ backend (o tu nombre para el API)
✓ frontend (nuevo servicio)
```

### ✅ URLs funcionando
```bash
# Backend
curl https://natureapi-production.up.railway.app/api/places

# Frontend (después de generar dominio)
curl https://TU-FRONTEND-URL.railway.app/health
```

---

## 🎯 Tabla Resumen

| Componente | Configuración | Valor de Ejemplo |
|------------|---------------|------------------|
| GitHub Secret | RAILWAY_TOKEN | `railway-abc123...` |
| GitHub Secret | RAILWAY_PROJECT_ID | `a1b2c3d4-e5f6-...` |
| GitHub Secret | RAILWAY_SERVICE_NAME | `frontend` |
| GitHub Secret | FRONTEND_URL | `https://natureapp...railway.app` |
| Railway | Proyecto existente | `nature-api` o similar |
| Railway | Nuevo servicio | `frontend` |
| Railway | Backend URL | `https://natureapi-production...` |
| Railway | Frontend URL | `https://natureapp-frontend...` |

---

## ⚡ TL;DR (Muy Rápido)

1. **Obtén de Railway**: Token + Project ID
2. **Configura en GitHub**: 3 secrets (RAILWAY_TOKEN, RAILWAY_PROJECT_ID, RAILWAY_SERVICE_NAME)
3. **Push**: `git push origin main`
4. **Espera**: GitHub Actions despliega automáticamente
5. **Genera dominio**: En Railway para el servicio frontend
6. **Agrega URL**: Como secret FRONTEND_URL en GitHub (opcional)

---

**¿Dudas?** Lee la guía completa en [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)
