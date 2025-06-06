
import React from 'react';
import { useGuest } from '../context/GuestContext';
import { Heart, Sparkles, Crown } from 'lucide-react';

interface PersonalizedGreetingProps {
  context?: 'welcome' | 'invitation' | 'rsvp' | 'generic';
  className?: string;
  showIcon?: boolean;
}

const PersonalizedGreeting: React.FC<PersonalizedGreetingProps> = ({ 
  context = 'generic', 
  className = '',
  showIcon = true 
}) => {
  const { guestName } = useGuest();

  const getGreeting = () => {
    const name = guestName || 'प्रिय अतिथि';
    
    switch (context) {
      case 'welcome':
        return {
          text: `Namaste ${name} जी!`,
          subtext: 'आपका हार्दिक स्वागत है',
          icon: '🙏'
        };
      case 'invitation':
        return {
          text: `Dear ${name}`,
          subtext: 'You are specially invited',
          icon: '💌'
        };
      case 'rsvp':
        return {
          text: `${name}, please confirm`,
          subtext: 'आपकी उपस्थिति का इंतज़ार है',
          icon: '✅'
        };
      default:
        return {
          text: name,
          subtext: 'Special Guest',
          icon: '👑'
        };
    }
  };

  const greeting = getGreeting();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showIcon && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wedding-gold/20 to-wedding-blush/20 flex items-center justify-center animate-pulse">
          <span className="text-sm">{greeting.icon}</span>
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-playfair text-wedding-maroon font-medium">
          {greeting.text}
        </span>
        {greeting.subtext && (
          <span className="text-xs text-wedding-gold/70 font-dancing-script">
            {greeting.subtext}
          </span>
        )}
      </div>
    </div>
  );
};

export default PersonalizedGreeting;
