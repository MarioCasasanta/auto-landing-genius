
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Questionnaire from "./pages/Questionnaire";
import Auth from "./pages/Auth";
import StepByStep from "./pages/StepByStep";
import DatabaseDocs from "./pages/DatabaseDocs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/step-by-step" element={<StepByStep />} />
          <Route path="/database-docs" element={<DatabaseDocs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
