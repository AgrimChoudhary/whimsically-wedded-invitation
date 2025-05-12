import React, { useState, useEffect } from 'react';
import { useGuest } from '../context/GuestContext';
import { FallingHearts, FireworksDisplay } from './AnimatedElements';
import { Sparkles, Star, Music } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedGuestName from './AnimatedGuestName';
import {
  GROOM_FIRST_NAME,
  GROOM_LAST_NAME,
  BRIDE_FIRST_NAME,
  BRIDE_LAST_NAME,
  COUPLE_HEADER_IMAGE,
  WEDDING_DATE
} from '@/config/weddingConfig';

// Remove hardcoded values and use the imported ones
// const GROOM_LAST_NAME = "Kohli";
// const BRIDE_LAST_NAME = "Sharma";
// const WEDDING_DATE = "December 11, 2017";

interface InvitationHeaderProps {
  brideName?: string;
  groomName?: string;
  coupleImageUrl?: string;
}

const InvitationHeader: React.FC<InvitationHeaderProps> = ({ 
  brideName = BRIDE_FIRST_NAME, 
  groomName = GROOM_FIRST_NAME,
  coupleImageUrl = COUPLE_HEADER_IMAGE
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
            <p className="font-devanagari text-sm text-wedding-gold mb-1">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
              निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
            </p>
          </div>
        </div>
        
        <div className="text-center mb-6 sm:mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative inline-block">
            <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-wedding-maroon mb-2 gold-highlight">
              Welcome{' '}
              <AnimatedGuestName 
                name={guestName} 
                fallback="Guest Name"
                animationType="sparkle"
                className="font-poppins relative inline-block"
                delay={800}
              />
            </h1>
            {!isMobile && (
              <div className="absolute -right-6 -top-6 opacity-30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="#FFDEE2" />
                </svg>
              </div>
            )}
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl text-wedding-gold animate-bounce-light">
            You are cordially invited!
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
                src={coupleImageUrl}
                alt={`${groomName} and ${brideName}`}
                className="w-40 h-auto sm:w-48 md:w-56 lg:w-64 object-contain animate-floating"
                loading="lazy"
              />
              <div className="absolute -inset-2 rounded-full border border-wedding-gold/10"></div>
            </div>
            
            <div className="mt-4 sm:mb-6">
              <h2 className="relative font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-wedding-maroon leading-tight mt-2 mb-2">
                <span className="relative inline-block">
                  {groomName}
                  <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/40 to-transparent"></div>
                </span>
                
                <span className="relative inline-block mx-2 sm:mx-3 md:mx-4 px-2 sm:px-3 transform -rotate-6">
                  <span className="text-wedding-gold shimmer-text">&</span>
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-wedding-gold/10"></div>
                </span>
                
                <span className="relative inline-block">
                  {brideName}
                  <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/40 to-transparent"></div>
                </span>
                
                {!isMobile && (
                  <>
                    <Sparkles size={20} className="absolute -top-6 left-1/4 text-wedding-gold animate-pulse-soft" />
                    <Sparkles size={20} className="absolute -top-6 right-1/4 text-wedding-gold animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </h2>
              
              <div className="text-center text-sm sm:text-base text-wedding-gold/80 font-dancing-script tracking-wider uppercase my-2">
                <span className="relative px-4">
                  <span className="relative z-10">Wedding Invitation</span>
                  <div className="absolute inset-0 bg-wedding-cream/30 rounded-full blur-sm"></div>
                </span>
              </div>
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
      </div>
      
      <FallingHearts isActive={showHearts} />
      <FireworksDisplay isActive={showFireworks} />
    </header>
  );
};

export default InvitationHeader;
