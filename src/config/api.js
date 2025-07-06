import { baseURL } from '../utils/DataFront/eventTypes';

const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: `${baseURL}/auth/login`,
        REGISTER: `${baseURL}/auth/register`,
        VALIDATE: `${baseURL}/auth/validate-profile`,
        FORGOT_PASSWORD: `${baseURL}/auth/forgot-password`,
        RESET_PASSWORD: `${baseURL}/auth/reset-password`,
        PROFILE: `${baseURL}/users/profile`
    },

    // Users & Profiles
    USERS: {
        BASE: `${baseURL}/users`,
        PROFILE: `${baseURL}/users/profile`,
        UPDATE: `${baseURL}/users/profile`
    },

    // Services
    SERVICES: {
        BASE: `${baseURL}/services`,
        FILTER: `${baseURL}/filter/services`,
        UPDATE: `${baseURL}/services/forUpdate`
    },

    // Events
    EVENTS: {
        BASE: `${baseURL}/evenements`,
        FILTER: `${baseURL}/filter/evenements`,
        OCCURRENCE: `${baseURL}/filter/evenements/occurence`,
        SOCIETY: `${baseURL}/societe/filter/evenements`,
        INVITE: `${baseURL}/evenementsInviter`,
        PARTICIPATION: {
            REQUEST: `${baseURL}/demandeParticipation/societe/evenements`,
            CANCEL: `${baseURL}/demandeAnnuleParticipation/societe/evenements`
        }
    },

    // Tasks
    TASKS: {
        BASE: `${baseURL}/taches`,
        FILTER: `${baseURL}/filter/taches`,
        TYPES: `${baseURL}/filter/typesTaches`,
        DEFAULT: `${baseURL}/tachesParDefaut/evenements`
    },

    // Projects
    PROJECTS: {
        BASE: `${baseURL}/projets`,
        FILTER: `${baseURL}/filter/projets`
    },

    // Categories
    CATEGORIES: {
        EVENTS: `${baseURL}/categories/evenements`
    },

    // Roles
    ROLES: {
        TASKS: `${baseURL}/roles`,
        PLANS: `${baseURL}/rolesPlan`
    },

    // Positions & Posts
    POSITIONS: {
        BASE: `${baseURL}/positions`
    },
    POSTS: {
        BASE: `${baseURL}/postes`
    },

    // Managers
    MANAGERS: {
        BASE: `${baseURL}/responsables`,
        FILTER: `${baseURL}/filter/responsables`,
        CURRENT: `${baseURL}/responsables/log`,
        NEW: `${baseURL}/responsables/nouveau`
    },

    // Discussions
    DISCUSSIONS: {
        BASE: `${baseURL}/discussions`,
        MEDIA: `${baseURL}/mediaDiscu`
    },

    // Messages
    MESSAGES: {
        BASE: `${baseURL}/messages`
    }
};

export default API_ENDPOINTS; 