
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import { Heart, Sparkles, Music } from 'lucide-react';
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
    // Step through the animations faster for loading effect
    const timeline = [
      setTimeout(() => setStep(1), 100),  // Show family name
      setTimeout(() => setStep(2), 800),  // Show "is inviting you"
      setTimeout(() => setStep(3), 1500), // Show guest name
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            navigate(redirectPath);
          }
        }, 800);
      }, 2500)  // Navigate after showing all elements and slight pause
    ];

    return () => timeline.forEach(timer => clearTimeout(timer));
  }, [navigate, redirectPath, onComplete]);

  return (
    <div className={`fixed inset-0 bg-wedding-cream z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Use FloatingPetals without count prop since it's not supported by the component type */}
      <FloatingPetals />
      
      <div className="w-full max-w-lg mx-auto px-6 relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-wedding-gold/10 animate-pulse-soft"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-wedding-gold/5 animate-pulse-soft" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/3 right-5 w-16 h-16 rounded-full bg-wedding-blush/10 animate-pulse-soft" style={{ animationDelay: "0.5s" }}></div>
        </div>
        
        <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[220px] relative z-10">
          {/* Loading spinner */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <div className="text-center space-y-4 w-full">
            {/* Family Name */}
            <div 
              className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.1s' }}
            >
              <h2 className="font-kruti text-2xl sm:text-3xl text-wedding-maroon relative inline-block">
                <span className="relative">
                  <HandwritingAnimation 
                    text={familyName}
                    className="inline-block"
                  />
                  {step >= 1 && (
                    <span 
                      className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/70 to-transparent"
                      style={{ 
                        animation: 'fadeIn 0.5s forwards',
                        opacity: 0,
                        animationDelay: '0.5s'
                      }}
                    ></span>
                  )}
                </span>
              </h2>
            </div>
            
            {/* Is inviting you */}
            <div 
              className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.2s' }}
            >
              <p className="text-lg text-wedding-gold font-dancing-script">
                <HandwritingAnimation 
                  text="is inviting you to celebrate"
                  delay={700}
                  className="inline-block"
                />
              </p>
            </div>
            
            {/* Guest Name */}
            <div 
              className={`transition-opacity duration-500 mt-2 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.3s' }}
            >
              <div className="relative inline-block">
                <p className="text-lg sm:text-xl text-wedding-maroon font-playfair mb-2">
                  Dear{' '}
                  <AnimatedGuestName 
                    name={guestName}
                    fallback="Guest"
                    animationType="sparkle"
                    className="font-playfair text-wedding-maroon inline-block"
                    delay={200}
                  />
                </p>
                <span 
                  className="absolute -right-3 -bottom-2 text-wedding-gold/30"
                  style={{ 
                    animation: step >= 3 ? 'fadeIn 0.5s forwards' : 'none',
                    opacity: 0,
                    animationDelay: '0.5s'
                  }}
                >
                  <Heart size={14} fill="currentColor" />
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading indicator */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 transition-opacity duration-300" style={{ opacity: isExiting ? 0 : 0.7 }}>
          <div className="text-xs text-wedding-maroon font-poppins animate-pulse">Loading invitation</div>
          <div className="flex">
            {[0, 1, 2].map((i) => (
              <span 
                key={i} 
                className="text-wedding-gold animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              >.</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitionScreen;
