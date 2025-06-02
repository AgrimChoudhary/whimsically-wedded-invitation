
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "@/context/AudioContext";
import { GuestProvider } from "@/context/GuestContext";
import Index from "./pages/Index";
import GuestManagement from "./pages/GuestManagement";
import ManageEventsPage from "./pages/ManageEventsPage";
import Invitation from "./pages/Invitation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AudioProvider>
            <GuestProvider>
              <div className="App">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/guest-management" element={<GuestManagement />} />
                  <Route path="/manage-events" element={<ManageEventsPage />} />
                  <Route path="/invitation/:guestId" element={<Invitation />} />
                  <Route path="/:guestId" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </GuestProvider>
          </AudioProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
