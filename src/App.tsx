
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
        // Execute SQL to enable realtime on tables
        await supabase.rpc('enable_realtime_tables', {
          tables: ['profiles', 'subscribers']
        }).then(({ error }) => {
          if (error) {
            console.error('Error enabling realtime:', error);
          } else {
            console.log('Realtime enabled for tables');
          }
        });
      } catch (error) {
        console.error('Failed to enable realtime:', error);
      }
    };
    
    enableRealtime();
  }, []);
  
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="irmai-ui-theme">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
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
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster closeButton position="bottom-right" />
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
