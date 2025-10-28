// Configuración de la aplicación
export const CONFIG = {
    API_BASE_URL: process.env.API_URL || 'http://localhost:8000/api',
    ENDPOINTS: {
        USERS: '/users/',
        NOTIFICATIONS: '/notify/'
    },
    MESSAGES: {
        SUCCESS: '¡Usuario registrado exitosamente! Se enviará una notificación por email.',
        ERROR: 'Error al registrar usuario. Por favor, intenta nuevamente.',
        LOADING_ERROR: 'Error al cargar los usuarios',
        VALIDATION: {
            EMAIL: 'Por favor, ingrese un email válido',
            PHONE: 'Por favor, ingrese un teléfono válido',
            NAME: 'El nombre es requerido'
        }
    },
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_REGEX: /^[\+]?[0-9\s\-\(\)]{10,}$/
    }
};