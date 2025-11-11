
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import NotFoundPage from './pages/NotFoundPage';
import { Role } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute role={Role.Admin}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/staff" element={
          <ProtectedRoute role={Role.Staff}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: Role;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    const redirectTo = user.role === Role.Admin ? '/admin' : '/staff';
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

export default App;
