# ========================================
# Etapa 1: Build de la aplicación Angular
# ========================================
FROM node:20-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (npm ci es más rápido y seguro para CI/CD)
RUN npm ci --legacy-peer-deps

# Copiar el código fuente completo
COPY . .

# Build de producción de Angular
RUN npm run build -- --configuration production

# ========================================
# Etapa 2: Servir con Nginx
# ========================================
FROM nginx:alpine

# Instalar gettext para envsubst (reemplazo de variables)
RUN apk add --no-cache gettext

# Copiar archivos compilados desde la etapa de build
# Angular 20+ genera la carpeta en dist/NatureApp/browser
COPY --from=build /app/dist/NatureApp/browser /usr/share/nginx/html

# Copiar configuración de Nginx como template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copiar script de inicio
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Exponer el puerto (Railway lo asigna dinámicamente)
EXPOSE $PORT

# Health check dinámico
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-80}/ || exit 1

# Usar script personalizado para iniciar Nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
