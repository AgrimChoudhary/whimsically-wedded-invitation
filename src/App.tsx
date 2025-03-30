
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GuestProvider } from "./context/GuestContext";
import { AudioProvider } from "./context/AudioContext";
import Index from "./pages/Index";
import Invitation from "./pages/Invitation";
import CustomizeForm from "./pages/CustomizeForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GuestProvider>
        <AudioProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/invitation" element={<Invitation />} />
              <Route path="/create" element={<CustomizeForm />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AudioProvider>
      </GuestProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
