
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import { Heart, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import HandwritingAnimation from './HandwritingAnimation';
import { FloatingPetals } from './AnimatedElements';
import AnimatedGuestName from './AnimatedGuestName';

interface TransitionScreenProps {
  invitationId?: string;
  guestId?: string;
  familyName?: string;
  redirectPath: string;
  onComplete?: () => void;
}

const TransitionScreen: React.FC<TransitionScreenProps> = ({ 
  invitationId = "",
  guestId = "",
  familyName = "Malhotra Family",
  redirectPath,
  onComplete
}) => {
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const { guestName } = useGuest();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Speed up the transition process for a loading screen feel
    const timeline = [
      setTimeout(() => setStep(1), 50),  // Show family name faster
      setTimeout(() => setStep(2), 400), // Show "is inviting you" faster
      setTimeout(() => setStep(3), 800), // Show guest name faster
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            navigate(redirectPath);
          }
        }, 500); // Shorter exit animation
      }, 1500)  // Navigate sooner after showing all elements
    ];

    return () => timeline.forEach(timer => clearTimeout(timer));
  }, [navigate, redirectPath, onComplete]);

  return (
    <div className={`fixed inset-0 bg-wedding-cream z-50 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <FloatingPetals />
      
      <div className="w-full max-w-lg mx-auto px-4 relative">
        {/* Mobile-optimized background elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-wedding-gold/10 animate-pulse-soft"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-wedding-gold/5 animate-pulse-soft" style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute top-1/3 right-5 w-12 h-12 rounded-full bg-wedding-blush/10 animate-pulse-soft" style={{ animationDelay: "0.3s" }}></div>
        </div>
        
        <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[200px] relative z-10 border border-wedding-gold/20 shadow-xl">
          {/* Loading spinner - more prominent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <div className="text-center space-y-2 w-full">
            {/* Family Name */}
            <div 
              className={`transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.1s' }}
            >
              <h2 className="font-kruti text-2xl text-wedding-maroon relative inline-block">
                <span className="relative">
                  <HandwritingAnimation 
                    text={familyName}
                    className="inline-block"
                    delay={0} // No delay to make animation start immediately
                  />
                  {step >= 1 && (
                    <span 
                      className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/70 to-transparent"
                      style={{ 
                        animation: 'fadeIn 0.5s forwards',
                        opacity: 0,
                        animationDelay: '0.3s'
                      }}
                    ></span>
                  )}
                </span>
              </h2>
            </div>
            
            {/* Is inviting you */}
            <div 
              className={`transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.1s' }}
            >
              <p className="text-lg text-wedding-gold font-dancing-script">
                <HandwritingAnimation 
                  text="is inviting you to celebrate"
                  delay={350}
                  className="inline-block"
                />
              </p>
            </div>
            
            {/* Guest Name */}
            <div 
              className={`transition-opacity duration-300 mt-2 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.1s' }}
            >
              <div className="relative inline-block">
                <p className="text-lg text-wedding-maroon font-playfair mb-2">
                  Dear{' '}
                  <AnimatedGuestName 
                    name={guestName}
                    fallback="Guest"
                    animationType="sparkle"
                    className="font-playfair text-wedding-maroon inline-block"
                    delay={100}
                  />
                </p>
                <span 
                  className="absolute -right-2 -bottom-1 text-wedding-gold/40"
                  style={{ 
                    animation: step >= 3 ? 'fadeIn 0.5s forwards' : 'none',
                    opacity: 0,
                    animationDelay: '0.3s'
                  }}
                >
                  <Heart size={14} fill="currentColor" />
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading indicator */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 transition-opacity duration-300" style={{ opacity: isExiting ? 0 : 0.7 }}>
          <div className="text-xs text-wedding-maroon font-poppins animate-pulse-soft">Opening Invitation</div>
          <div className="loading-dots"></div>
        </div>
      </div>
    </div>
  );
};

export default TransitionScreen;
