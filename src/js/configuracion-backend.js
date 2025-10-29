// Configuración específica para conectar con el backend Django
export const ConfiguracionBackend = {
    // URLs según el entorno
    desarrollo: 'http://localhost:8000/api',
    produccion: 'https://tu-api-gateway.ejemplo.com/api',

    // Detectar entorno automáticamente
    obtenerUrlBase() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.desarrollo;
        }
        return this.produccion;
    },

    // Endpoints esperados del backend Django
    endpoints: {
        usuarios: '/usuarios/',
        salud: '/salud/',
        notificaciones: '/notificaciones/'
    },

    // Configuración de CORS y headers
    configuracionFetch: {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'same-origin'
    }
};