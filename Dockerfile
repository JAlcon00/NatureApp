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

# Copiar archivos compilados desde la etapa de build
# Angular 20+ genera la carpeta en dist/NatureApp/browser
COPY --from=build /app/dist/NatureApp/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Health check para verificar que el servidor está funcionando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
