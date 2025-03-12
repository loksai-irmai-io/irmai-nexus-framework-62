
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Use React.lazy for code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProcessDiscovery = lazy(() => import("./pages/ProcessDiscovery"));
const OutlierAnalysis = lazy(() => import("./pages/OutlierAnalysis"));
const ComplianceMonitoring = lazy(() => import("./pages/ComplianceMonitoring"));
const FMEAAnalysis = lazy(() => import("./pages/FMEAAnalysis"));
const Admin = lazy(() => import("./pages/Admin"));
const ApiIntegrations = lazy(() => import("./pages/ApiIntegrations"));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

// Error boundary for route loading
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

// Create a new QueryClient with improved configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000, // 30 seconds
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

// ScrollToTop component to handle scroll position on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/process-discovery" element={<ProcessDiscovery />} />
            <Route path="/outlier-analysis" element={<OutlierAnalysis />} />
            <Route path="/compliance-monitoring" element={<ComplianceMonitoring />} />
            <Route path="/fmea-analysis" element={<FMEAAnalysis />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/api-integrations" element={<ApiIntegrations />} />
            
            {/* Redirect routes with clear communication */}
            <Route path="/gap-analysis" element={<Navigate to="/not-found" state={{ message: "Gap Analysis module is coming soon" }} />} />
            <Route path="/incident-management" element={<Navigate to="/not-found" state={{ message: "Incident Management module is under development" }} />} />
            <Route path="/controls-testing" element={<Navigate to="/not-found" state={{ message: "Controls Testing module is not yet available" }} />} />
            <Route path="/scenario-analysis" element={<Navigate to="/not-found" state={{ message: "Scenario Analysis module is in progress" }} />} />
            <Route path="/risk-catalog" element={<Navigate to="/not-found" state={{ message: "Risk Catalog module is coming soon" }} />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
