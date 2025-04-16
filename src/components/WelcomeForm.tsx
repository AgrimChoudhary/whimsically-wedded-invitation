
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import { useAudio } from '../context/AudioContext';
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Calendar, Volume2, VolumeX } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const WelcomeForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showIcon, setShowIcon] = useState(0);
  const [brideName, setBrideName] = useState("भावना");
  const [groomName, setGroomName] = useState("उमाशंकर");
  const [weddingDate, setWeddingDate] = useState("April 29, 2025");
  const { isPlaying, toggleMusic } = useAudio();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const icons = [
    <Heart key="heart" className="text-wedding-blush" />,
    <Sparkles key="sparkles" className="text-wedding-gold" />,
    <Calendar key="calendar" className="text-wedding-maroon" />
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon((prev) => (prev + 1) % icons.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenInvitation = () => {
    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      navigate('/invitation');
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md px-6 py-8">
      <div className="glass-card w-full p-8 flex flex-col items-center space-y-6 relative overflow-hidden border-wedding-gold/30">
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-wedding-gold/50 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-wedding-gold/50 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-wedding-gold/50 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-wedding-gold/50 rounded-br-lg"></div>
        
        {/* Hindu wedding decorative elements */}
        <div className="absolute left-2 top-2 w-12 h-12 opacity-20">
          <img src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" alt="Decorative element" className="w-full h-full" />
        </div>
        <div className="absolute right-2 top-2 w-12 h-12 opacity-20">
          <img src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" alt="Decorative element" className="w-full h-full" />
        </div>
        
        {/* Floating icons */}
        <div className="absolute -left-2 top-1/4 opacity-20 animate-float">
          <Heart size={24} className="text-wedding-blush" />
        </div>
        <div className="absolute -right-2 top-1/3 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles size={20} className="text-wedding-gold" />
        </div>
        <div className="absolute left-1/4 -bottom-2 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <Heart size={18} className="text-wedding-blush" />
        </div>
        
        <div className="text-center mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-wedding-gold/70"></div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-wedding-gold/30 animate-pulse-soft">
              {icons[showIcon]}
            </div>
            <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-wedding-gold/70"></div>
          </div>
          <h2 className="text-2xl font-playfair text-wedding-maroon mb-1">Welcome</h2>
          <p className="text-sm text-gray-600">Your special invitation awaits</p>
        </div>
        
        <div className="text-center opacity-0 animate-fade-in-up relative" style={{ animationDelay: '0.6s' }}>
          <div className="absolute -left-6 -top-6 text-6xl text-wedding-gold/10 font-great-vibes">"</div>
          <p className="text-wedding-gold font-devanagari text-xl md:text-2xl mb-4 px-4 relative z-10">
            {groomName} & {brideName} cordially invite you to celebrate their wedding
          </p>
          <div className="absolute -right-6 -bottom-6 text-6xl text-wedding-gold/10 font-great-vibes">"</div>
        </div>
        
        {/* Decorative ribbon effect */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}></div>
        
        <div 
          className="opacity-0 animate-fade-in-up z-10" 
          style={{ animationDelay: '1s' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <Button
            onClick={handleOpenInvitation}
            disabled={isLoading}
            className={`relative overflow-hidden bg-wedding-blush text-wedding-maroon hover:bg-wedding-blush/90 px-8 py-6 rounded-full transition-all duration-300 ${
              isHovered ? 'shadow-gold-glow transform scale-105' : 'shadow-gold-soft'
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
              <span className="flex items-center font-medium text-base">
                {isMobile ? 'Open' : 'Open Invitation'}
                <Heart
                  size={isMobile ? 18 : 20}
                  className={`ml-2 transition-transform duration-300 ${isHovered ? 'scale-125 text-red-500' : 'scale-100'}`}
                  fill={isHovered ? "#FFC0CB" : "none"}
                />
              </span>
            )}
            {isHovered && (
              <>
                <span 
                  className="absolute inset-0 bg-wedding-gold/10 animate-pulse-soft rounded-full" 
                  aria-hidden="true"
                />
                <span className="absolute -inset-1 bg-wedding-gold/5 rounded-full blur-md"></span>
              </>
            )}
          </Button>
        </div>
        
        {/* Music control button */}
        <div className="absolute bottom-3 right-3">
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full bg-wedding-cream/80 border border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream transition-colors duration-300"
          >
            {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
        
        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
        </div>
      </div>
      
      {/* Date teaser */}
      <div className="mt-8 text-center opacity-0 animate-fade-in" style={{ animationDelay: '1.4s' }}>
        <p className="text-sm text-gray-500 font-dancing-script mb-3">
          <span className="inline-block px-3 py-1 rounded-full bg-wedding-cream/70 text-wedding-maroon border border-wedding-gold/20">
            Save the Date: {weddingDate}
          </span>
        </p>
      </div>
    </div>
  );
};

export default WelcomeForm;
