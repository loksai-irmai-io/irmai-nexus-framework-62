
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

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProcessDiscovery = lazy(() => import("./pages/ProcessDiscovery"));
const OutlierAnalysis = lazy(() => import("./pages/OutlierAnalysis"));
const ComplianceMonitoring = lazy(() => import("./pages/ComplianceMonitoring"));
const FMEAAnalysis = lazy(() => import("./pages/FMEAAnalysis"));
const Admin = lazy(() => import("./pages/Admin"));
const ApiIntegrations = lazy(() => import("./pages/ApiIntegrations"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

const ErrorFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
    >
      Try again
    </button>
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
              <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
              <Route path="/api-integrations" element={<ProtectedRoute><ApiIntegrations /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
