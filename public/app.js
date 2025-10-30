// === CONFIGURACIÓN BACKEND ===
const ConfiguracionBackend = {
    desarrollo: 'http://localhost:8000/api',
    produccion: 'http://tu-backend-service.eks/api',

    obtenerUrlBase() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.desarrollo;
        }
        return this.produccion;
    },

    endpoints: {
        usuarios: '/usuarios/',
        salud: '/salud/',
    },

    mensajes: {
        EXITO_REGISTRO: '¡Usuario registrado exitosamente! Se enviará una notificación por email.',
        ERROR_REGISTRO: 'Error al registrar usuario. Por favor, intenta nuevamente.',
        ERROR_CARGA_USUARIOS: 'Error al cargar los usuarios registrados'
    }
};

// === HELPERS ===
class Helpers {
    static mostrarNotificacion(mensaje, tipo = 'info') {
        alert(mensaje);
    }

    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validarTelefono(telefono) {
        // Limpiar el teléfono de espacios, guiones, etc.
        const telefonoLimpio = telefono.replace(/[\s\-\(\)\.]/g, '');

        // Verifica que tenga al menos 8 dígitos (número local)
        // o al menos 10 caracteres si incluye código de país
        if (telefonoLimpio.length < 8) {
            return false;
        }

        // Verifica que solo contenga números y posiblemente un + al inicio
        return /^[\+]?[0-9]{8,}$/.test(telefonoLimpio);
    }

    static formatearTelefono(telefono) {
        return telefono.replace(/\D/g, '');
    }

    static mostrarCargando(boton) {
        boton.disabled = true;
        boton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Registrando...';
    }

    static ocultarCargando(boton) {
        boton.disabled = false;
        boton.innerHTML = '<i class="fas fa-save me-2"></i>Registrar Usuario';
    }
}

// === CONEXIÓN BACKEND ===
class ConexionBackend {
    constructor() {
        this.urlBase = ConfiguracionBackend.obtenerUrlBase();
    }

    async crearUsuario(datosUsuario) {
        const url = `${this.urlBase}${ConfiguracionBackend.endpoints.usuarios}`;

        console.log('📤 Enviando usuario al backend:', datosUsuario);

        try {
            const respuesta = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosUsuario)
            });

            if (!respuesta.ok) {
                throw new Error(`Error del servidor: ${respuesta.status}`);
            }

            return await respuesta.json();
        } catch (error) {
            console.error('❌ Error creando usuario:', error);
            throw error;
        }
    }

    async obtenerUsuarios() {
        const url = `${this.urlBase}${ConfiguracionBackend.endpoints.usuarios}`;

        try {
            const respuesta = await fetch(url);

            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status} al obtener usuarios`);
            }

            return await respuesta.json();
        } catch (error) {
            console.error('❌ Error obteniendo usuarios:', error);
            throw error;
        }
    }
}

// === APLICACIÓN PRINCIPAL ===
class AplicacionRegistroUsuarios {
    constructor() {
        this.conexion = new ConexionBackend();
        this.inicializar();
    }

    inicializar() {
        this.vincularEventos();
        this.agregarAnimaciones();
    }

    vincularEventos() {
        const formulario = document.getElementById('userForm');
        const botonMostrar = document.getElementById('showUsersBtn');

        if (formulario) {
            formulario.addEventListener('submit', (e) => this.manejarEnvioFormulario(e));
        }
        if (botonMostrar) {
            botonMostrar.addEventListener('click', () => this.cargarYMostrarUsuarios());
        }
    }

    async manejarEnvioFormulario(evento) {
        evento.preventDefault();

        const botonEnviar = document.getElementById('submitBtn');
        const datosFormulario = this.obtenerDatosFormulario();

        if (!this.validarFormulario(datosFormulario)) {
            return;
        }

        try {
            Helpers.mostrarCargando(botonEnviar);
            await this.conexion.crearUsuario(datosFormulario);

            Helpers.mostrarNotificacion(ConfiguracionBackend.mensajes.EXITO_REGISTRO, 'exito');
            this.reiniciarFormulario();

        } catch (error) {
            console.error('❌ Error al crear usuario:', error);
            Helpers.mostrarNotificacion(
                error.message || ConfiguracionBackend.mensajes.ERROR_REGISTRO,
                'error'
            );
        } finally {
            Helpers.ocultarCargando(botonEnviar);
        }
    }

    obtenerDatosFormulario() {
        return {
            name: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: Helpers.formatearTelefono(document.getElementById('telefono').value)
        };
    }

    validarFormulario(datos) {
        if (!datos.name) {
            Helpers.mostrarNotificacion('El nombre es requerido', 'error');
            return false;
        }

        if (!Helpers.validarEmail(datos.email)) {
            Helpers.mostrarNotificacion('Por favor, ingrese un email válido', 'error');
            return false;
        }

        if (!Helpers.validarTelefono(datos.phone)) {
            Helpers.mostrarNotificacion('Por favor, ingrese un teléfono válido (mínimo 8 dígitos)', 'error');
            return false;
        }

        return true;
    }



    reiniciarFormulario() {
        document.getElementById('userForm').reset();
    }

    async cargarYMostrarUsuarios() {
        const listaUsuarios = document.getElementById('usersList');
        const modal = new bootstrap.Modal(document.getElementById('usersModal'));

        try {
            listaUsuarios.innerHTML = this.obtenerHTMLCargando();
            modal.show();

            const usuarios = await this.conexion.obtenerUsuarios();
            listaUsuarios.innerHTML = this.renderizarListaUsuarios(usuarios);

        } catch (error) {
            console.error('❌ Error cargando usuarios:', error);
            listaUsuarios.innerHTML = this.obtenerHTMLError();
        }
    }

    renderizarListaUsuarios(usuarios) {
        if (!usuarios || usuarios.length === 0) {
            return this.obtenerHTMLEstadoVacio();
        }

        return usuarios.map(usuario => `
            <div class="user-card">
                <div class="user-info">
                    <i class="fas fa-user"></i>
                    <strong>Nombre:</strong> ${usuario.name}
                </div>
                <div class="user-info">
                    <i class="fas fa-envelope"></i>
                    <strong>Email:</strong> ${usuario.email}
                </div>
                <div class="user-info">
                    <i class="fas fa-phone"></i>
                    <strong>Teléfono:</strong> ${usuario.phone}
                </div>
            </div>
        `).join('');
    }

    obtenerHTMLCargando() {
        return `
            <div class="text-center">
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="text-white mt-2">Cargando usuarios...</p>
            </div>
        `;
    }

    obtenerHTMLError() {
        return `
            <div class="text-center text-white">
                <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                <p>${ConfiguracionBackend.mensajes.ERROR_CARGA_USUARIOS}</p>
            </div>
        `;
    }

    obtenerHTMLEstadoVacio() {
        return `
            <div class="text-center text-white">
                <i class="fas fa-users fa-2x mb-2"></i>
                <h5>No hay usuarios registrados</h5>
                <p>¡Sé el primero en registrarse!</p>
            </div>
        `;
    }

    agregarAnimaciones() {
        const inputs = document.querySelectorAll('.glass-input');
        inputs.forEach((input, index) => {
            input.style.opacity = '0';
            input.style.transform = 'translateY(20px)';

            setTimeout(() => {
                input.style.transition = 'all 0.5s ease';
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}

// === INICIALIZAR CUANDO EL DOM ESTÉ LISTO ===
document.addEventListener('DOMContentLoaded', () => {
    new AplicacionRegistroUsuarios();
});