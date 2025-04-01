
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, Calendar, Users, PenSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto bg-white/95 backdrop-blur-md border-t md:border-b border-wedding-gold/20 shadow-sm py-2 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="hidden md:flex items-center gap-2 text-wedding-maroon hover:text-wedding-maroon/80"
          >
            <Heart className="text-wedding-gold" size={20} />
            <span className="font-great-vibes text-xl">Wedding Invitation</span>
          </Link>
          
          <div className="flex items-center justify-around md:justify-end w-full md:w-auto gap-2 md:gap-6">
            <NavItem 
              to="/"
              icon={<Home size={20} />}
              label="Home"
              active={isActive('/')}
            />
            
            <NavItem 
              to="/customize"
              icon={<PenSquare size={20} />}
              label="Create"
              active={isActive('/customize')}
            />
            
            <NavItem 
              to="/invitations"
              icon={<Calendar size={20} />}
              label="Invitations"
              active={isActive('/invitations') || location.pathname.includes('/guests/')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-md transition-colors",
        active 
          ? "text-wedding-maroon bg-wedding-gold/10" 
          : "text-gray-500 hover:text-wedding-maroon hover:bg-wedding-gold/5"
      )}
    >
      {icon}
      <span className="text-xs md:text-sm">{label}</span>
    </Link>
  );
};

export default NavBar;
