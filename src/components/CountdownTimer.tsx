
import React, { useState, useEffect } from 'react';
import { Clock, Heart, Calendar, Sparkles, MapPin, Diamond, Crown, Star } from 'lucide-react';
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
  
  // Calculate wedding date - 1.5 months from now
  const getWeddingDate = () => {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setMonth(now.getMonth() + 1);
    futureDate.setDate(now.getDate() + 15); // Add 15 days to make it 1.5 months
    futureDate.setHours(20, 0, 0, 0); // 8:00 PM
    return futureDate;
  };
  
  const targetDate = weddingDate ? weddingDate.getTime() : getWeddingDate().getTime();
  
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
    { label: 'Days', value: timeLeft.days, icon: Calendar, gradient: 'from-purple-600 to-pink-600' },
    { label: 'Hours', value: timeLeft.hours, icon: Clock, gradient: 'from-blue-600 to-purple-600' },
    { label: 'Minutes', value: timeLeft.minutes, icon: Diamond, gradient: 'from-pink-600 to-rose-600' },
    { label: 'Seconds', value: timeLeft.seconds, icon: Sparkles, gradient: 'from-rose-600 to-orange-600' }
  ];

  // Format date and time for display
  const displayDate = weddingDate ? 
    weddingDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : getWeddingDate().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
  const displayTime = weddingTime || '8:00 PM';

  return (
    <section id="countdown-timer" className="w-full py-8 md:py-12 relative overflow-hidden">
      {/* Luxury background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-2 h-2 bg-gold-500 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 py-2 px-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full border border-purple-400/20 backdrop-blur-sm mb-4">
            <Crown size={16} className="text-purple-600" />
            <span className="text-sm md:text-base text-purple-700 font-medium tracking-wide">Save The Date</span>
            <Crown size={16} className="text-purple-600" />
          </div>
          
          <h3 className="font-great-vibes text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text mb-2">
            Countdown to Forever
          </h3>
          <p className="text-gray-600 font-medium text-sm md:text-base">Our wedding celebration begins in</p>
        </div>
        
        <div 
          className={`relative backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/40 border border-white/30 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} cursor-pointer group hover:shadow-purple-200/50`}
          onClick={handleTimerClick}
          title="Click for a magical surprise! ✨"
        >
          {/* Luxury border decoration */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-rose-400/20 blur-xl"></div>
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-rose-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {timeUnits.map((unit, index) => {
                const IconComponent = unit.icon;
                return (
                  <div 
                    key={index} 
                    className={`text-center transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} group/card`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="relative">
                      {/* Main countdown card */}
                      <div className={`${isMobile ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-28 h-28 md:w-32 md:h-32'} mx-auto rounded-2xl bg-gradient-to-br ${unit.gradient} flex items-center justify-center shadow-xl relative overflow-hidden group-hover/card:scale-105 transition-all duration-500 border border-white/30`}>
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-black/10 to-transparent"></div>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000"></div>
                        
                        {/* Time value */}
                        <span className={`font-bold ${isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl md:text-4xl'} text-white relative z-10 drop-shadow-lg`}>
                          {unit.value < 10 ? `0${unit.value}` : unit.value}
                        </span>
                        
                        {/* Corner decorations */}
                        <div className="absolute top-2 left-2">
                          <div className="w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-lg"></div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 border-t-2 border-r-2 border-white/40 rounded-tr-lg"></div>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <div className="w-3 h-3 border-b-2 border-l-2 border-white/40 rounded-bl-lg"></div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-lg"></div>
                        </div>
                      </div>
                      
                      {/* Floating icon */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover/card:animate-bounce">
                        <IconComponent size={14} className="text-white" />
                      </div>
                      
                      {/* Label */}
                      <p className={`mt-4 ${isMobile ? 'text-sm sm:text-base' : 'text-base md:text-lg'} text-gray-700 font-semibold font-dancing-script tracking-wide`}>
                        {unit.label}
                      </p>
                      
                      {/* Subtle glow effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${unit.gradient} opacity-0 group-hover/card:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Wedding date and time display */}
            <div className="text-center mt-8 md:mt-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 rounded-2xl shadow-lg border border-purple-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm md:text-base">{displayDate}</p>
                    <p className="text-gray-600 text-xs md:text-sm flex items-center gap-1">
                      <Clock size={12} />
                      {displayTime}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-purple-200"></div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <Sparkles size={14} className="text-purple-500 animate-pulse" />
                  <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
            
            {/* Interactive hint */}
            <p className="text-center text-xs text-gray-400 mt-6 animate-pulse font-medium">
              ✨ Click anywhere for a magical surprise ✨
            </p>
          </div>
        </div>
      </div>
      
      {/* Fireworks animation */}
      <FireworksDisplay isActive={showFireworks} />
    </section>
  );
};

export default CountdownTimer;
