import axios from 'axios';
import { baseURL } from '../DataFront/eventTypes';

const AuthService = {
    // Connexion de l'utilisateur
    login: async (data) => {
        try {
            console.log('Tentative de connexion avec:', { email: data.email });
            const response = await axios.post(`${baseURL}/api/auth/login`, {
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
    logout: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                await axios.post(`${baseURL}/api/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        }
    },

    // Vérification de l'authentification
    checkAuth: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const storedUser = localStorage.getItem('user');
            
            if (!token) {
                return { isAuthenticated: false };
            }

            const response = await axios.get(`${baseURL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                // Mettre à jour les données utilisateur dans le localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
                return { 
                    isAuthenticated: true, 
                    user: response.data
                };
            }
            return { isAuthenticated: false };
        } catch (error) {
            console.error('Erreur de vérification d\'authentification:', error);
            
            // En cas d'erreur réseau, essayer d'utiliser les données stockées
            if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('accessToken');
                
                if (storedUser && token) {
                    console.log('Utilisation des données utilisateur stockées (erreur réseau)');
                    return { 
                        isAuthenticated: true, 
                        user: JSON.parse(storedUser)
                    };
                }
            }
            
            // Ne supprimer le token que pour les erreurs d'authentification spécifiques
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('Token invalide, suppression des données de session');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
            }
            
            return { isAuthenticated: false };
        }
    },

    // Mise à jour du profil
    updateProfile: async (userData) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(`${baseURL}/api/users/profile`, userData, {
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
            const response = await axios.post(`${baseURL}/api/auth/register`, userData);
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
            const response = await axios.post(`${baseURL}/api/auth/verify-email`, {
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
            const response = await axios.post(`${baseURL}/api/auth/forgot-password`, { email });
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
