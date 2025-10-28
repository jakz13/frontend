# Usar una imagen ligera de Nginx
FROM nginx:alpine

# Copiar los archivos estáticos
COPY public/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]