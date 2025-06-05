import axios from 'axios';
import { baseURL } from '../DataFront/eventTypes';

const AuthService = {
    // Connexion de l'utilisateur (version temporaire sans vérification)
    login: async (data) => {
        try {
            console.log('Connexion temporaire avec:', { email: data.email });
            
            // Création d'un utilisateur fictif
            const mockUser = {
                _id: 'temp-user-id',
                email: data.email,
                nom: 'Utilisateur Test',
                prenom: 'Test',
                role: 'responsable',
                isActive: true,
                isValidate: true
            };

            // Création d'un token fictif
            const mockToken = 'temp-token-' + Date.now();

            // Stockage des données fictives
            localStorage.setItem('accessToken', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            console.log('Connexion temporaire réussie');
            return { success: true, user: mockUser };
        } catch (error) {
            console.error('Erreur de connexion temporaire:', error);
            return { success: false, error: 'Erreur de connexion temporaire' };
        }
    },

    // Déconnexion de l'utilisateur
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },

    // Vérification de l'authentification (version temporaire)
    checkAuth: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const user = localStorage.getItem('user');
            
            if (!token || !user) {
                return { isAuthenticated: false };
            }

            return { 
                isAuthenticated: true, 
                user: JSON.parse(user)
            };
        } catch (error) {
            console.error('Erreur de vérification d\'authentification:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            return { isAuthenticated: false };
        }
    },

    // Mise à jour du profil (version temporaire)
    updateProfile: async (userData) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return { success: true, user: updatedUser };
        } catch (error) {
            return { 
                success: false, 
                error: 'Erreur lors de la mise à jour du profil' 
            };
        }
    },

    // Inscription (version temporaire)
    register: async (userData) => {
        try {
            const mockUser = {
                _id: 'temp-user-id-' + Date.now(),
                ...userData,
                isActive: true,
                isValidate: true
            };
            return { success: true, data: mockUser };
        } catch (error) {
            return { 
                success: false, 
                error: 'Erreur lors de l\'inscription' 
            };
        }
    },

    // Validation du compte (version temporaire)
    validateAccount: async (email, code) => {
        try {
            return { 
                success: true, 
                data: { message: 'Compte validé avec succès' } 
            };
        } catch (error) {
            return { 
                success: false, 
                error: 'Erreur lors de la validation du compte' 
            };
        }
    },

    // Réinitialisation du mot de passe (version temporaire)
    resetPassword: async (email) => {
        try {
            return { 
                success: true, 
                data: { message: 'Instructions de réinitialisation envoyées' } 
            };
        } catch (error) {
            return { 
                success: false, 
                error: 'Erreur lors de la demande de réinitialisation' 
            };
        }
    }
};

export default AuthService;
