import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/Auth/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (isAuthenticated) {
        console.log(isAuthenticated);
        return <Navigate to="/" />;
    } else {
        return children;
    }
};

export default ProtectedRoute; 

