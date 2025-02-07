
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
import ERDiagram from "./pages/ERDiagram";
import ComponentsDocs from "./pages/ComponentsDocs";
import Admin from "./pages/Admin";
import AdminLayout from "./components/admin/AdminLayout";
import ImageManager from "./components/admin/ImageManager";

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
          <Route path="/er-diagram" element={<ERDiagram />} />
          <Route path="/components-docs" element={<ComponentsDocs />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<div>Dashboard Admin</div>} />
            <Route path="users" element={<div>Gerenciamento de Usuários</div>} />
            <Route path="landing-pages" element={<div>Gerenciamento de Landing Pages</div>} />
            <Route path="templates" element={<div>Gerenciamento de Templates</div>} />
            <Route path="swipe-files" element={<div>Gerenciamento de Swipe Files</div>} />
            <Route path="subscriptions" element={<div>Gerenciamento de Assinaturas</div>} />
            <Route path="settings" element={<div>Configurações</div>} />
            <Route path="images" element={<ImageManager />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
