
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import ProcessDiscovery from '@/pages/ProcessDiscovery';
import FMEAAnalysis from '@/pages/FMEAAnalysis';
import OutlierAnalysis from '@/pages/OutlierAnalysis';
import ComplianceMonitoring from '@/pages/ComplianceMonitoring';
import ApiIntegrations from '@/pages/ApiIntegrations';
import ResetPassword from '@/pages/ResetPassword';
import Admin from '@/pages/Admin';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFound from '@/pages/NotFound';

import { AuthProvider } from '@/contexts/AuthContext';

// Create a query client with appropriate configurations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Enable realtime for profiles and subscribers tables
  useEffect(() => {
    const enableRealtime = async () => {
      try {
        // Enable realtime for tables directly with subscription
        const channel = supabase.channel('custom-all-channel')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
            console.log('Profile changed:', payload);
            // Invalidate queries that depend on this data
            queryClient.invalidateQueries({ queryKey: ['profile'] });
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'subscribers' }, (payload) => {
            console.log('Subscriber changed:', payload);
            // Invalidate queries that depend on this data
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
          })
          .subscribe(status => {
            if (status === 'SUBSCRIBED') {
              console.log('Realtime enabled for tables');
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Error enabling realtime');
            }
          });
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Failed to enable realtime:', error);
      }
    };
    
    enableRealtime();
  }, []);
  
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="irmai-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/process-discovery" element={<ProtectedRoute><ProcessDiscovery /></ProtectedRoute>} />
                <Route path="/fmea-analysis" element={<ProtectedRoute><FMEAAnalysis /></ProtectedRoute>} />
                <Route path="/outlier-analysis" element={<ProtectedRoute><OutlierAnalysis /></ProtectedRoute>} />
                <Route path="/compliance-monitoring" element={<ProtectedRoute><ComplianceMonitoring /></ProtectedRoute>} />
                <Route path="/api-integrations" element={<ProtectedRoute><ApiIntegrations /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster closeButton position="bottom-right" />
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
