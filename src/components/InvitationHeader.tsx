
import React from 'react';
import { useGuest } from '@/context/GuestContext';
import AnimatedGuestName from './AnimatedGuestName';

interface InvitationHeaderProps {
  groomName: string;
  brideName: string;
  showFinalGanesha?: boolean;
}

const InvitationHeader: React.FC<InvitationHeaderProps> = ({ 
  groomName, 
  brideName, 
  showFinalGanesha = false 
}) => {
  const { guestName, isLoading: isGuestLoading } = useGuest();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-wedding-cream/40 via-wedding-blush/20 to-wedding-cream/60">
      {/* Ganesha Section - Enhanced Religious Theme */}
      <div className="mb-8 relative">
        <div className="luxury-frame p-6 md:p-8 rounded-2xl bg-gradient-to-br from-orange-50/80 via-yellow-50/60 to-orange-50/80 backdrop-blur-sm shadow-xl border-2 border-orange-200/50">
          {/* Sacred Border Decoration */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-200/30 via-yellow-200/40 to-orange-200/30 p-[2px]">
            <div className="h-full w-full rounded-2xl bg-gradient-to-br from-orange-50/90 via-yellow-50/70 to-orange-50/90"></div>
          </div>
          
          <div className="relative z-10 text-center">
            {/* Divine Blessing Text */}
            <div className="mb-4">
              <p className="font-hindi text-orange-800 text-lg md:text-xl font-semibold leading-relaxed">
                श्री गणेशाय नमः
              </p>
              <p className="font-poppins text-orange-700 text-sm md:text-base mt-1 tracking-wide">
                Seeking Lord Ganesha's Divine Blessings
              </p>
            </div>
            
            {/* Ganesha Image with Divine Glow */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-200/50 to-yellow-200/50 flex items-center justify-center divine-glow">
                  {showFinalGanesha && (
                    <img 
                      src="https://i.pinimg.com/564x/99/10/e4/9910e478f8df0b3b729c94c3b534caeb.jpg"
                      alt="Lord Ganesha"
                      className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-lg animate-fade-in"
                    />
                  )}
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full opacity-60 animate-pulse-soft"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-50 animate-pulse-soft" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
            
            {/* Sacred Symbol */}
            <div className="text-center">
              <p className="font-hindi text-2xl md:text-3xl text-orange-600 font-bold animate-glow-soft">
                ॐ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Couple Section */}
      <div className="mb-8 relative">
        <div className="luxury-frame p-8 md:p-12 rounded-3xl bg-gradient-to-br from-wedding-cream/60 via-white/40 to-wedding-blush/30 backdrop-blur-lg shadow-2xl border border-wedding-gold/20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-wedding-gold/20 to-wedding-blush/20 rounded-3xl"></div>
          </div>
          
          <div className="relative z-10">
            {/* Couple Image */}
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-wedding-gold/30 shadow-gold-glow animate-floating">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEKH3sVJr5XLfvE4iRGCDNl-jLZGNzQQQrNw&s"
                    alt="Couple Caricature"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-wedding-gold/20 rounded-full animate-pulse-soft"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-wedding-blush/30 rounded-full animate-pulse-soft" style={{animationDelay: '0.3s'}}></div>
              </div>
            </div>
            
            {/* Guest Name Section */}
            <div className="mb-6">
              <h2 className="font-great-vibes text-3xl md:text-4xl text-wedding-maroon mb-3">
                Dear{' '}
                {isGuestLoading ? (
                  <span className="inline-block w-32 h-8 bg-wedding-gold/20 rounded animate-pulse"></span>
                ) : (
                  <AnimatedGuestName 
                    name={guestName}
                    animationType="typewriter"
                    className="font-great-vibes text-wedding-gold animate-sparkle"
                    delay={800}
                    fallback="Guest"
                  />
                )}
              </h2>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-wedding-gold to-transparent mx-auto"></div>
            </div>
            
            {/* Couple Names */}
            <div className="space-y-4">
              <h1 className="font-great-vibes text-4xl md:text-6xl text-wedding-maroon leading-tight">
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  {groomName}
                </span>
                <span className="mx-4 md:mx-6 text-wedding-gold shimmer-text text-5xl md:text-7xl">
                  &
                </span>
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  {brideName}
                </span>
              </h1>
              
              <p className="font-dancing-script text-xl md:text-2xl text-wedding-maroon/80 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                Together with their families
              </p>
              
              <p className="font-playfair text-lg md:text-xl text-wedding-maroon animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                request the honor of your presence
              </p>
              
              <p className="font-dancing-script text-2xl md:text-3xl text-wedding-gold animate-fade-in-up" style={{animationDelay: '1s'}}>
                at their wedding celebration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-wedding-blush/10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-wedding-gold/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-wedding-cream/20 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
    </div>
  );
};

export default InvitationHeader;
