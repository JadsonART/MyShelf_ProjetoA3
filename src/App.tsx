import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Biblioteca from "./pages/Biblioteca";
import ListaDesejos from "./pages/ListaDesejos";
import Buscar from "./pages/Buscar";
import Perfil from "./pages/Perfil";
import Preferencias from "./pages/Preferencias";
import LivroDetalhes from "./pages/LivroDetalhes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/biblioteca"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Biblioteca />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lista-desejos"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ListaDesejos />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buscar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Buscar />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Perfil />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferencias"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Preferencias />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/livro/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LivroDetalhes />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
