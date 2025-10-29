import { ConfiguracionBackend } from './configuracion-backend.js';

export class ConexionBackend {
    constructor() {
        this.urlBase = ConfiguracionBackend.obtenerUrlBase();
        this.config = ConfiguracionBackend.configuracionFetch;
    }

    async crearUsuario(datosUsuario) {
        const url = `${this.urlBase}${ConfiguracionBackend.endpoints.usuarios}`;

        console.log('📤 Enviando usuario al backend:', {
            url: url,
            datos: datosUsuario
        });

        try {
            const respuesta = await fetch(url, {
                method: 'POST',
                ...this.config,
                body: JSON.stringify(datosUsuario)
            });

            const datosRespuesta = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datosRespuesta.error ||
                    datosRespuesta.detail ||
                    `Error del servidor: ${respuesta.status}`
                );
            }

            console.log('✅ Usuario creado exitosamente:', datosRespuesta);
            return datosRespuesta;

        } catch (error) {
            console.error('❌ Error en creación de usuario:', error);
            throw error;
        }
    }

    async obtenerUsuarios() {
        const url = `${this.urlBase}${ConfiguracionBackend.endpoints.usuarios}`;

        console.log('📥 Solicitando usuarios desde:', url);

        try {
            const respuesta = await fetch(url, {
                method: 'GET',
                ...this.config
            });

            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status} al obtener usuarios`);
            }

            const usuarios = await respuesta.json();
            console.log('✅ Usuarios obtenidos:', usuarios);
            return usuarios;

        } catch (error) {
            console.error('❌ Error obteniendo usuarios:', error);
            throw error;
        }
    }

    async verificarConexion() {
        const url = `${this.urlBase}${ConfiguracionBackend.endpoints.salud}`;

        try {
            const respuesta = await fetch(url, {
                method: 'GET',
                ...this.config
            });

            return {
                conectado: respuesta.ok,
                estado: respuesta.status,
                mensaje: respuesta.ok ? 'Backend conectado' : 'Backend no disponible'
            };
        } catch (error) {
            return {
                conectado: false,
                estado: 'ERROR',
                mensaje: error.message
            };
        }
    }
}