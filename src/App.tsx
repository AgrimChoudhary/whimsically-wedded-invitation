
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GuestProvider } from "./context/GuestContext";
import { AudioProvider } from "./context/AudioContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import Customize from "./pages/Customize";
import Invitation from "./pages/Invitation";
import GuestManagement from "./pages/GuestManagement";
import NotFound from "./pages/NotFound";
import "./components/custom-styles.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  // Add Hindi fonts
  useEffect(() => {
    // Add Poppins font
    const poppinsLink = document.createElement('link');
    poppinsLink.rel = 'stylesheet';
    poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(poppinsLink);
    
    // Add Devanagari fonts for Hindi text with better weights
    const devanagariLink = document.createElement('link');
    devanagariLink.rel = 'stylesheet';
    devanagariLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Hind:wght@400;500;600;700&family=Rozha+One&display=swap';
    document.head.appendChild(devanagariLink);
    
    return () => {
      document.head.removeChild(poppinsLink);
      document.head.removeChild(devanagariLink);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <GuestProvider>
              <AudioProvider isDisabledOnRoutes={["/guest-management", "/dashboard", "/templates", "/customize"]}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/templates" element={
                    <ProtectedRoute>
                      <Templates />
                    </ProtectedRoute>
                  } />
                  <Route path="/customize/:templateId" element={
                    <ProtectedRoute>
                      <Customize />
                    </ProtectedRoute>
                  } />
                  <Route path="/guest-management/:invitationId" element={
                    <ProtectedRoute>
                      <GuestManagement />
                    </ProtectedRoute>
                  } />
                  
                  {/* Public invitation routes */}
                  <Route path="/invitation" element={<Invitation />} />
                  <Route path="/invitation/:guestId" element={<Invitation />} />
                  <Route path="/i/:invitationId" element={<Invitation />} />
                  <Route path="/i/:invitationId/:guestId" element={<Invitation />} />
                  
                  {/* Support for legacy guest-specific routes */}
                  <Route path="/:guestId" element={<Navigate to={`/invitation/${window.location.pathname.split('/')[1]}`} replace />} />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AudioProvider>
            </GuestProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
