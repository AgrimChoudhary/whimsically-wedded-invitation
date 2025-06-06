
import React, { useState, useEffect } from 'react';
import { useGuest } from '../context/GuestContext';
import { FallingHearts, FireworksDisplay } from './AnimatedElements';
import { Sparkles, Star, Music, Crown, Heart } from 'lucide-react';
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
  const [ganeshaBlessings, setGaneshaBlessings] = useState(false);
  const [coupleGlow, setCoupleGlow] = useState(false);
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
      setTimeout(() => {
        setGaneshaBlessings(true);
        setCoupleGlow(true);
      }, 1000);
    }, 2000);
    
    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <header className="relative w-full flex flex-col items-center pt-6 pb-4 sm:pt-8 sm:pb-6 overflow-hidden">
      {/* Enhanced background with modern gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-cream via-wedding-blush/10 to-wedding-cream opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
      
      {/* Floating decorative elements for Gen-Z appeal */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-wedding-gold/20 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-16 w-3 h-3 bg-wedding-blush/30 rotate-45 animate-bounce" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-32 left-8 w-5 h-5 border border-wedding-gold/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="w-full max-w-4xl px-4 relative z-10">
        {/* Enhanced Ganesha Section with modern card design */}
        <div className="flex flex-col items-center mb-8 sm:mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative mb-4 group">
            {/* Modern glassmorphism card for Ganesha */}
            <div className={`relative p-6 rounded-3xl backdrop-blur-lg bg-gradient-to-br from-white/40 via-wedding-cream/30 to-wedding-blush/20 border border-white/30 shadow-2xl transition-all duration-1000 ${ganeshaBlessings ? 'shadow-wedding-gold/40 scale-105' : ''}`}>
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-wedding-gold/20 via-wedding-maroon/10 to-wedding-gold/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
              
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-wedding-gold/40 rounded-tl-xl"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-wedding-gold/40 rounded-tr-xl"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-wedding-gold/40 rounded-bl-xl"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-wedding-gold/40 rounded-br-xl"></div>
              
              {/* Floating icons around Ganesha */}
              <Crown size={16} className="absolute -top-2 -left-2 text-wedding-gold/60 animate-pulse" />
              <Star size={14} className="absolute -top-2 -right-2 text-wedding-maroon/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Heart size={12} className="absolute -bottom-2 -left-2 text-wedding-blush/60 animate-pulse" style={{ animationDelay: '1s' }} />
              <Sparkles size={14} className="absolute -bottom-2 -right-2 text-wedding-gold/60 animate-pulse" style={{ animationDelay: '1.5s' }} />
              
              <div className="relative z-10">
                <img 
                  src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                  alt="Lord Ganesha" 
                  className={`w-28 h-28 sm:w-32 sm:h-32 object-contain transition-all duration-1000 ${ganeshaBlessings ? 'animate-glow-soft drop-shadow-2xl' : ''}`}
                  loading="lazy"
                />
                
                {/* Blessing rays effect */}
                {ganeshaBlessings && (
                  <div className="absolute inset-0 rounded-full">
                    <div className="absolute inset-0 rounded-full bg-wedding-gold/10 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full bg-wedding-gold/5 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Enhanced Sanskrit shloka with modern typography */}
          <div className="text-center relative">
            <div className="relative inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-wedding-cream/60 via-white/50 to-wedding-cream/60 backdrop-blur-sm border border-wedding-gold/20 shadow-lg">
              <p className="font-devanagari text-sm sm:text-base text-wedding-maroon leading-relaxed">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
              </p>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-wedding-gold/60 to-transparent rounded-full"></div>
            </div>
            <p className="text-xs text-wedding-gold/80 mt-2 font-medium">श्री गणेशाय नमः</p>
          </div>
        </div>
        
        {/* Enhanced Welcome Message with personalized touch */}
        <div className="text-center mb-8 sm:mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative inline-block">
            {/* Decorative frame for welcome message */}
            <div className="absolute -inset-4 bg-gradient-to-r from-wedding-gold/10 via-wedding-blush/10 to-wedding-gold/10 rounded-2xl blur-lg"></div>
            
            <div className="relative">
              <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-wedding-maroon mb-3 leading-tight">
                <span className="block text-2xl sm:text-3xl text-wedding-gold/80 font-dancing-script mb-2">Namaste & Welcome</span>
                <AnimatedGuestName 
                  name={guestName} 
                  fallback="प्रिय अतिथि"
                  animationType="sparkle"
                  className="font-poppins relative inline-block bg-gradient-to-r from-wedding-maroon to-wedding-gold bg-clip-text text-transparent"
                  delay={800}
                />
                <span className="block text-lg sm:text-xl text-wedding-gold/70 font-dancing-script mt-2">जी</span>
              </h1>
              
              {/* Floating elements around name */}
              {!isMobile && (
                <>
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-30">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wedding-gold/20 to-wedding-blush/20 flex items-center justify-center animate-pulse">
                      🙏
                    </div>
                  </div>
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-30">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wedding-maroon/20 to-wedding-gold/20 flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                      ✨
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl text-wedding-gold leading-relaxed">
              <span className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-wedding-cream/40 to-wedding-blush/30 backdrop-blur-sm border border-wedding-gold/20">
                आपका हार्दिक स्वागत है!
              </span>
            </h2>
            <p className="text-sm text-wedding-maroon/70 mt-2 font-medium">You are cordially invited to our celebration</p>
          </div>
        </div>
        
        {/* Enhanced Couple Section with luxury card design */}
        <div 
          className="text-center relative opacity-0 animate-fade-in-up cursor-pointer group"
          style={{ animationDelay: '0.9s' }}
          onClick={() => {
            triggerHearts();
            triggerFireworks();
            setCoupleGlow(true);
            setTimeout(() => setCoupleGlow(false), 2000);
          }}
          title="✨ Click for blessings! ✨"
        >
          <div className="flex flex-col items-center">
            {/* Luxury frame for couple image */}
            <div className="relative mb-6 sm:mb-8">
              <div className={`relative p-4 rounded-3xl bg-gradient-to-br from-white/50 via-wedding-cream/40 to-wedding-blush/30 backdrop-blur-lg border-2 border-wedding-gold/30 shadow-2xl transition-all duration-1000 group-hover:shadow-wedding-gold/50 group-hover:scale-105 ${coupleGlow ? 'shadow-wedding-gold/60 scale-110' : ''}`}>
                {/* Running glow border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-wedding-gold/30 via-wedding-maroon/20 to-wedding-gold/30 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                
                {/* Corner crown decorations */}
                <Crown size={20} className="absolute -top-3 -left-3 text-wedding-gold/70 animate-pulse" />
                <Crown size={20} className="absolute -top-3 -right-3 text-wedding-gold/70 animate-pulse" style={{ animationDelay: '0.5s' }} />
                
                <img 
                  src={coupleImageUrl || "/lovable-uploads/f002c96a-d091-4373-9cc7-72487af38606.png"}
                  alt={`${groomName} and ${brideName}`}
                  className="w-44 h-auto sm:w-52 md:w-60 lg:w-72 object-contain transition-all duration-700 group-hover:drop-shadow-2xl"
                  loading="lazy"
                />
                
                {/* Royal decorative border */}
                <div className="absolute inset-2 rounded-2xl border border-wedding-gold/20 pointer-events-none"></div>
                
                {/* Floating hearts around couple */}
                <Heart size={16} className="absolute top-4 left-4 text-wedding-blush/60 animate-pulse opacity-70" />
                <Heart size={14} className="absolute top-6 right-6 text-wedding-blush/60 animate-pulse opacity-70" style={{ animationDelay: '1s' }} />
                <Heart size={12} className="absolute bottom-8 left-6 text-wedding-blush/60 animate-pulse opacity-70" style={{ animationDelay: '2s' }} />
                <Heart size={16} className="absolute bottom-6 right-4 text-wedding-blush/60 animate-pulse opacity-70" style={{ animationDelay: '1.5s' }} />
              </div>
            </div>
            
            {/* Enhanced couple names with modern styling */}
            <div className="mt-4 sm:mb-6">
              <h2 className="relative font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-wedding-maroon leading-tight mt-2 mb-4">
                <span className="relative inline-block group-hover:animate-pulse">
                  {groomName}
                  <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-wedding-gold/50 to-transparent rounded-full"></div>
                  <Sparkles size={isMobile ? 16 : 20} className="absolute -top-4 -right-4 text-wedding-gold/70 animate-pulse" />
                </span>
                
                <span className="relative inline-block mx-3 sm:mx-4 md:mx-6 px-3 sm:px-4 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                  <span className="text-wedding-gold shimmer-text text-5xl sm:text-6xl md:text-7xl">&</span>
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-wedding-gold/20 via-wedding-gold/60 to-wedding-gold/20 rounded-full"></div>
                </span>
                
                <span className="relative inline-block group-hover:animate-pulse">
                  {brideName}
                  <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-wedding-gold/50 to-transparent rounded-full"></div>
                  <Sparkles size={isMobile ? 16 : 20} className="absolute -top-4 -left-4 text-wedding-gold/70 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </span>
              </h2>
              
              {/* Enhanced invitation tag */}
              <div className="text-center my-4">
                <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-wedding-gold/20 via-wedding-cream/40 to-wedding-gold/20 backdrop-blur-sm border border-wedding-gold/30 shadow-lg">
                  <span className="text-sm sm:text-base text-wedding-maroon font-dancing-script tracking-wider uppercase font-semibold">
                    💑 Wedding Invitation 💑
                  </span>
                </div>
              </div>
            </div>
            
            {/* Enhanced decorative separator */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-[2px] w-20 sm:w-28 bg-gradient-to-r from-transparent to-wedding-gold/70 rounded-full"></div>
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-wedding-gold/40 animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-wedding-gold/20 animate-ping"></div>
              </div>
              <div className="h-[2px] w-20 sm:w-28 bg-gradient-to-l from-transparent to-wedding-gold/70 rounded-full"></div>
            </div>
            
            {/* Interactive hint with Gen-Z touch */}
            <div className="mt-6 group-hover:scale-110 transition-transform duration-300">
              <p className="text-xs text-wedding-gold/70 animate-pulse-soft flex items-center gap-2">
                <span>✨</span>
                <span>Tap for magical blessings</span>
                <span>✨</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <FallingHearts isActive={showHearts} />
      <FireworksDisplay isActive={showFireworks} />
    </header>
  );
};

export default InvitationHeader;
