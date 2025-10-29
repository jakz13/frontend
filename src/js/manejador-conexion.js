import { ConexionBackend } from './conexion-backend.js';

export class ManejadorConexion {
    constructor() {
        this.conexion = new ConexionBackend();
        this.intentosConexion = 0;
        this.maxIntentos = 3;
    }

    async inicializar() {
        console.log('🔄 Inicializando conexión con backend...');

        const estado = await this.conexion.verificarConexion();

        if (estado.conectado) {
            this.mostrarEstadoConexion(true);
        } else {
            this.mostrarEstadoConexion(false, estado.mensaje);
            this.reintentarConexion();
        }
    }

    mostrarEstadoConexion(conectado, mensaje = '') {
        let indicador = document.getElementById('indicador-conexion');

        if (!indicador) {
            indicador = document.createElement('div');
            indicador.id = 'indicador-conexion';
            indicador.className = 'position-fixed top-0 end-0 m-3 p-2 rounded';
            document.body.appendChild(indicador);
        }

        if (conectado) {
            indicador.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>Conectado al backend</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        } else {
            indicador.innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Backend no disponible</strong>
                    <small class="d-block">${mensaje}</small>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        }

        setTimeout(() => {
            if (indicador) {
                const alerta = indicador.querySelector('.alert');
                if (alerta) {
                    alerta.classList.remove('show');
                    setTimeout(() => indicador.remove(), 150);
                }
            }
        }, 5000);
    }

    async reintentarConexion() {
        if (this.intentosConexion >= this.maxIntentos) {
            console.warn('🚫 Máximo de intentos de conexión alcanzado');
            return;
        }

        this.intentosConexion++;
        console.log(`🔄 Reintentando conexión (${this.intentosConexion}/${this.maxIntentos})...`);

        setTimeout(async () => {
            const estado = await this.conexion.verificarConexion();
            if (!estado.conectado) {
                this.reintentarConexion();
            } else {
                this.mostrarEstadoConexion(true, 'Conexión restablecida');
            }
        }, 3000);
    }

    async crearUsuario(datosUsuario) {
        return await this.conexion.crearUsuario(datosUsuario);
    }

    async obtenerUsuarios() {
        return await this.conexion.obtenerUsuarios();
    }
}