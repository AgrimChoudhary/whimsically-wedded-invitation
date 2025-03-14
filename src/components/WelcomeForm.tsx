
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from 'lucide-react';

const WelcomeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { setGuestName } = useGuest();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    setGuestName(name.trim());
    
    // Simulate loading for better UX
    setTimeout(() => {
      navigate('/invitation');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md px-6 py-8">
      <form onSubmit={handleSubmit} className="glass-card w-full p-8 flex flex-col items-center space-y-6">
        <div className="text-center mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-medium text-wedding-maroon mb-1">Welcome</h2>
          <p className="text-sm text-gray-600">Please enter your name to continue</p>
        </div>
        
        <div className="w-full opacity-0 animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
          <div className="relative">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="bg-white bg-opacity-80 border-wedding-blush focus:border-wedding-gold focus:ring-wedding-gold px-4 py-3 rounded-md w-full transition-all duration-300"
              disabled={isLoading}
            />
            <Heart className="absolute right-3 top-1/2 transform -translate-y-1/2 text-wedding-blush h-4 w-4" />
          </div>
        </div>
        
        <div 
          className="opacity-0 animate-fade-in-up" 
          style={{ animationDelay: '1s' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            type="submit"
            disabled={!name.trim() || isLoading}
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
      </form>
    </div>
  );
};

export default WelcomeForm;
