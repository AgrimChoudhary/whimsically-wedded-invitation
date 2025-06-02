
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Heart, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CountdownTimerProps {
  weddingDate: Date;
  weddingTime?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  weddingDate, 
  weddingTime = "8:00 PM" 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +weddingDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: Calendar },
    { label: 'Hours', value: timeLeft.hours, icon: Clock },
    { label: 'Minutes', value: timeLeft.minutes, icon: Heart },
    { label: 'Seconds', value: timeLeft.seconds, icon: Sparkles }
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-br from-wedding-cream via-wedding-blush/10 to-wedding-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 opacity-10 animate-float">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#D4AF37"/>
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#D4AF37"/>
          </svg>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block py-2 px-6 bg-wedding-gold/10 rounded-full text-sm font-medium text-wedding-gold mb-4 tracking-wide border border-wedding-gold/20">
            Save The Date
          </span>
          <h2 className="font-great-vibes text-3xl sm:text-4xl lg:text-5xl text-wedding-maroon mb-4 gold-highlight">
            Our Wedding Countdown
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-poppins">
            Every moment brings us closer to our special day
          </p>
        </div>

        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          {timeUnits.map((unit, index) => {
            const IconComponent = unit.icon;
            return (
              <div 
                key={unit.label}
                className="relative group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="glass-card bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border-2 border-wedding-gold/20 shadow-gold-soft hover:shadow-gold-glow transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  {/* Decorative corner elements */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-wedding-gold/30 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-wedding-gold/30 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-wedding-gold/30 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-wedding-gold/30 rounded-br-lg"></div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-wedding-gold/10 rounded-full flex items-center justify-center group-hover:bg-wedding-gold/20 transition-colors duration-300">
                      <IconComponent size={24} className="text-wedding-gold animate-pulse-soft" />
                    </div>
                  </div>

                  {/* Number */}
                  <div className="text-center mb-3">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-wedding-maroon mb-1 relative">
                      {unit.value.toString().padStart(2, '0')}
                      <div className="absolute -inset-1 bg-gradient-to-r from-wedding-gold/5 to-wedding-blush/5 rounded-lg -z-10 group-hover:from-wedding-gold/10 group-hover:to-wedding-blush/10 transition-all duration-300"></div>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <p className="text-wedding-maroon font-dancing-script text-lg sm:text-xl font-medium tracking-wide">
                      {unit.label}
                    </p>
                  </div>

                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-blush/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wedding date display */}
        <div className="text-center mt-12">
          <div className="inline-block glass-card bg-white/70 backdrop-blur-md py-4 px-8 rounded-full border border-wedding-gold/30 shadow-gold-soft">
            <p className="text-wedding-maroon font-dancing-script text-xl sm:text-2xl">
              <Calendar size={20} className="inline mr-3 text-wedding-gold" />
              June 30, 2025 at {weddingTime}
              <Heart size={20} className="inline ml-3 text-wedding-blush animate-pulse-soft" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
