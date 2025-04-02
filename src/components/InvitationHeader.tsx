
import React, { useState, useEffect } from 'react';
import { useGuest } from '../context/GuestContext';
import { FallingHearts, FireworksDisplay } from './AnimatedElements';
import { Sparkles, Star, Music } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvitationHeaderProps {
  brideName?: string;
  groomName?: string;
  coupleImageUrl?: string;
}

const InvitationHeader: React.FC<InvitationHeaderProps> = ({ 
  brideName = "Ananya", 
  groomName = "Arjun",
  coupleImageUrl
}) => {
  const { guestName } = useGuest();
  const [showHearts, setShowHearts] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const isMobile = useIsMobile();
  
  const triggerHearts = () => {
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 3000);
  };
  
  const triggerFireworks = () => {
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 3000);
  };
  
  useEffect(() => {
    // Auto-play visual effects on load for a more immersive experience
    const initialTimer = setTimeout(() => {
      triggerHearts();
      setTimeout(() => triggerFireworks(), 1500);
    }, 2000);
    
    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  // Default guest name if not provided
  const displayGuestName = guestName || "Guest Name";

  return (
    <header className="relative w-full flex flex-col items-center pt-6 pb-4 sm:pt-8 sm:pb-6 overflow-hidden">
      <div className="w-full max-w-4xl px-4">
        <div className="flex flex-col items-center mb-6 sm:mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative mb-3">
            <img 
              src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
              alt="Lord Ganesha" 
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain animate-glow-soft"
              loading="lazy"
            />
            <div className="absolute -inset-1 rounded-full border border-wedding-gold/30 animate-pulse-soft"></div>
            <div className="absolute -inset-3 rounded-full border border-wedding-gold/20" style={{animationDelay: '1s'}}></div>
            <Star 
              size={16} 
              className="absolute -top-1 -right-1 text-wedding-gold animate-pulse-soft" 
              fill="#D4AF37" 
            />
          </div>
          <div className="text-center">
            <p className="font-devanagari text-sm text-wedding-gold mb-1">॥ श्री वक्रतुण्ड महाकाय सूर्य कोटी समप्रभा। निर्विघ्नं कुरु मे देव सर्व-कार्येशु सर्वदा॥</p>
          </div>
        </div>
        
        <div className="text-center mb-6 sm:mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative inline-block">
            <h1 className="font-dancing-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-wedding-maroon mb-2 gold-highlight">
              Dear {displayGuestName},
            </h1>
            {!isMobile && (
              <div className="absolute -right-6 -top-6 opacity-30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="#FFDEE2" />
                </svg>
              </div>
            )}
          </div>
          <h2 className="font-great-vibes text-2xl sm:text-3xl text-wedding-gold animate-bounce-light">
            You're Cordially Invited!
          </h2>
        </div>
        
        <div 
          className="text-center relative opacity-0 animate-fade-in-up cursor-pointer"
          style={{ animationDelay: '0.9s' }}
          onClick={() => {
            triggerHearts();
            triggerFireworks();
          }}
          title="Click for a surprise!"
        >
          <div className="flex flex-col items-center">
            <div className="relative mb-4 sm:mb-6">
              <img 
                src={coupleImageUrl || "/lovable-uploads/f002c96a-d091-4373-9cc7-72487af38606.png"}
                alt={`${brideName} and ${groomName}`}
                className="w-40 h-auto sm:w-48 md:w-56 lg:w-64 object-contain animate-float"
                loading="lazy"
              />
              <div className="absolute -inset-2 rounded-full border border-wedding-gold/10"></div>
            </div>
            
            <h2 className="font-great-vibes text-3xl sm:text-4xl md:text-5xl text-wedding-maroon leading-tight mt-2">
              <span className="relative">
                {brideName} <span className="inline-block mx-2">&</span> {groomName}
                {!isMobile && (
                  <>
                    <Sparkles size={18} className="absolute -top-4 -left-4 text-wedding-gold" />
                    <Sparkles size={18} className="absolute -top-4 -right-4 text-wedding-gold" />
                  </>
                )}
              </span>
            </h2>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent to-wedding-gold/70"></div>
            <div className="w-3 h-3 rounded-full bg-wedding-gold/20 relative">
              <div className="absolute inset-0.5 rounded-full bg-wedding-gold/40 animate-pulse-soft"></div>
            </div>
            <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-l from-transparent to-wedding-gold/70"></div>
          </div>
          
          <p className="text-xs text-gray-400 mt-4 animate-pulse-soft">Click for a surprise</p>
        </div>
      </div>
      
      <FallingHearts isActive={showHearts} />
      <FireworksDisplay isActive={showFireworks} />
    </header>
  );
};

export default InvitationHeader;
