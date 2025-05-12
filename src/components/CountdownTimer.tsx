
import React, { useState, useEffect } from 'react';
import { Clock, Heart, Calendar, Star } from 'lucide-react';
import { FireworksDisplay } from './AnimatedElements';
import { useIsMobile } from '@/hooks/use-mobile';
import { WEDDING_DATE, WEDDING_TIME } from '@/config/weddingConfig';

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

// Parse the wedding date from config
const parseDateFromConfig = () => {
  const dateStr = WEDDING_DATE.replace(/,/g, ''); // Remove commas
  const parts = dateStr.split(' ');
  const month = new Date(Date.parse(`${parts[0]} 1, 2000`)).getMonth(); // Get month number
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  // Parse time
  let hours = 0;
  let minutes = 0;
  if (WEDDING_TIME) {
    const timeParts = WEDDING_TIME.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (timeParts) {
      hours = parseInt(timeParts[1], 10);
      minutes = parseInt(timeParts[2], 10);
      
      // Handle PM conversion
      if (timeParts[3] && timeParts[3].toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      }
      // Handle AM midnight
      if (timeParts[3] && timeParts[3].toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
    }
  }
  
  return new Date(year, month, day, hours, minutes, 0);
};

const DEFAULT_WEDDING_DATE = parseDateFromConfig();
const DEFAULT_WEDDING_TIME = WEDDING_TIME;

const CountdownTimer: React.FC<CountdownTimerProps> = ({ weddingDate, weddingTime }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isPastEvent, setIsPastEvent] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();
  
  // Wedding date or use default
  const targetDate = weddingDate ? weddingDate.getTime() : DEFAULT_WEDDING_DATE.getTime();
  
  useEffect(() => {
    // Check if the wedding date is in the past
    const now = new Date().getTime();
    const isDateInPast = now > targetDate;
    setIsPastEvent(isDateInPast);
    
    const calculateTimeLeft = () => {
      const difference = targetDate - now;
      
      // For past events, show days since wedding
      if (difference <= 0) {
        const absDifference = Math.abs(difference);
        setTimeLeft({
          days: Math.floor(absDifference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((absDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((absDifference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((absDifference % (1000 * 60)) / 1000)
        });
      } 
      // For future events, show countdown
      else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
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
  
  // Calculate years since wedding for past events
  const calculateYearsSince = () => {
    const now = new Date();
    const wedding = new Date(targetDate);
    const yearDiff = now.getFullYear() - wedding.getFullYear();
    const monthDiff = now.getMonth() - wedding.getMonth();
    const dayDiff = now.getDate() - wedding.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return yearDiff - 1;
    }
    return yearDiff;
  };
  
  const yearsSinceWedding = calculateYearsSince();
  
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
    }) : WEDDING_DATE;
    
  const displayTime = weddingTime || DEFAULT_WEDDING_TIME;

  // Calculate days, months and years since wedding
  const getDaysMonthsYearsText = () => {
    // Simple display for years
    if (yearsSinceWedding >= 5) {
      return `${yearsSinceWedding} wonderful ${yearsSinceWedding === 1 ? 'year' : 'years'} of marriage`;
    }
    
    // More detailed display for shorter periods
    const now = new Date();
    const wedding = new Date(targetDate);
    
    const years = yearsSinceWedding;
    let months = now.getMonth() - wedding.getMonth();
    if (months < 0) months += 12;
    
    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'} and ${months} ${months === 1 ? 'month' : 'months'} of marriage`;
    } else {
      return `${timeLeft.days} days since our special day`;
    }
  };

  return (
    <section id="countdown-timer" className="w-full py-6 md:py-8">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-4 md:mb-6">
          <span className="inline-block py-1.5 px-4 bg-wedding-gold/10 rounded-full text-xs md:text-sm text-wedding-gold mb-2 gold-border-gradient">
            <Calendar size={14} className="inline mr-1" /> {isPastEvent ? "Our Wedding Anniversary" : "Save The Date"}
          </span>
          <h3 className="font-great-vibes text-2xl sm:text-3xl md:text-4xl text-wedding-maroon animate-bounce-light">
            {isPastEvent ? 
              <span>
                <span className="inline-block relative">
                  <span className="relative z-10">Time Since Our</span>
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-wedding-gold/50 to-transparent"></span>
                </span>{" "}
                Wedding Day
              </span> 
              : 
              "Countdown to our Wedding Day"}
          </h3>
        </div>
        
        <div 
          className={`luxury-card py-6 px-4 border border-wedding-gold/20 shadow-gold-soft transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} cursor-pointer luxury-glow-hover`}
          onClick={handleTimerClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          title="Click for a surprise!"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {timeUnits.map((unit, index) => (
              <div 
                key={index} 
                className={`text-center transform transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative inline-flex flex-col">
                  <div className={`${isMobile ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-24 h-24'} rounded-lg bg-gradient-to-br from-wedding-blush to-wedding-cream flex items-center justify-center shadow-md relative overflow-hidden group hover:scale-105 transition-transform duration-300`}>
                    <div className="absolute inset-0 bg-wedding-gold/5 group-hover:bg-wedding-gold/10 transition-colors duration-300"></div>
                    <span className={`font-great-vibes ${isMobile ? 'text-2xl sm:text-3xl' : 'text-4xl'} text-wedding-maroon font-semibold relative z-10`}>
                      {Math.abs(unit.value) < 10 ? `0${Math.abs(unit.value)}` : Math.abs(unit.value)}
                    </span>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect"></div>
                    
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-wedding-gold/50"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-wedding-gold/50"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-wedding-gold/50"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-wedding-gold/50"></div>
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5">
                      <Heart size={16} className="text-wedding-blush fill-wedding-blush animate-pulse-soft" />
                    </div>
                  )}
                  <p className={`mt-2 ${isMobile ? 'text-xs sm:text-sm' : 'text-base'} text-gray-600 font-medium font-dancing-script`}>{unit.label}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add years since wedding display for past events */}
          {isPastEvent && (
            <div className="text-center mt-6 py-3 px-4 bg-wedding-cream/20 rounded-lg border border-wedding-gold/10 luxury-glow-hover">
              <div className="font-dancing-script text-xl md:text-2xl text-wedding-maroon">
                <span className="font-semibold">{getDaysMonthsYearsText()}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <Heart size={14} className="inline-block text-wedding-blush fill-wedding-blush mr-1" />
                <span>We continue our journey with love and joy</span>
              </div>
            </div>
          )}
          
          <div className="text-center mt-4 text-sm md:text-base text-wedding-maroon font-medium">
            <span className="inline-flex items-center gap-2 bg-wedding-cream/50 px-4 py-2 rounded-full shadow-sm hover:bg-wedding-cream/70 transition-colors duration-300">
              <Clock size={16} className="text-wedding-gold" />
              <span className="font-dancing-script text-base md:text-lg">{displayDate} at {displayTime}</span>
              <Star size={14} className="text-wedding-gold animate-pulse-soft" />
            </span>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-4 animate-pulse-soft">Click for a surprise</p>
        </div>
      </div>
      
      {/* Fireworks animation */}
      <FireworksDisplay isActive={showFireworks} />
    </section>
  );
};

export default CountdownTimer;
