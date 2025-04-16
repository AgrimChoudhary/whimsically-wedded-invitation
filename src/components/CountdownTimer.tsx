
import React, { useState, useEffect } from 'react';
import { Clock, Heart, Calendar, Sparkles } from 'lucide-react';
import { FireworksDisplay } from './AnimatedElements';
import { useIsMobile } from '@/hooks/use-mobile';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  weddingDate?: Date;
  weddingTime?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ weddingDate, weddingTime }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const isMobile = useIsMobile();
  
  // Wedding date - April 29, 2025 at 8:00 PM or use the prop if provided
  const targetDate = weddingDate ? weddingDate.getTime() : new Date('2025-04-29T20:00:00').getTime();
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Animation trigger
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('countdown-timer');
    if (element) observer.observe(element);
    
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [targetDate]);
  
  // Effect to hide fireworks after a few seconds
  useEffect(() => {
    if (showFireworks) {
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showFireworks]);
  
  const handleTimerClick = () => {
    setShowFireworks(true);
  };
  
  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  // Format date and time for display
  const displayDate = weddingDate ? 
    weddingDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : 'April 29, 2025';
    
  const displayTime = weddingTime || '8:00 PM';

  return (
    <section id="countdown-timer" className="w-full py-1 md:py-2 mb-1 md:mb-2">
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="text-center mb-1 md:mb-2">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-1">
            <Calendar size={12} className="inline mr-1" /> Save The Date
          </span>
          <h3 className="font-kruti text-lg sm:text-xl md:text-2xl text-wedding-maroon">
            हमारे विशेष दिन तक गिनती शुरू
          </h3>
        </div>
        
        <div 
          className={`glass-card py-1 md:py-2 px-1 md:px-2 border border-wedding-gold/20 shadow-gold-soft hover:shadow-gold-glow transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          onClick={handleTimerClick}
        >
          <div className="grid grid-cols-4 gap-1 sm:gap-2">
            {timeUnits.map((unit, index) => (
              <div 
                key={index} 
                className={`text-center transform transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative inline-flex flex-col">
                  <div className={`${isMobile ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-16 h-16'} rounded-lg bg-gradient-to-br from-wedding-blush to-wedding-cream flex items-center justify-center shadow-md relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-wedding-gold/5 group-hover:bg-wedding-gold/10 transition-colors duration-300"></div>
                    <span className={`font-poppins ${isMobile ? 'text-lg' : 'text-2xl'} text-wedding-maroon relative z-10`}>
                      {unit.value < 10 ? `0${unit.value}` : unit.value}
                    </span>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect"></div>
                    
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-wedding-gold/30"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-wedding-gold/30"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-wedding-gold/30"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-wedding-gold/30"></div>
                  </div>
                  {index === 0 && !isMobile && (
                    <div className="absolute -top-2 -right-2 w-5 h-5">
                      <Heart size={16} className="text-wedding-blush fill-wedding-blush animate-pulse-soft" />
                    </div>
                  )}
                  <p className={`mt-1 ${isMobile ? 'text-[8px] sm:text-[10px]' : 'text-xs'} text-gray-600`}>{unit.label}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} className="text-wedding-gold" />
              <span>{displayDate} at {displayTime}</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Fireworks animation */}
      <FireworksDisplay isActive={showFireworks} />
    </section>
  );
};

export default CountdownTimer;
