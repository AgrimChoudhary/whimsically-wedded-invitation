
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
          
          // Show text when hearts meet (longer duration for cinematic effect)
          setTimeout(() => {
            setTextVisible(true);
          }, 4000);
          
          // Show sparkles after text
          setTimeout(() => {
            setSparklesVisible(true);
          }, 4500);
          
          // Reset animation for loop
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

  // Restart animation every 10 seconds for longer cycle
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
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-great-vibes text-4xl md:text-6xl lg:text-7xl text-wedding-maroon mb-4">
            From Heart to Heart...
          </h2>
          <p className="font-dancing-script text-lg md:text-xl text-wedding-maroon/80 mb-2">
            A Journey of Love Across Cities
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-wedding-gold to-transparent mx-auto"></div>
        </div>

        {/* Animation Container - Larger for cinematic effect */}
        <div className="relative h-80 md:h-96 lg:h-[28rem] flex items-center justify-center">
          {/* Long Winding Path SVG */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1000 400" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="25%" stopColor="#EC4899" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
                <stop offset="75%" stopColor="#EC4899" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Long winding path */}
            <path
              d="M 80 200 Q 200 100 350 180 Q 500 260 650 140 Q 800 80 920 200"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="15,8"
              className="animate-pulse"
              filter="url(#glow)"
            />
            {/* Path dots for enhancement */}
            <circle cx="200" cy="130" r="2" fill="#EC4899" opacity="0.6" className="animate-pulse" />
            <circle cx="500" cy="200" r="2" fill="#D4AF37" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="800" cy="110" r="2" fill="#EC4899" opacity="0.6" className="animate-pulse" style={{ animationDelay: '1s' }} />
          </svg>

          {/* City Labels */}
          <div className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center gap-2 bg-gradient-to-r from-wedding-cream/95 to-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-wedding-gold/40 shadow-lg">
              <MapPin size={16} className="text-wedding-maroon" />
              <span className="text-sm md:text-base font-dancing-script text-wedding-maroon font-semibold">
                Kiara - Jaipur
              </span>
            </div>
          </div>

          <div className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center gap-2 bg-gradient-to-r from-wedding-cream/95 to-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-wedding-gold/40 shadow-lg">
              <MapPin size={16} className="text-wedding-maroon" />
              <span className="text-sm md:text-base font-dancing-script text-wedding-maroon font-semibold">
                Sidharth - Delhi
              </span>
            </div>
          </div>

          {/* Animated Hearts */}
          {heartsVisible && (
            <>
              {/* Kiara's Heart from Jaipur */}
              <div 
                className="absolute left-8 md:left-12 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-14 md:h-14"
                style={{
                  animation: 'heart-journey-left 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Heart size={isMobile ? 20 : 28} className="text-white fill-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300/50 to-transparent animate-ping"></div>
                </div>
              </div>

              {/* Sidharth's Heart from Delhi */}
              <div 
                className="absolute right-8 md:right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-14 md:h-14"
                style={{
                  animation: 'heart-journey-right 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Heart size={isMobile ? 20 : 28} className="text-white fill-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300/50 to-transparent animate-ping"></div>
                </div>
              </div>
            </>
          )}

          {/* Center Glow Effect */}
          {textVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-pink-300/60 via-purple-300/60 to-gold-300/60 rounded-full animate-pulse blur-2xl"></div>
            </div>
          )}

          {/* Center Text */}
          {textVisible && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center transform animate-scale-in">
                <div className="bg-gradient-to-br from-wedding-cream/98 to-white/95 backdrop-blur-lg px-8 py-6 rounded-3xl border border-wedding-gold/40 shadow-2xl">
                  <h3 className="font-great-vibes text-3xl md:text-5xl text-wedding-maroon mb-2 animate-fade-in">
                    From Heart to Heart... 💖
                  </h3>
                  <p className="font-dancing-script text-base md:text-xl text-wedding-maroon/80 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    Two souls, one beautiful journey
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Sparkles */}
          {sparklesVisible && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <Sparkles
                  key={i}
                  size={isMobile ? 14 : 18}
                  className={`absolute text-wedding-gold animate-sparkle`}
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${15 + Math.random() * 70}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '2.5s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom decorative text */}
        <div className="text-center mt-12 md:mt-16">
          <p className="font-dancing-script text-lg md:text-xl text-wedding-maroon/70 italic">
            "Distance means nothing when someone means everything"
          </p>
          <div className="mt-4 w-32 h-0.5 bg-gradient-to-r from-transparent via-wedding-gold/50 to-transparent mx-auto"></div>
        </div>
      </div>

      {/* Custom keyframes styles */}
      <style>{`
        @keyframes heart-journey-left {
          0% {
            left: 2rem;
            top: 50%;
            transform: translateY(-50%) scale(1);
          }
          25% {
            left: 20%;
            top: 35%;
            transform: translateY(-50%) scale(1.1);
          }
          50% {
            left: 35%;
            top: 65%;
            transform: translateY(-50%) scale(1.2);
          }
          75% {
            left: 48%;
            top: 40%;
            transform: translateY(-50%) scale(1.3);
          }
          100% {
            left: 50%;
            top: 50%;
            transform: translateY(-50%) scale(1.5);
          }
        }

        @keyframes heart-journey-right {
          0% {
            right: 2rem;
            top: 50%;
            transform: translateY(-50%) scale(1);
          }
          25% {
            right: 20%;
            top: 35%;
            transform: translateY(-50%) scale(1.1);
          }
          50% {
            right: 35%;
            top: 20%;
            transform: translateY(-50%) scale(1.2);
          }
          75% {
            right: 48%;
            top: 25%;
            transform: translateY(-50%) scale(1.3);
          }
          100% {
            right: 50%;
            top: 50%;
            transform: translateY(-50%) scale(1.5);
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

        @media (max-width: 768px) {
          @keyframes heart-journey-left {
            0% {
              left: 1.5rem;
              top: 50%;
              transform: translateY(-50%) scale(1);
            }
            25% {
              left: 18%;
              top: 40%;
              transform: translateY(-50%) scale(1.05);
            }
            50% {
              left: 32%;
              top: 65%;
              transform: translateY(-50%) scale(1.1);
            }
            75% {
              left: 46%;
              top: 45%;
              transform: translateY(-50%) scale(1.2);
            }
            100% {
              left: 50%;
              top: 50%;
              transform: translateY(-50%) scale(1.3);
            }
          }

          @keyframes heart-journey-right {
            0% {
              right: 1.5rem;
              top: 50%;
              transform: translateY(-50%) scale(1);
            }
            25% {
              right: 18%;
              top: 40%;
              transform: translateY(-50%) scale(1.05);
            }
            50% {
              right: 32%;
              top: 25%;
              transform: translateY(-50%) scale(1.1);
            }
            75% {
              right: 46%;
              top: 30%;
              transform: translateY(-50%) scale(1.2);
            }
            100% {
              right: 50%;
              top: 50%;
              transform: translateY(-50%) scale(1.3);
            }
          }
        }
      `}</style>
    </section>
  );
};

export default RomanticJourneySection;
