
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(false);
  
  // Only show loading state if it takes more than 100ms to determine auth state
  // This prevents the brief flash of the loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowLoading(true);
      }
    }, 150);
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Don't render anything during the initial load to prevent flashing
  if (loading && !showLoading) {
    return null;
  }

  // Show loading spinner only if it's taking a while
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page with the return URL
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If adminOnly route but user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated (and admin if required), show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
