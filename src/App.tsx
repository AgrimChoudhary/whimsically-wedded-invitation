
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import { GuestProvider } from './context/GuestContext';
import { Toaster } from "@/components/ui/sonner";
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Customize from './pages/Customize';
import Invitation from './pages/Invitation';
import GuestManagement from './pages/GuestManagement';
import Demo from './pages/Demo';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AudioProvider>
        <GuestProvider>
          <Index />
        </GuestProvider>
      </AudioProvider>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/demo",
    element: (
      <AudioProvider>
        <GuestProvider>
          <Demo />
        </GuestProvider>
      </AudioProvider>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/templates",
    element: (
      <ProtectedRoute>
        <Templates />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customize/:templateId",
    element: (
      <ProtectedRoute>
        <Customize />
      </ProtectedRoute>
    ),
  },
  {
    path: "/guest-management/:invitationId",
    element: (
      <ProtectedRoute>
        <GuestManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/invitation",
    element: (
      <AudioProvider>
        <GuestProvider>
          <Invitation />
        </GuestProvider>
      </AudioProvider>
    ),
  },
  {
    path: "/invitation/:guestId",
    element: (
      <AudioProvider>
        <GuestProvider>
          <Invitation />
        </GuestProvider>
      </AudioProvider>
    ),
  },
  {
    path: "/i/:invitationId",
    element: (
      <AudioProvider>
        <GuestProvider>
          <Invitation />
        </GuestProvider>
      </AudioProvider>
    ),
  },
  {
    path: "/i/:invitationId/:guestId",
    element: (
      <AudioProvider>
        <GuestProvider>
          <Invitation />
        </GuestProvider>
      </AudioProvider>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
