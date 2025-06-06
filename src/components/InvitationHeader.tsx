
import React, { useState, useEffect } from 'react';
import { useGuest } from '../context/GuestContext';
import { FallingHearts, FireworksDisplay } from './AnimatedElements';
import { Sparkles, Star, Music } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedGuestName from './AnimatedGuestName';

// Couple names as placeholders for easy future changes
const GROOM_FIRST_NAME = "Sidharth";
const GROOM_LAST_NAME = "Malhotra";
const BRIDE_FIRST_NAME = "Kiara";
const BRIDE_LAST_NAME = "Advani";

interface InvitationHeaderProps {
  brideName?: string;
  groomName?: string;
  coupleImageUrl?: string;
}

const InvitationHeader: React.FC<InvitationHeaderProps> = ({ 
  brideName = BRIDE_FIRST_NAME, 
  groomName = GROOM_FIRST_NAME,
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

  return (
    <header className="relative w-full flex flex-col items-center pt-6 pb-4 sm:pt-8 sm:pb-6 overflow-hidden">
      <div className="w-full max-w-4xl px-4">
        {/* Enhanced Ganesha Section */}
        <div className="flex flex-col items-center mb-8 sm:mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {/* Religious Card with Ganesha */}
          <div className="relative group">
            {/* Outer glowing border */}
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 via-yellow-400/30 to-red-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-700 animate-pulse-soft"></div>
            
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-orange-50/80 to-yellow-50/80 backdrop-blur-md border-2 border-gradient-to-r border-orange-300/40 rounded-full p-6 sm:p-8 shadow-2xl">
              {/* Inner decorative border */}
              <div className="absolute inset-3 rounded-full border border-orange-200/50 animate-pulse-soft" style={{animationDelay: '0.5s'}}></div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-orange-400/30 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
              <div className="absolute -top-3 -right-1 w-3 h-3 bg-yellow-400/40 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
              <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-red-400/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
              <div className="absolute -bottom-3 -right-2 w-4 h-4 bg-orange-300/40 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
              
              {/* Ganesha Image */}
              <div className="relative">
                <img 
                  src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                  alt="Lord Ganesha" 
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain animate-glow-soft relative z-10"
                  loading="lazy"
                />
                
                {/* Decorative stars around Ganesha */}
                <Star 
                  size={14} 
                  className="absolute -top-2 -left-2 text-orange-400 animate-pulse-soft" 
                  fill="#FB923C" 
                  style={{animationDelay: '0.2s'}}
                />
                <Star 
                  size={12} 
                  className="absolute -top-1 -right-3 text-yellow-400 animate-pulse-soft" 
                  fill="#FBBF24" 
                  style={{animationDelay: '0.8s'}}
                />
                <Star 
                  size={16} 
                  className="absolute -bottom-1 -left-3 text-red-400 animate-pulse-soft" 
                  fill="#F87171" 
                  style={{animationDelay: '1.2s'}}
                />
                <Star 
                  size={13} 
                  className="absolute -bottom-2 -right-2 text-orange-300 animate-pulse-soft" 
                  fill="#FDBA74" 
                  style={{animationDelay: '0.6s'}}
                />
                
                {/* Divine light effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-200/10 via-yellow-200/20 to-orange-200/10 animate-pulse-soft"></div>
              </div>
            </div>
          </div>
          
          {/* Sanskrit Shloka */}
          <div className="text-center mt-4 relative">
            {/* Decorative line above */}
            <div className="mx-auto w-24 h-[1px] bg-gradient-to-r from-transparent via-orange-400/50 to-transparent mb-3"></div>
            
            <p className="font-devanagari text-sm sm:text-base text-orange-700 mb-1 leading-relaxed">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
            </p>
            <p className="font-devanagari text-sm sm:text-base text-orange-700 leading-relaxed">
              निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
            </p>
            
            {/* Decorative line below */}
            <div className="mx-auto w-24 h-[1px] bg-gradient-to-r from-transparent via-orange-400/50 to-transparent mt-3"></div>
            
            {/* Translation */}
            <p className="text-xs sm:text-sm text-orange-600/80 mt-2 italic font-poppins">
              "O Lord Ganesha, please remove all obstacles from our path"
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
                src={coupleImageUrl || "/lovable-uploads/f002c96a-d091-4373-9cc7-72487af38606.png"}
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
