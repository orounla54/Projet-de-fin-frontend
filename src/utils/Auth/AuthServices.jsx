import axios from 'axios';
import { baseURL } from '../DataFront/eventTypes';

const AuthService = {
    // Connexion de l'utilisateur
    login: async (data) => {
        try {
            console.log('Tentative de connexion avec:', { email: data.email });
            const response = await axios.post(`${baseURL}/profiles/auth`, {
                email: data.email,
                password: data.password
            });
            
            if (response.data.token) {
                localStorage.setItem('accessToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return { success: true, user: response.data.user };
            }
            return { success: false, error: 'Réponse invalide du serveur' };
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erreur de connexion'
            };
        }
    },

    // Déconnexion de l'utilisateur
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },

    // Vérification de l'authentification
    checkAuth: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                return { isAuthenticated: false };
            }

            const response = await axios.get(`${baseURL}/profiles/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                return { 
                    isAuthenticated: true, 
                    user: response.data
                };
            }
            return { isAuthenticated: false };
        } catch (error) {
            console.error('Erreur de vérification d\'authentification:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            return { isAuthenticated: false };
        }
    },

    // Mise à jour du profil
    updateProfile: async (userData) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(`${baseURL}/profiles/me`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { success: true, user: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
            };
        }
    },

    // Inscription
    register: async (userData) => {
        try {
            const response = await axios.post(`${baseURL}/profiles/responsable/nouveau`, userData);
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erreur lors de l\'inscription'
            };
        }
    },

    // Validation du compte
    validateAccount: async (email, code) => {
        try {
            const response = await axios.post(`${baseURL}/profiles/validation`, {
                email,
                code
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erreur lors de la validation du compte'
            };
        }
    },

    // Réinitialisation du mot de passe
    resetPassword: async (email) => {
        try {
            const response = await axios.post(`${baseURL}/profiles/request-reset`, { email });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erreur lors de la demande de réinitialisation'
            };
        }
    }
};

export default AuthService;
