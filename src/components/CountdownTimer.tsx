
import React, { useState, useEffect } from 'react';
import { Clock, Heart, Calendar, Sparkles, Crown, Diamond } from 'lucide-react';
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
  
  // Wedding date - June 30, 2025 at 8:00 PM
  const targetDate = weddingDate ? weddingDate.getTime() : new Date('2025-06-30T20:00:00').getTime();
  
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
    { label: 'Days', value: timeLeft.days, icon: Crown },
    { label: 'Hours', value: timeLeft.hours, icon: Diamond },
    { label: 'Minutes', value: timeLeft.minutes, icon: Sparkles },
    { label: 'Seconds', value: timeLeft.seconds, icon: Heart }
  ];

  const displayDate = weddingDate ? 
    weddingDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : 'June 30, 2025';
    
  const displayTime = weddingTime || '8:00 PM';

  return (
    <section id="countdown-timer" className="w-full py-8 md:py-12 relative overflow-hidden">
      {/* Luxury background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-wedding-gold/20 via-transparent to-wedding-maroon/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 border border-wedding-gold/20 rounded-full animate-pulse-soft"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-wedding-gold/20 rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown size={24} className="text-wedding-gold mr-2" />
            <span className="inline-block py-2 px-6 bg-gradient-to-r from-wedding-gold/20 to-wedding-maroon/20 rounded-full text-sm md:text-base text-wedding-maroon font-medium border border-wedding-gold/30">
              <Calendar size={16} className="inline mr-2" /> Royal Countdown
            </span>
            <Crown size={24} className="text-wedding-gold ml-2" />
          </div>
          
          <h3 className="font-great-vibes text-3xl sm:text-4xl md:text-5xl text-wedding-maroon mb-4 leading-tight">
            Until Our Sacred Union
          </h3>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-wedding-gold"></div>
            <Diamond size={16} className="text-wedding-gold animate-pulse-soft" />
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-wedding-gold"></div>
          </div>
        </div>
        
        <div 
          className={`relative overflow-hidden transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} cursor-pointer`}
          onClick={handleTimerClick}
          title="Click for a royal surprise!"
        >
          {/* Luxury card with royal design */}
          <div className="bg-gradient-to-br from-wedding-cream via-white to-wedding-cream rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-wedding-gold/30 relative overflow-hidden">
            {/* Royal pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm15 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}></div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-wedding-gold/50 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-wedding-gold/50 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-wedding-gold/50 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-wedding-gold/50 rounded-br-lg"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
              {timeUnits.map((unit, index) => {
                const IconComponent = unit.icon;
                return (
                  <div 
                    key={index} 
                    className={`text-center transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="relative inline-flex flex-col">
                      <div className={`${isMobile ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-28 h-28'} rounded-xl bg-gradient-to-br from-wedding-gold/20 via-wedding-cream to-wedding-gold/10 flex flex-col items-center justify-center shadow-lg relative overflow-hidden group hover:scale-105 transition-all duration-500 border border-wedding-gold/30`}>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-wedding-gold/20 to-transparent shimmer-effect"></div>
                        
                        {/* Icon */}
                        <IconComponent size={isMobile ? 14 : 16} className="text-wedding-gold mb-1 relative z-10" />
                        
                        {/* Number */}
                        <span className={`font-great-vibes ${isMobile ? 'text-xl sm:text-2xl' : 'text-3xl'} text-wedding-maroon font-bold relative z-10 leading-none`}>
                          {unit.value < 10 ? `0${unit.value}` : unit.value}
                        </span>
                        
                        {/* Luxury corners */}
                        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-wedding-gold/40"></div>
                        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-wedding-gold/40"></div>
                        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-wedding-gold/40"></div>
                        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-wedding-gold/40"></div>
                      </div>
                      
                      <p className={`mt-3 ${isMobile ? 'text-sm' : 'text-base'} text-wedding-maroon font-medium font-playfair tracking-wide`}>
                        {unit.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-8 relative z-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-wedding-gold/10 to-wedding-maroon/10 px-6 py-3 rounded-full shadow-inner border border-wedding-gold/20 hover:from-wedding-gold/20 hover:to-wedding-maroon/20 transition-all duration-300">
                <Clock size={18} className="text-wedding-gold" />
                <span className="font-playfair text-base md:text-lg text-wedding-maroon font-medium">
                  {displayDate} at {displayTime}
                </span>
                <Sparkles size={16} className="text-wedding-gold animate-pulse-soft" />
              </div>
            </div>
          </div>
          
          <p className="text-center text-xs text-wedding-gold/70 mt-4 animate-pulse-soft font-dancing-script">
            ✨ Click for a royal surprise ✨
          </p>
        </div>
      </div>
      
      <FireworksDisplay isActive={showFireworks} />
    </section>
  );
};

export default CountdownTimer;
