
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GuestProvider } from "./context/GuestContext";
import Index from "./pages/Index";
import Invitation from "./pages/Invitation";
import NotFound from "./pages/NotFound";
import CustomizeForm from "./pages/CustomizeForm"; // Add this import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GuestProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/invitation" element={<Invitation />} />
            <Route path="/customize" element={<CustomizeForm />} /> {/* Add this route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GuestProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
