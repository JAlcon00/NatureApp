#!/bin/sh
set -e

# Reemplazar $PORT en la configuración de nginx con el puerto de Railway
# Railway inyecta la variable PORT automáticamente
export PORT=${PORT:-80}

# Generar la configuración de nginx con el puerto correcto
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Iniciar nginx
exec nginx -g 'daemon off;'
