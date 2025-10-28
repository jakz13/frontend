// Configuración de la API (actualizar con tu endpoint)
const API_BASE_URL = 'http://localhost:8000/api'; // Cambiar por tu URL de producción

// Elementos del DOM
const userForm = document.getElementById('userForm');
const showUsersBtn = document.getElementById('showUsersBtn');
const usersList = document.getElementById('usersList');
const usersModal = new bootstrap.Modal(document.getElementById('usersModal'));

// Event Listeners
userForm.addEventListener('submit', handleFormSubmit);
showUsersBtn.addEventListener('click', loadAndShowUsers);

// Manejar envío del formulario
async function handleFormSubmit(event) {
    event.preventDefault();

    const userData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert('¡Usuario registrado exitosamente! Se enviará una notificación por email.');
            userForm.reset();
        } else {
            throw new Error('Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar usuario. Por favor, intenta nuevamente.');
    }
}

// Cargar y mostrar usuarios
async function loadAndShowUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/`);
        const users = await response.json();

        displayUsers(users);
        usersModal.show();
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        usersList.innerHTML = '<p class="text-danger">Error al cargar los usuarios</p>';
        usersModal.show();
    }
}

// Mostrar usuarios en el modal
function displayUsers(users) {
    if (users.length === 0) {
        usersList.innerHTML = '<p class="text-center">No hay usuarios registrados</p>';
        return;
    }

    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="row">
                <div class="col-md-4">
                    <strong><i class="fas fa-user me-2"></i>Nombre:</strong>
                    <p>${user.nombre}</p>
                </div>
                <div class="col-md-4">
                    <strong><i class="fas fa-envelope me-2"></i>Email:</strong>
                    <p>${user.email}</p>
                </div>
                <div class="col-md-4">
                    <strong><i class="fas fa-phone me-2"></i>Teléfono:</strong>
                    <p>${user.telefono}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Efectos adicionales para mejorar la experiencia
document.addEventListener('DOMContentLoaded', function() {
    // Agregar efecto de aparición a los inputs
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
});