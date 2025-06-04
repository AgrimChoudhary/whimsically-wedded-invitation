
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
          
          // Show text when hearts meet
          setTimeout(() => {
            setTextVisible(true);
          }, 2500);
          
          // Show sparkles after text
          setTimeout(() => {
            setSparklesVisible(true);
          }, 3000);
          
          // Reset animation for loop
          setTimeout(() => {
            setHeartsVisible(false);
            setTextVisible(false);
            setSparklesVisible(false);
            setTimeout(() => {
              setAnimationStarted(false);
            }, 1000);
          }, 6000);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('romantic-journey');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [animationStarted]);

  // Restart animation every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!animationStarted) {
        setAnimationStarted(true);
        setHeartsVisible(true);
        
        setTimeout(() => setTextVisible(true), 2500);
        setTimeout(() => setSparklesVisible(true), 3000);
        
        setTimeout(() => {
          setHeartsVisible(false);
          setTextVisible(false);
          setSparklesVisible(false);
          setTimeout(() => setAnimationStarted(false), 1000);
        }, 6000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [animationStarted]);

  return (
    <section id="romantic-journey" className="w-full py-12 md:py-16 relative overflow-hidden bg-gradient-to-br from-wedding-cream via-wedding-blush/10 to-wedding-cream">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-floral-pattern opacity-20"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-wedding-blush/40 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-16 w-2 h-2 bg-wedding-gold/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-wedding-maroon/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-32 right-12 w-3 h-3 bg-wedding-blush/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-great-vibes text-4xl md:text-6xl lg:text-7xl text-wedding-maroon mb-4">
            दिल से दिल तक...
          </h2>
          <p className="font-dancing-script text-lg md:text-xl text-wedding-maroon/80 mb-2">
            From Heart to Heart...
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-wedding-gold to-transparent mx-auto"></div>
        </div>

        {/* Animation Container */}
        <div className="relative h-64 md:h-80 lg:h-96 flex items-center justify-center">
          {/* Curved Path SVG */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 800 300" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDEE2" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFDEE2" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path
              d="M 50 150 Q 400 50 750 150"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>

          {/* City Labels */}
          <div className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center gap-2 bg-wedding-cream/80 backdrop-blur-sm px-3 py-2 rounded-full border border-wedding-gold/30 shadow-md">
              <MapPin size={16} className="text-wedding-maroon" />
              <span className="text-sm md:text-base font-dancing-script text-wedding-maroon font-semibold">
                Bride's City
              </span>
            </div>
          </div>

          <div className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center gap-2 bg-wedding-cream/80 backdrop-blur-sm px-3 py-2 rounded-full border border-wedding-gold/30 shadow-md">
              <MapPin size={16} className="text-wedding-maroon" />
              <span className="text-sm md:text-base font-dancing-script text-wedding-maroon font-semibold">
                Groom's City
              </span>
            </div>
          </div>

          {/* Animated Hearts */}
          {heartsVisible && (
            <>
              {/* Bride's Heart */}
              <div 
                className="absolute left-12 md:left-16 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                style={{
                  animation: 'heart-journey-left 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Heart size={isMobile ? 16 : 24} className="text-white fill-white" />
                </div>
              </div>

              {/* Groom's Heart */}
              <div 
                className="absolute right-12 md:right-16 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                style={{
                  animation: 'heart-journey-right 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Heart size={isMobile ? 16 : 24} className="text-white fill-white" />
                </div>
              </div>
            </>
          )}

          {/* Center Glow Effect */}
          {textVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-pink-300/50 to-red-300/50 rounded-full animate-pulse blur-xl"></div>
            </div>
          )}

          {/* Center Text */}
          {textVisible && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center transform animate-scale-in">
                <div className="bg-gradient-to-br from-wedding-cream/95 to-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-wedding-gold/30 shadow-xl">
                  <h3 className="font-great-vibes text-2xl md:text-4xl text-wedding-maroon mb-1">
                    दिल से दिल तक... 💖
                  </h3>
                  <p className="font-dancing-script text-sm md:text-lg text-wedding-maroon/80">
                    Two hearts, one love story
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sparkles */}
          {sparklesVisible && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <Sparkles
                  key={i}
                  size={16}
                  className={`absolute text-wedding-gold animate-sparkle`}
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom decorative text */}
        <div className="text-center mt-8 md:mt-12">
          <p className="font-dancing-script text-base md:text-lg text-wedding-maroon/70 italic">
            "Distance means nothing when someone means everything"
          </p>
        </div>
      </div>

      {/* Custom keyframes styles */}
      <style jsx>{`
        @keyframes heart-journey-left {
          0% {
            left: 3rem;
            top: 50%;
            transform: translateY(-50%) scale(1);
          }
          50% {
            left: 45%;
            top: 30%;
            transform: translateY(-50%) scale(1.2);
          }
          100% {
            left: 50%;
            top: 50%;
            transform: translateY(-50%) scale(1.5);
          }
        }

        @keyframes heart-journey-right {
          0% {
            right: 3rem;
            top: 50%;
            transform: translateY(-50%) scale(1);
          }
          50% {
            right: 45%;
            top: 30%;
            transform: translateY(-50%) scale(1.2);
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
            transform: scale(1.2) rotate(180deg);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          @keyframes heart-journey-left {
            0% {
              left: 2rem;
              top: 50%;
              transform: translateY(-50%) scale(1);
            }
            50% {
              left: 42%;
              top: 35%;
              transform: translateY(-50%) scale(1.1);
            }
            100% {
              left: 50%;
              top: 50%;
              transform: translateY(-50%) scale(1.3);
            }
          }

          @keyframes heart-journey-right {
            0% {
              right: 2rem;
              top: 50%;
              transform: translateY(-50%) scale(1);
            }
            50% {
              right: 42%;
              top: 35%;
              transform: translateY(-50%) scale(1.1);
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
