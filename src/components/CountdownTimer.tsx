
import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Wedding date - February 14, 2025
  const weddingDate = new Date('2025-02-14T11:00:00').getTime();
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = weddingDate - now;
      
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
    
    return () => clearInterval(timer);
  }, [weddingDate]);
  
  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <section className="w-full py-12 bg-wedding-lavender bg-opacity-20">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            Save The Date
          </span>
          <h2 className="font-playfair text-3xl text-wedding-maroon">Counting Down To Our Big Day</h2>
        </div>
        
        <div className="glass-card py-8 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeUnits.map((unit, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-wedding-blush flex items-center justify-center shadow-gold-soft">
                    <span className="font-playfair text-2xl sm:text-3xl text-wedding-maroon">
                      {unit.value < 10 ? `0${unit.value}` : unit.value}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-wedding-gold animate-pulse-soft"></div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{unit.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
