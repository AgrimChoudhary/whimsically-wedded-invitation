
import React, { useState, useEffect } from 'react';
import { useGuest } from '../context/GuestContext';
import { FallingHearts, FireworksDisplay } from './AnimatedElements';
import { Sparkles, Star, Music, Heart, Crown } from 'lucide-react';
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
        <div className="flex flex-col items-center mb-10 sm:mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {/* Religious Card with Ganesha */}
          <div className="relative group">
            {/* Multiple glowing layers */}
            <div className="absolute -inset-6 bg-gradient-to-r from-orange-400/20 via-yellow-400/30 to-red-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-1000 animate-pulse-soft"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-300/30 via-yellow-300/40 to-orange-300/30 rounded-full blur-lg transition-all duration-700"></div>
            
            {/* Main divine card */}
            <div className="relative luxury-frame bg-gradient-to-br from-orange-50/90 via-yellow-50/95 to-orange-50/90 backdrop-blur-lg rounded-full p-8 sm:p-10 divine-glow">
              {/* Sacred geometric pattern */}
              <div className="absolute inset-4 rounded-full border-2 border-orange-200/60 animate-pulse-soft" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute inset-6 rounded-full border border-yellow-300/40 animate-pulse-soft" style={{animationDelay: '1s'}}></div>
              
              {/* Floating Om symbols */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-orange-400/40 rounded-full flex items-center justify-center animate-float text-orange-600" style={{animationDelay: '0s'}}>
                <span className="text-xs">ॐ</span>
              </div>
              <div className="absolute -top-4 -right-2 w-5 h-5 bg-yellow-400/50 rounded-full flex items-center justify-center animate-float text-yellow-700" style={{animationDelay: '1s'}}>
                <span className="text-xs">ॐ</span>
              </div>
              <div className="absolute -bottom-3 -left-2 w-5 h-5 bg-red-400/40 rounded-full flex items-center justify-center animate-float text-red-600" style={{animationDelay: '2s'}}>
                <span className="text-xs">ॐ</span>
              </div>
              <div className="absolute -bottom-4 -right-3 w-6 h-6 bg-orange-300/50 rounded-full flex items-center justify-center animate-float text-orange-600" style={{animationDelay: '1.5s'}}>
                <span className="text-xs">ॐ</span>
              </div>
              
              {/* Ganesha Image with enhanced effects */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-yellow-200/30 to-orange-200/20 rounded-full animate-pulse-soft blur-sm"></div>
                <img 
                  src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                  alt="Lord Ganesha" 
                  className="w-32 h-32 sm:w-36 sm:h-36 object-contain animate-floating relative z-10"
                  loading="lazy"
                />
                
                {/* Enhanced decorative elements */}
                <Star 
                  size={16} 
                  className="absolute -top-3 -left-3 text-orange-400 animate-pulse-soft" 
                  fill="#FB923C" 
                  style={{animationDelay: '0.2s'}}
                />
                <Crown 
                  size={14} 
                  className="absolute -top-2 -right-4 text-yellow-500 animate-pulse-soft" 
                  fill="#EAB308" 
                  style={{animationDelay: '0.8s'}}
                />
                <Heart 
                  size={18} 
                  className="absolute -bottom-2 -left-4 text-red-400 animate-pulse-soft" 
                  fill="#F87171" 
                  style={{animationDelay: '1.2s'}}
                />
                <Star 
                  size={15} 
                  className="absolute -bottom-3 -right-3 text-orange-300 animate-pulse-soft" 
                  fill="#FDBA74" 
                  style={{animationDelay: '0.6s'}}
                />
              </div>
            </div>
          </div>
          
          {/* Enhanced Sanskrit Shloka */}
          <div className="text-center mt-6 relative max-w-md">
            {/* Decorative line above */}
            <div className="mx-auto w-32 h-[2px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent blur-sm"></div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50/60 to-yellow-50/60 backdrop-blur-sm rounded-lg p-4 border border-orange-200/30">
              <p className="font-hindi text-base sm:text-lg text-orange-800 mb-2 leading-relaxed font-medium">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
              </p>
              <p className="font-hindi text-base sm:text-lg text-orange-800 leading-relaxed font-medium">
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
              </p>
            </div>
            
            {/* Decorative line below */}
            <div className="mx-auto w-32 h-[2px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent mt-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent blur-sm"></div>
            </div>
            
            {/* Translation */}
            <p className="text-sm sm:text-base text-orange-700/90 mt-3 italic font-medium">
              "O Lord Ganesha, please remove all obstacles from our path"
            </p>
          </div>
        </div>
        
        {/* Enhanced Guest Welcome Section */}
        <div className="text-center mb-8 sm:mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative inline-block luxury-frame p-6 sm:p-8 rounded-2xl">
            <div className="absolute -inset-2 bg-gradient-to-r from-wedding-gold/20 via-wedding-blush/20 to-wedding-gold/20 rounded-2xl blur-lg animate-pulse-soft"></div>
            
            <h1 className="relative font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-wedding-maroon mb-3 gold-highlight">
              Welcome{' '}
              <span className="relative inline-block">
                <AnimatedGuestName 
                  name={guestName} 
                  fallback="Dear Guest"
                  animationType="sparkle"
                  className="font-great-vibes relative inline-block text-wedding-gold shimmer-text"
                  delay={800}
                />
                {!isMobile && (
                  <Sparkles 
                    size={24} 
                    className="absolute -top-4 -right-6 text-wedding-gold animate-sparkle" 
                  />
                )}
              </span>
            </h1>
            
            <h2 className="font-dancing-script text-xl sm:text-2xl md:text-3xl text-wedding-gold animate-bounce-light mt-2">
              You are cordially invited to our celebration!
            </h2>
            
            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="h-[1px] w-20 sm:w-32 bg-gradient-to-r from-transparent to-wedding-gold/70"></div>
              <Heart size={16} className="text-wedding-gold/60 animate-pulse-soft" fill="currentColor" />
              <div className="h-[1px] w-20 sm:w-32 bg-gradient-to-l from-transparent to-wedding-gold/70"></div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Couple Section */}
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
            {/* Couple Image with Luxury Frame */}
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-wedding-gold/30 via-wedding-blush/40 to-wedding-gold/30 rounded-full blur-xl animate-pulse-soft"></div>
              <div className="relative luxury-frame rounded-full p-4">
                <img 
                  src={coupleImageUrl || "/lovable-uploads/f002c96a-d091-4373-9cc7-72487af38606.png"}
                  alt={`${groomName} and ${brideName}`}
                  className="w-44 h-auto sm:w-52 md:w-60 lg:w-72 object-contain animate-floating relative z-10"
                  loading="lazy"
                />
                
                {/* Floating hearts around couple */}
                {!isMobile && (
                  <>
                    <Heart size={20} className="absolute -top-4 -left-4 text-wedding-blush animate-float" fill="currentColor" style={{animationDelay: '0s'}} />
                    <Heart size={16} className="absolute -top-2 -right-6 text-wedding-gold animate-float" fill="currentColor" style={{animationDelay: '1s'}} />
                    <Heart size={18} className="absolute -bottom-4 -left-6 text-wedding-blush animate-float" fill="currentColor" style={{animationDelay: '2s'}} />
                    <Heart size={14} className="absolute -bottom-2 -right-4 text-wedding-gold animate-float" fill="currentColor" style={{animationDelay: '1.5s'}} />
                  </>
                )}
              </div>
            </div>
            
            {/* Enhanced Couple Names */}
            <div className="mt-4 sm:mb-6">
              <h2 className="relative font-great-vibes text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-wedding-maroon leading-tight mt-2 mb-4">
                <span className="relative inline-block transform hover:scale-105 transition-transform duration-300">
                  {groomName}
                  <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-wedding-gold/50 to-transparent"></div>
                </span>
                
                <span className="relative inline-block mx-3 sm:mx-4 md:mx-6 px-3 sm:px-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <span className="text-wedding-gold shimmer-text text-6xl sm:text-7xl md:text-8xl">&</span>
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-wedding-gold/20"></div>
                  {!isMobile && (
                    <>
                      <Sparkles size={16} className="absolute -top-4 -left-2 text-wedding-gold animate-sparkle" />
                      <Sparkles size={16} className="absolute -bottom-4 -right-2 text-wedding-gold animate-sparkle" style={{animationDelay: '0.5s'}} />
                    </>
                  )}
                </span>
                
                <span className="relative inline-block transform hover:scale-105 transition-transform duration-300">
                  {brideName}
                  <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-wedding-gold/50 to-transparent"></div>
                </span>
                
                {!isMobile && (
                  <>
                    <Crown size={24} className="absolute -top-8 left-1/4 text-wedding-gold animate-pulse-soft" />
                    <Crown size={24} className="absolute -top-8 right-1/4 text-wedding-gold animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </h2>
              
              <div className="text-center text-base sm:text-lg text-wedding-gold/90 font-dancing-script tracking-wider uppercase my-3">
                <span className="relative px-6">
                  <span className="relative z-10 font-semibold">Wedding Invitation</span>
                  <div className="absolute inset-0 bg-wedding-cream/40 rounded-full blur-md"></div>
                </span>
              </div>
            </div>
            
            {/* Enhanced Decorative Divider */}
            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="h-[2px] w-20 sm:w-32 bg-gradient-to-r from-transparent to-wedding-gold/80 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-wedding-gold/40 blur-sm"></div>
              </div>
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-wedding-gold/30 relative">
                  <div className="absolute inset-1 rounded-full bg-wedding-gold/60 animate-pulse-soft"></div>
                </div>
              </div>
              <div className="h-[2px] w-20 sm:w-32 bg-gradient-to-l from-transparent to-wedding-gold/80 relative">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-wedding-gold/40 blur-sm"></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-6 animate-pulse-soft font-medium">Click for a magical surprise ✨</p>
          </div>
        </div>
      </div>
      
      <FallingHearts isActive={showHearts} />
      <FireworksDisplay isActive={showFireworks} />
    </header>
  );
};

export default InvitationHeader;
