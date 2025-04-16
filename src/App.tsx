
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GuestProvider } from "./context/GuestContext";
import { AudioProvider } from "./context/AudioContext";
import Index from "./pages/Index";
import Invitation from "./pages/Invitation";
import NotFound from "./pages/NotFound";

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
    
    // Add Kruti Dev font for Hindi text
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @font-face {
        font-family: 'Kruti Dev';
        src: url('https://fonts.gstatic.com/s/mukta/v8/iJWHBXyXfDDVXbEyjmmT.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      
      .font-kruti {
        font-family: 'Kruti Dev', 'Poppins', sans-serif;
      }
      
      .font-devanagari {
        font-family: 'Noto Sans Devanagari', 'Poppins', sans-serif;
      }
      
      .font-poppins {
        font-family: 'Poppins', sans-serif;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Add Noto Sans Devanagari for proper Hindi rendering
    const devanagariLink = document.createElement('link');
    devanagariLink.rel = 'stylesheet';
    devanagariLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap';
    document.head.appendChild(devanagariLink);
    
    return () => {
      document.head.removeChild(poppinsLink);
      document.head.removeChild(styleElement);
      document.head.removeChild(devanagariLink);
    };
  }, []);

  return (
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AudioProvider>
        </GuestProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
