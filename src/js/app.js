import { UsersAPI } from './api/users-api.js';
import { Helpers } from './utils/helpers.js';
import { CONFIG } from '../config/constants.js';
import { ManejadorConexion } from './manejador-conexion.js';

class UserRegistrationApp {
    constructor() {
        this.usersAPI = new UsersAPI();
        this.manejadorConexion = new ManejadorConexion(); // NUEVA LINEA
        this.init();
    }

    async init() { // Cambiar a async
        this.bindEvents();
        await this.manejadorConexion.inicializar(); // NUEVA LINEA
        this.addInputAnimations();
    }

    bindEvents() {
        document.getElementById('userForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('showUsersBtn').addEventListener('click', () => this.loadAndShowUsers());
    }

    async handleFormSubmit(event) {
        event.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const formData = this.getFormData();

        if (!this.validateForm(formData)) {
            return;
        }

        try {
            Helpers.showLoading(submitBtn);

            // CAMBIAR ESTA LÍNEA:
            // await this.usersAPI.createUser(formData);
            // POR ESTA:
            await this.manejadorConexion.crearUsuario(formData);

            Helpers.showNotification(CONFIG.MESSAGES.SUCCESS, 'success');
            this.resetForm();
            this.animateSuccess();
        } catch (error) {
            console.error('Registration error:', error);
            Helpers.showNotification(error.message || CONFIG.MESSAGES.ERROR, 'error');
        } finally {
            Helpers.hideLoading(submitBtn);
        }
    }

    getFormData() {
        return {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: Helpers.formatPhone(document.getElementById('telefono').value)
        };
    }

    validateForm(data) {
        if (!data.nombre) {
            Helpers.showNotification(CONFIG.MESSAGES.VALIDATION.NAME, 'error');
            return false;
        }

        if (!Helpers.validateEmail(data.email)) {
            Helpers.showNotification(CONFIG.MESSAGES.VALIDATION.EMAIL, 'error');
            return false;
        }

        if (!Helpers.validatePhone(data.telefono)) {
            Helpers.showNotification(CONFIG.MESSAGES.VALIDATION.PHONE, 'error');
            return false;
        }

        return true;
    }

    resetForm() {
        document.getElementById('userForm').reset();
    }

    animateSuccess() {
        const card = document.querySelector('.glass-card');
        Helpers.animateElement(card, 'fade-in-up');
    }

    async loadAndShowUsers() {
        const usersList = document.getElementById('usersList');
        const modal = new bootstrap.Modal(document.getElementById('usersModal'));

        try {
            usersList.innerHTML = this.getLoadingHTML();
            modal.show();

            const users = await this.manejadorConexion.obtenerUsuarios();

            usersList.innerHTML = this.renderUsersList(users);
        } catch (error) {
            console.error('Error loading users:', error);
            usersList.innerHTML = this.getErrorHTML();
        }
    }

    renderUsersList(users) {
        if (!users || users.length === 0) {
            return this.getEmptyStateHTML();
        }

        return users.map(user => `
            <div class="user-card fade-in-up">
                <div class="user-info">
                    <i class="fas fa-user"></i>
                    <strong>Nombre:</strong> ${user.nombre}
                </div>
                <div class="user-info">
                    <i class="fas fa-envelope"></i>
                    <strong>Email:</strong> ${user.email}
                </div>
                <div class="user-info">
                    <i class="fas fa-phone"></i>
                    <strong>Teléfono:</strong> ${user.telefono}
                </div>
            </div>
        `).join('');
    }

    getLoadingHTML() {
        return `
            <div class="text-center">
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="text-white mt-2">Cargando usuarios...</p>
            </div>
        `;
    }

    getErrorHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${CONFIG.MESSAGES.LOADING_ERROR}</p>
            </div>
        `;
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h5>No hay usuarios registrados</h5>
                <p>¡Sé el primero en registrarse!</p>
            </div>
        `;
    }

    addInputAnimations() {
        const inputs = document.querySelectorAll('.glass-input');
        inputs.forEach((input, index) => {
            input.style.animationDelay = `${index * 0.1}s`;
            input.classList.add('fade-in-up');
        });
    }

    async checkAPIHealth() {
        const isHealthy = await this.usersAPI.healthCheck();
        if (!isHealthy) {
            console.warn('API backend no está disponible');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new UserRegistrationApp();
});