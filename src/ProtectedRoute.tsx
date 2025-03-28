import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';

const ProtectedRoute: React.FC = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/welcome" />;
    }

    return <MainLayout><Outlet /></MainLayout>
};

export default ProtectedRoute;
