import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import API_ENDPOINTS from "../../config/api";
import { baseURL } from "../DataFront/eventTypes";

// Configuration axios
axios.defaults.baseURL = baseURL;
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Requete GET
export const useGetData = (endpoint) => {
    const { logout } = useAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            if (!endpoint) {
                console.log("Pas d'endpoint spécifié");
                return;
            }

            const response = await axios.get(endpoint);
            setData(response.data);
            setError(null);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("Token expiré, déconnexion de l'utilisateur");
                await logout();
                navigate("/login");
            } else {
                console.error("Erreur lors de la récupération des données :", error);
                setError(error.response?.data?.message || "Une erreur est survenue");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return { data, error, loading, fetchData };
};

// Requete POST
export const usePostData = (endpoint) => {
    const { logout } = useAuth();
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const postData = async (data) => {
        setLoading(true);
        try {
            const res = await axios.post(endpoint, data);
            setResponse(res.data);
            setError(null);
            return res.data;
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("Token expiré, déconnexion de l'utilisateur");
                await logout();
                navigate("/login");
            } else {
                console.error("Erreur lors de l'envoi des données :", error);
                setError(error.response?.data?.message || "Une erreur est survenue");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { response, error, loading, postData };
};

// Requete PUT
export const usePutData = (endpoint) => {
    const { logout } = useAuth();
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const putData = async (data) => {
        setLoading(true);
        try {
            const res = await axios.put(endpoint, data);
            setResponse(res.data);
            setError(null);
            return res.data;
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("Token expiré, déconnexion de l'utilisateur");
                await logout();
                navigate("/login");
            } else {
                console.error("Erreur lors de la mise à jour des données :", error);
                setError(error.response?.data?.message || "Une erreur est survenue");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { response, error, loading, putData };
};

// Requete DELETE
export const useDeleteData = (endpoint) => {
    const { logout } = useAuth();
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteData = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`${endpoint}/${id}`);
            setResponse(res.data);
            setError(null);
            return res.data;
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("Token expiré, déconnexion de l'utilisateur");
                await logout();
                navigate("/login");
            } else {
                console.error("Erreur lors de la suppression des données :", error);
                setError(error.response?.data?.message || "Une erreur est survenue");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { response, error, loading, deleteData };
};
