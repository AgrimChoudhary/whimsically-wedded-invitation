
import React, { useState } from 'react';
import { useGuest } from '../context/GuestContext';
import { FallingHearts } from './AnimatedElements';

const InvitationHeader: React.FC = () => {
  const { guestName } = useGuest();
  const [showHearts, setShowHearts] = useState(false);
  
  const triggerHearts = () => {
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 3000);
  };

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
          </div>
          <div className="text-center">
            <p className="font-devanagari text-sm text-wedding-gold mb-1">॥ शुभं करोति कल्याणं ॥</p>
            <p className="text-xs text-gray-600 italic">May there be auspiciousness and well-being</p>
          </div>
        </div>
        
        {/* Personalized greeting */}
        <div className="text-center mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h1 className="font-dancing-script text-4xl sm:text-5xl md:text-6xl text-wedding-maroon mb-2 gold-highlight">
            Dear {guestName || 'Guest'},
          </h1>
          <h2 className="font-great-vibes text-3xl sm:text-4xl text-wedding-gold animate-bounce-light">
            You're Cordially Invited!
          </h2>
        </div>
        
        {/* Couple Names */}
        <div 
          className="text-center opacity-0 animate-fade-in-up cursor-pointer"
          style={{ animationDelay: '0.9s' }}
          onClick={triggerHearts}
          title="Click for a surprise!"
        >
          <h2 className="font-great-vibes text-4xl sm:text-5xl md:text-6xl shimmer-text leading-tight">
            <span className="block sm:inline">Ananya</span>
            <span className="inline-block mx-2 sm:mx-4 transform -translate-y-1">&</span>
            <span className="block sm:inline">Arjun</span>
          </h2>
        </div>
      </div>
      
      <FallingHearts isActive={showHearts} />
    </header>
  );
};

export default InvitationHeader;
