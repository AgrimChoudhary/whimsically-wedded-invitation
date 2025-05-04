
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Settings, User } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Determine current path for active styling
  const isPath = (path: string) => location.pathname === path;
  
  // Mobile-friendly footer styling
  const mobileButtonClass = "flex flex-1 flex-col items-center justify-center py-2 rounded-none";
  
  return (
    <footer className="w-full py-8 mt-auto border-t border-wedding-gold/10 bg-wedding-cream/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {isMobile ? (
          // Mobile footer with fixed bottom navigation
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-wedding-gold/20 flex justify-around items-center shadow-md">
            <Button
              variant={isPath('/') ? "default" : "ghost"}
              className={`${mobileButtonClass} ${isPath('/') ? 'text-wedding-maroon bg-wedding-cream' : 'text-gray-500'}`}
              onClick={() => navigate('/')}
            >
              <Heart size={20} className="mb-1" />
              <span className="text-xs">Welcome</span>
            </Button>
            
            <Button
              variant={isPath('/invitation') ? "default" : "ghost"}
              className={`${mobileButtonClass} ${isPath('/invitation') ? 'text-wedding-maroon bg-wedding-cream' : 'text-gray-500'}`}
              onClick={() => navigate('/invitation')}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mb-1"
              >
                <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18" />
                <path d="M8 9h8" />
                <path d="M8 15h8" />
                <path d="M11 12v-3" />
                <path d="M16 12v-3" />
                <path d="M14 12v-3" />
                <path d="M8 12v-3" />
              </svg>
              <span className="text-xs">Invitation</span>
            </Button>
            
            <Button
              variant={isPath('/guest-management') ? "default" : "ghost"}
              className={`${mobileButtonClass} ${isPath('/guest-management') ? 'text-wedding-maroon bg-wedding-cream' : 'text-gray-500'}`}
              onClick={() => navigate('/guest-management')}
            >
              <User size={20} className="mb-1" />
              <span className="text-xs">Guests</span>
            </Button>
          </div>
        ) : (
          // Desktop footer
          <div className="text-center">
            <p className="text-sm text-gray-500 font-dancing-script text-lg">
              With love, Umashankar &amp; Bhavana
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Powered by Utsavy
            </p>
          </div>
        )}
      </div>
      
      {/* Add padding at the bottom for mobile to account for fixed navigation */}
      {isMobile && <div className="h-16"></div>}
    </footer>
  );
};

export default Footer;
