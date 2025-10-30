// Configuración específica para conectar con el backend Django
export const ConfiguracionBackend = {
    desarrollo: 'http://localhost:8000/api',
    produccion: 'http://tu-backend-service.eks/api',

    obtenerUrlBase() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.desarrollo;
        }
        return this.produccion;
    },

    endpoints: {
        usuarios: '/usuarios/',      // URL
        salud: '/salud/',            // ENDPOINT QUE AGREGAMOS
    },

    configuracionFetch: {
        headers: {
            'Content-Type': 'application/json',
        }
    }
};