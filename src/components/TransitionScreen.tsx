
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
    // Step through the animations and then navigate
    const timeline = [
      setTimeout(() => setStep(1), 300),  // Show family name
      setTimeout(() => setStep(2), 2200), // Show "is inviting you"
      setTimeout(() => setStep(3), 4000), // Show guest name
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            navigate(redirectPath);
          }
        }, 1200);
      }, 6800)  // Navigate after showing all elements and slight pause
    ];

    return () => timeline.forEach(timer => clearTimeout(timer));
  }, [navigate, redirectPath, onComplete]);

  return (
    <div className={`fixed inset-0 bg-wedding-cream z-50 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <FloatingPetals count={isMobile ? 10 : 20} />
      
      <div className="w-full max-w-lg mx-auto px-6 relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-wedding-gold/10 animate-pulse-soft"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-wedding-gold/5 animate-pulse-soft" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/3 right-5 w-16 h-16 rounded-full bg-wedding-blush/10 animate-pulse-soft" style={{ animationDelay: "1.5s" }}></div>
        </div>
        
        <div className="glass-card p-10 sm:p-12 flex flex-col items-center justify-center min-h-[300px] relative z-10">
          {/* Decorative elements */}
          <div className="absolute -left-2 top-8 text-wedding-gold/20">
            <Sparkles size={isMobile ? 18 : 24} />
          </div>
          <div className="absolute -right-2 bottom-8 text-wedding-blush/20">
            <Heart size={isMobile ? 18 : 24} />
          </div>
          
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-wedding-gold/20 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-wedding-gold/20 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-wedding-gold/20 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-wedding-gold/20 rounded-br-lg"></div>
          
          <div className="text-center space-y-6 w-full">
            {/* Family Name */}
            <div 
              className={`transition-opacity duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.2s' }}
            >
              <h2 className="font-kruti text-3xl sm:text-4xl text-wedding-maroon relative inline-block">
                <span className="relative">
                  <HandwritingAnimation 
                    text={familyName}
                    className="inline-block"
                  />
                  {step >= 1 && (
                    <span 
                      className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/70 to-transparent"
                      style={{ 
                        animation: 'fadeIn 1s forwards',
                        opacity: 0,
                        animationDelay: '0.8s'
                      }}
                    ></span>
                  )}
                </span>
              </h2>
            </div>
            
            {/* Is inviting you */}
            <div 
              className={`transition-opacity duration-1000 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.4s' }}
            >
              <p className="text-lg sm:text-xl text-wedding-gold font-dancing-script">
                <HandwritingAnimation 
                  text="is inviting you to celebrate"
                  delay={1900}
                  className="inline-block"
                />
              </p>
            </div>
            
            {/* Guest Name */}
            <div 
              className={`transition-opacity duration-1000 mt-6 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.6s' }}
            >
              <div className="relative inline-block">
                <p className="text-xl sm:text-2xl text-wedding-maroon font-playfair mb-2">
                  Dear{' '}
                  <AnimatedGuestName 
                    name={guestName}
                    fallback="Guest"
                    animationType="sparkle"
                    className="font-playfair text-wedding-maroon inline-block"
                    delay={400}
                  />
                </p>
                <span 
                  className="absolute -right-4 -bottom-3 text-wedding-gold/30"
                  style={{ 
                    animation: step >= 3 ? 'fadeIn 1s forwards' : 'none',
                    opacity: 0,
                    animationDelay: '1s'
                  }}
                >
                  <Heart size={16} fill="currentColor" />
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 transition-opacity duration-500" style={{ opacity: isExiting ? 0 : 0.7 }}>
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-wedding-gold' : 'bg-wedding-gold/30'}`}
              style={{ transform: i === step ? 'scale(1.3)' : 'scale(1)' }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransitionScreen;
