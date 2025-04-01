
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GuestProvider } from "./context/GuestContext";
import { AudioProvider } from "./context/AudioContext";
import NavBar from "./components/NavBar";
import Index from "./pages/Index";
import Invitation from "./pages/Invitation";
import NotFound from "./pages/NotFound";
import CustomizeForm from "./pages/CustomizeForm";
import InvitationList from "./pages/InvitationList";
import GuestManagement from "./pages/GuestManagement";

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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GuestProvider>
          <AudioProvider>
            <BrowserRouter>
              <div className="pb-16 md:pb-0 md:pt-16">
                <NavBar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/invitation" element={<Invitation />} />
                  <Route path="/invitation/:id" element={<Invitation />} />
                  <Route path="/customize" element={<CustomizeForm />} />
                  <Route path="/invitations" element={<InvitationList />} />
                  <Route path="/guests/:invitationId" element={<GuestManagement />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </AudioProvider>
        </GuestProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
