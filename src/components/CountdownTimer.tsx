import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock } from 'lucide-react';

interface CountdownTimerProps {
  weddingDate: Date; // Changed to Date object
  weddingTime: string; // Keep as string for display HH:MM
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ weddingDate, weddingTime }) => {
  const calculateTimeLeft = () => {
    const difference = +weddingDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPast: false,
      };
    } else {
      // If the date is in the past
      const pastDifference = +new Date() - +weddingDate;
      timeLeft = {
        days: Math.floor(pastDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((pastDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((pastDifference / 1000 / 60) % 60),
        seconds: Math.floor((pastDifference / 1000) % 60),
        isPast: true,
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }); // Runs on every render to update countdown

  const weddingDateFormatted = weddingDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Format weddingTime (e.g., "07:00 PM" or "19:00")
  const [time, period] = weddingTime.split(' ');
  let displayTime = weddingTime;
  if (time && period) { // Simple check if it's like "HH:MM AM/PM"
      displayTime = `${time} ${period.toUpperCase()}`;
  } else if (time && time.includes(':')) { // Check if it's like HH:MM
      const [h, m] = time.split(':');
      const hour = parseInt(h, 10);
      if (!isNaN(hour) && !isNaN(parseInt(m,10))) {
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const formattedHour = hour % 12 || 12; // Convert 0/24 to 12
          displayTime = `${String(formattedHour).padStart(2, '0')}:${m} ${ampm}`;
      }
  }


  const timeParts = Object.entries(timeLeft).filter(([key]) => key !== 'isPast');


  return (
    <section className="py-12 md:py-16 bg-wedding-cream/30">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-great-vibes text-3xl md:text-4xl text-wedding-maroon mb-3">
          {timeLeft.isPast ? "We Tied the Knot!" : "Join Us For The Celebration"}
        </h2>
        <p className="font-playfair text-lg md:text-xl text-gray-700 mb-6 md:mb-8 flex items-center justify-center space-x-2">
          <CalendarDays size={20} className="text-wedding-gold" /> 
          <span>{weddingDateFormatted}</span>
          <Clock size={20} className="text-wedding-gold" />
          <span>{displayTime}</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
          {timeParts.map(([unit, value]) => (
            <div key={unit} className="glass-card-sm p-4 md:p-6 rounded-lg shadow-lg">
              <div className="font-playfair text-3xl md:text-5xl text-wedding-maroon font-bold leading-none">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wider mt-1">
                {unit}
              </div>
            </div>
          ))}
        </div>
        {timeLeft.isPast && (
            <p className="mt-6 text-gray-600 font-poppins">
                It was a beautiful day! Thank you to everyone who celebrated with us.
            </p>
        )}
      </div>
    </section>
  );
};

export default CountdownTimer;
