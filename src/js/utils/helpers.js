import { CONFIG } from '../../config/constants.js';

export class Helpers {
    static showNotification(message, type = 'info') {
        // Podríamos implementar un sistema de notificaciones toast
        alert(message); // Simple por ahora
    }

    static validateEmail(email) {
        return CONFIG.VALIDATION.EMAIL_REGEX.test(email);
    }

    static validatePhone(phone) {
        return CONFIG.VALIDATION.PHONE_REGEX.test(phone.replace(/\s/g, ''));
    }

    static formatPhone(phone) {
        return phone.replace(/\D/g, '');
    }

    static showLoading(button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Registrando...';
    }

    static hideLoading(button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-save me-2"></i>Registrar Usuario';
    }

    static animateElement(element, animation) {
        element.classList.add(animation);
        element.addEventListener('animationend', () => {
            element.classList.remove(animation);
        }, { once: true });
    }
}