
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import Index from "./pages/Index";
import ErrorBoundary from "./components/ErrorBoundary";

const NotFound = lazy(() => import("./pages/NotFound"));
const ProcessDiscovery = lazy(() => import("./pages/ProcessDiscovery"));
const OutlierAnalysis = lazy(() => import("./pages/OutlierAnalysis"));
const ComplianceMonitoring = lazy(() => import("./pages/ComplianceMonitoring"));
const FMEAAnalysis = lazy(() => import("./pages/FMEAAnalysis"));
const Admin = lazy(() => import("./pages/Admin"));
const ApiIntegrations = lazy(() => import("./pages/ApiIntegrations"));
const GapAnalysis = lazy(() => import("./pages/GapAnalysis"));
const IncidentManagement = lazy(() => import("./pages/IncidentManagement"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/process-discovery" element={<ProtectedRoute><ProcessDiscovery /></ProtectedRoute>} />
                <Route path="/outlier-analysis" element={<ProtectedRoute><OutlierAnalysis /></ProtectedRoute>} />
                <Route path="/compliance-monitoring" element={<ProtectedRoute><ComplianceMonitoring /></ProtectedRoute>} />
                <Route path="/fmea-analysis" element={<ProtectedRoute><FMEAAnalysis /></ProtectedRoute>} />
                <Route path="/gap-analysis" element={<ProtectedRoute><GapAnalysis /></ProtectedRoute>} />
                <Route path="/incident-management" element={<ProtectedRoute><IncidentManagement /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                <Route path="/api-integrations" element={<ProtectedRoute><ApiIntegrations /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
