import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "./pages/Landing";
import OnboardingModeSelect from "./pages/OnboardingModeSelect";
import OnboardingWizard from "./pages/OnboardingWizard";
import DocumentPreview from "./pages/DocumentPreview";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple Protected Route Wrapper
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  const sessionStart = localStorage.getItem('admin_session_start');

  // Optional: Check session expiry (e.g., 24 hours)
  if (isAuthenticated && sessionStart) {
    const hours = (new Date().getTime() - new Date(sessionStart).getTime()) / (1000 * 60 * 60);
    if (hours > 24) {
      localStorage.removeItem('admin_authenticated');
      return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
  }

  return <Navigate to="/admin/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding/mode" element={<OnboardingModeSelect />} />
            <Route path="/onboarding/wizard" element={<OnboardingWizard />} />
            <Route path="/onboarding/documents/:id" element={<DocumentPreview />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
