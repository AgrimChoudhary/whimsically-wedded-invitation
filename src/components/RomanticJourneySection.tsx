
import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const RomanticJourneySection: React.FC = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [heartsVisible, setHeartsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [sparklesVisible, setSparklesVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationStarted) {
          setAnimationStarted(true);
          setHeartsVisible(true);
          
          setTimeout(() => {
            setTextVisible(true);
          }, 4000);
          
          setTimeout(() => {
            setSparklesVisible(true);
          }, 4500);
          
          setTimeout(() => {
            setHeartsVisible(false);
            setTextVisible(false);
            setSparklesVisible(false);
            setTimeout(() => {
              setAnimationStarted(false);
            }, 1000);
          }, 8000);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('romantic-journey');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [animationStarted]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!animationStarted) {
        setAnimationStarted(true);
        setHeartsVisible(true);
        
        setTimeout(() => setTextVisible(true), 4000);
        setTimeout(() => setSparklesVisible(true), 4500);
        
        setTimeout(() => {
          setHeartsVisible(false);
          setTextVisible(false);
          setSparklesVisible(false);
          setTimeout(() => setAnimationStarted(false), 1000);
        }, 8000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [animationStarted]);

  return (
    <section id="romantic-journey" className="w-full py-12 md:py-20 relative overflow-hidden bg-gradient-to-br from-wedding-cream via-wedding-blush/5 to-wedding-cream">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-floral-pattern opacity-10"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-wedding-blush/40 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-16 w-2 h-2 bg-wedding-gold/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-wedding-maroon/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-32 right-12 w-3 h-3 bg-wedding-blush/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-great-vibes text-4xl md:text-6xl lg:text-7xl text-wedding-maroon mb-4">
            From Heart to Heart...
          </h2>
          <p className="font-dancing-script text-lg md:text-xl text-wedding-maroon/80 mb-2">
            A Journey of Love Across Cities
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-wedding-gold to-transparent mx-auto"></div>
        </div>

        {/* Animation Container */}
        <div className="relative h-96 md:h-[32rem] flex items-center justify-center mb-8">
          {/* Enhanced Zig-Zag Path SVG */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox={isMobile ? "0 0 400 350" : "0 0 1000 400"} 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.8" />
                <stop offset="25%" stopColor="#EF4444" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F87171" stopOpacity="1" />
                <stop offset="75%" stopColor="#EF4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Enhanced zig-zag path */}
            <path
              d={isMobile 
                ? "M 30 80 Q 100 50 150 120 Q 200 190 250 100 Q 300 50 370 150"
                : "M 80 120 Q 200 80 350 180 Q 500 280 650 140 Q 800 60 920 200"
              }
              stroke="url(#pathGradient)"
              strokeWidth={isMobile ? "3" : "4"}
              fill="none"
              strokeDasharray="12,6"
              className="animate-pulse"
              filter="url(#glow)"
            />
            
            {/* Path dots for enhancement */}
            {!isMobile && (
              <>
                <circle cx="200" cy="100" r="2" fill="#EF4444" opacity="0.6" className="animate-pulse" />
                <circle cx="500" cy="230" r="2" fill="#F87171" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="800" cy="80" r="2" fill="#EF4444" opacity="0.6" className="animate-pulse" style={{ animationDelay: '1s' }} />
              </>
            )}
          </svg>

          {/* City Labels - Positioned for zig-zag */}
          <div className={`absolute ${isMobile ? 'left-1 top-16' : 'left-6 top-20'}`}>
            <div className="flex items-center gap-2 bg-gradient-to-r from-wedding-cream/95 to-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-red-300/40 shadow-lg">
              <MapPin size={isMobile ? 14 : 16} className="text-red-600" />
              <span className={`${isMobile ? 'text-xs' : 'text-sm md:text-base'} font-dancing-script text-red-700 font-semibold`}>
                Kiara - Jaipur
              </span>
            </div>
          </div>

          <div className={`absolute ${isMobile ? 'right-1 bottom-12' : 'right-6 bottom-16'}`}>
            <div className="flex items-center gap-2 bg-gradient-to-r from-wedding-cream/95 to-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-red-300/40 shadow-lg">
              <MapPin size={isMobile ? 14 : 16} className="text-red-600" />
              <span className={`${isMobile ? 'text-xs' : 'text-sm md:text-base'} font-dancing-script text-red-700 font-semibold`}>
                Sidharth - Delhi
              </span>
            </div>
          </div>

          {/* Animated Hearts - Following the path more precisely */}
          {heartsVisible && (
            <>
              {/* Kiara's Heart following the zig-zag path */}
              <div 
                className={`absolute ${isMobile ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'}`}
                style={{
                  animation: isMobile 
                    ? 'heart-journey-mobile-left 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                    : 'heart-journey-left 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Heart size={isMobile ? 16 : 20} className="text-white fill-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-300/50 to-transparent animate-ping"></div>
                </div>
              </div>

              {/* Sidharth's Heart following the zig-zag path */}
              <div 
                className={`absolute ${isMobile ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'}`}
                style={{
                  animation: isMobile 
                    ? 'heart-journey-mobile-right 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                    : 'heart-journey-right 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Heart size={isMobile ? 16 : 20} className="text-white fill-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-300/50 to-transparent animate-ping"></div>
                </div>
              </div>
            </>
          )}

          {/* Center Glow Effect */}
          {textVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24 md:w-32 md:h-32'} bg-gradient-to-br from-red-300/60 via-rose-300/60 to-pink-300/60 rounded-full animate-pulse blur-2xl`}></div>
            </div>
          )}

          {/* Enhanced Sparkles */}
          {sparklesVisible && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(isMobile ? 8 : 12)].map((_, i) => (
                <Sparkles
                  key={i}
                  size={isMobile ? 12 : 16}
                  className="absolute text-red-500 animate-sparkle"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '2.5s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Text Card - Positioned below animation, smaller and non-overlapping */}
        {textVisible && (
          <div className="flex justify-center mb-8">
            <div className="transform animate-scale-in">
              <div className={`bg-gradient-to-br from-wedding-cream/98 to-white/95 backdrop-blur-lg ${isMobile ? 'px-4 py-3' : 'px-6 py-4'} rounded-2xl border border-red-300/40 shadow-xl`}>
                <h3 className={`font-great-vibes ${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} text-red-700 text-center animate-fade-in`}>
                  Dil Se Dil Tak... 💖
                </h3>
                <p className={`font-dancing-script ${isMobile ? 'text-sm' : 'text-base'} text-red-600/80 text-center animate-fade-in mt-1`} style={{ animationDelay: '0.3s' }}>
                  Two souls, one beautiful journey
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom decorative text */}
        <div className="text-center mt-8">
          <p className="font-dancing-script text-lg md:text-xl text-wedding-maroon/70 italic">
            "Distance means nothing when someone means everything"
          </p>
          <div className="mt-4 w-32 h-0.5 bg-gradient-to-r from-transparent via-wedding-gold/50 to-transparent mx-auto"></div>
        </div>
      </div>

      {/* Enhanced keyframes styles */}
      <style>{`
        @keyframes heart-journey-left {
          0% {
            left: 1.5rem;
            top: 30%;
            transform: translateY(-50%) scale(1);
          }
          25% {
            left: 20%;
            top: 20%;
            transform: translateY(-50%) scale(1.1);
          }
          50% {
            left: 35%;
            top: 70%;
            transform: translateY(-50%) scale(1.2);
          }
          75% {
            left: 48%;
            top: 35%;
            transform: translateY(-50%) scale(1.3);
          }
          100% {
            left: 50%;
            top: 50%;
            transform: translateY(-50%) scale(1.4);
          }
        }

        @keyframes heart-journey-right {
          0% {
            right: 1.5rem;
            bottom: 16%;
            transform: translateY(50%) scale(1);
          }
          25% {
            right: 20%;
            bottom: 6%;
            transform: translateY(50%) scale(1.1);
          }
          50% {
            right: 35%;
            bottom: 35%;
            transform: translateY(50%) scale(1.2);
          }
          75% {
            right: 48%;
            bottom: 15%;
            transform: translateY(50%) scale(1.3);
          }
          100% {
            right: 50%;
            bottom: 50%;
            transform: translateY(50%) scale(1.4);
          }
        }

        @keyframes heart-journey-mobile-left {
          0% {
            left: 0.5rem;
            top: 20%;
            transform: translateY(-50%) scale(1);
          }
          25% {
            left: 25%;
            top: 15%;
            transform: translateY(-50%) scale(1.05);
          }
          50% {
            left: 40%;
            top: 35%;
            transform: translateY(-50%) scale(1.1);
          }
          75% {
            left: 48%;
            top: 30%;
            transform: translateY(-50%) scale(1.15);
          }
          100% {
            left: 50%;
            top: 40%;
            transform: translateY(-50%) scale(1.2);
          }
        }

        @keyframes heart-journey-mobile-right {
          0% {
            right: 0.5rem;
            bottom: 3rem;
            transform: translateY(50%) scale(1);
          }
          25% {
            right: 25%;
            bottom: 1.5rem;
            transform: translateY(50%) scale(1.05);
          }
          50% {
            right: 40%;
            bottom: 4rem;
            transform: translateY(50%) scale(1.1);
          }
          75% {
            right: 48%;
            bottom: 2.5rem;
            transform: translateY(50%) scale(1.15);
          }
          100% {
            right: 50%;
            bottom: 60%;
            transform: translateY(50%) scale(1.2);
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.3) rotate(180deg);
          }
        }

        .animate-scale-in {
          animation: scale-in 1s ease-out forwards;
        }

        .animate-sparkle {
          animation: sparkle 2.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default RomanticJourneySection;
