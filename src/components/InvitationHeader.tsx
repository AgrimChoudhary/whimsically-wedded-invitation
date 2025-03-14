
import React, { useState, useEffect } from 'react';
import { useGuest } from '../context/GuestContext';
import { FallingHearts } from './AnimatedElements';
import { Sparkles, Star, Music } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const InvitationHeader: React.FC = () => {
  const { guestName } = useGuest();
  const [showHearts, setShowHearts] = useState(false);
  const [titleShimmer, setTitleShimmer] = useState(false);
  const isMobile = useIsMobile();
  
  const triggerHearts = () => {
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 3000);
  };
  
  useEffect(() => {
    // Add title shimmer effect at intervals
    const shimmerInterval = setInterval(() => {
      setTitleShimmer(true);
      setTimeout(() => setTitleShimmer(false), 2000);
    }, 7000);
    
    return () => clearInterval(shimmerInterval);
  }, []);

  return (
    <header className="relative w-full flex flex-col items-center pt-8 pb-6 overflow-hidden">
      <div className="w-full max-w-4xl px-4">
        {/* Ganesh Ji Image and Sanskrit Shloka */}
        <div className="flex flex-col items-center mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative mb-3">
            <img 
              src="https://images.unsplash.com/photo-1566776254946-60a1ae191d1d" 
              alt="Lord Ganesha" 
              className="w-20 h-20 object-cover rounded-full border-2 border-wedding-gold animate-glow-soft"
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
            <p className="font-devanagari text-sm text-wedding-gold mb-1">॥ शुभं करोति कल्याणं ॥</p>
            <p className="text-xs text-gray-600 italic">May there be auspiciousness and well-being</p>
          </div>
        </div>
        
        {/* Personalized greeting */}
        <div className="text-center mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative inline-block">
            <h1 className="font-dancing-script text-4xl sm:text-5xl md:text-6xl text-wedding-maroon mb-2 gold-highlight">
              Dear {guestName || 'Guest'},
            </h1>
            {!isMobile && (
              <div className="absolute -right-6 -top-6 opacity-30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="#FFDEE2" />
                </svg>
              </div>
            )}
          </div>
          <h2 className="font-great-vibes text-3xl sm:text-4xl text-wedding-gold animate-bounce-light">
            You're Cordially Invited!
          </h2>
        </div>
        
        {/* Couple Names */}
        <div 
          className="text-center opacity-0 animate-fade-in-up cursor-pointer relative"
          style={{ animationDelay: '0.9s' }}
          onClick={triggerHearts}
          title="Click for a surprise!"
        >
          <h2 className={`font-great-vibes text-4xl sm:text-5xl md:text-6xl ${titleShimmer ? 'shimmer-text' : 'text-wedding-maroon'} leading-tight`}>
            <span className="block sm:inline relative">
              Ananya
              {!isMobile && <Sparkles size={18} className="absolute -top-4 -left-4 text-wedding-gold" />}
            </span>
            <span className="inline-block mx-2 sm:mx-4 transform -translate-y-1">&</span>
            <span className="block sm:inline relative">
              Arjun
              {!isMobile && <Sparkles size={18} className="absolute -top-4 -right-4 text-wedding-gold" />}
            </span>
          </h2>
          
          {/* Decorative accents */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent to-wedding-gold/70"></div>
            <div className="w-3 h-3 rounded-full bg-wedding-gold/20 relative">
              <div className="absolute inset-0.5 rounded-full bg-wedding-gold/40 animate-pulse-soft"></div>
            </div>
            <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-l from-transparent to-wedding-gold/70"></div>
          </div>
          
          {/* Click hint */}
          <p className="text-xs text-gray-400 mt-4 animate-pulse-soft">Click names for a surprise</p>
        </div>
      </div>
      
      <FallingHearts isActive={showHearts} />
    </header>
  );
};

export default InvitationHeader;
