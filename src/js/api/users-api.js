import { CONFIG } from '../../config/constants.js';

export class UsersAPI {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
    }

    async createUser(userData) {
        try {
            const response = await fetch(`${this.baseURL}${CONFIG.ENDPOINTS.USERS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async getUsers() {
        try {
            const response = await fetch(`${this.baseURL}${CONFIG.ENDPOINTS.USERS}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health/`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}