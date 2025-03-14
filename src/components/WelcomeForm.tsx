
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';

const WelcomeForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { guestName } = useGuest();
  const navigate = useNavigate();

  const handleOpenInvitation = () => {
    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      navigate('/invitation');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md px-6 py-8">
      <div className="glass-card w-full p-8 flex flex-col items-center space-y-6">
        <div className="text-center mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-playfair text-wedding-maroon mb-1">Welcome, {guestName}</h2>
          <p className="text-sm text-gray-600">Your special invitation awaits</p>
        </div>
        
        <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-wedding-gold font-dancing-script text-xl mb-4">
            Ananya & Arjun cordially invite you to celebrate their wedding
          </p>
        </div>
        
        <div 
          className="opacity-0 animate-fade-in-up" 
          style={{ animationDelay: '1s' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            onClick={handleOpenInvitation}
            disabled={isLoading}
            className={`relative overflow-hidden bg-wedding-blush text-wedding-maroon hover:bg-wedding-blush/90 px-8 py-2 rounded-full transition-all duration-300 ${
              isHovered ? 'shadow-gold-glow' : 'shadow-gold-soft'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-wedding-maroon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Opening
              </span>
            ) : (
              <span className="flex items-center">
                Open Invitation
                <Heart
                  size={16}
                  className={`ml-2 transition-transform duration-300 ${isHovered ? 'scale-125' : 'scale-100'}`}
                />
              </span>
            )}
            {isHovered && (
              <span 
                className="absolute inset-0 bg-wedding-gold/10 animate-pulse-soft rounded-full" 
                aria-hidden="true"
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeForm;
