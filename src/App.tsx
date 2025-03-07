
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProcessDiscovery from "./pages/ProcessDiscovery";
import OutlierAnalysis from "./pages/OutlierAnalysis";

// Create a new QueryClient for React Query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/process-discovery" element={<ProcessDiscovery />} />
          <Route path="/outlier-analysis" element={<OutlierAnalysis />} />
          <Route path="/fmea-analysis" element={<NotFound />} />
          <Route path="/gap-analysis" element={<NotFound />} />
          <Route path="/compliance-monitoring" element={<NotFound />} />
          <Route path="/incident-management" element={<NotFound />} />
          <Route path="/admin" element={<NotFound />} />
          <Route path="/controls-testing" element={<NotFound />} />
          <Route path="/scenario-analysis" element={<NotFound />} />
          <Route path="/risk-catalog" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
