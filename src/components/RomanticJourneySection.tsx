
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
          }, 4500);
          
          // Show sparkles after text
          setTimeout(() => {
            setSparklesVisible(true);
          }, 5000);
          
          // Reset animation for loop
          setTimeout(() => {
            setHeartsVisible(false);
            setTextVisible(false);
            setSparklesVisible(false);
            setTimeout(() => {
              setAnimationStarted(false);
            }, 1000);
          }, 9000);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('romantic-journey');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [animationStarted]);

  // Restart animation every 12 seconds for longer cycle
  useEffect(() => {
    const interval = setInterval(() => {
      if (!animationStarted) {
        setAnimationStarted(true);
        setHeartsVisible(true);
        
        setTimeout(() => setTextVisible(true), 4500);
        setTimeout(() => setSparklesVisible(true), 5000);
        
        setTimeout(() => {
          setHeartsVisible(false);
          setTextVisible(false);
          setSparklesVisible(false);
          setTimeout(() => setAnimationStarted(false), 1000);
        }, 9000);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [animationStarted]);

  return (
    <section id="romantic-journey" className="w-full py-12 md:py-20 relative overflow-hidden bg-gradient-to-br from-wedding-cream via-wedding-blush/5 to-wedding-cream">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-floral-pattern opacity-10"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-red-400/40 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-16 w-2 h-2 bg-red-300/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-red-500/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-32 right-12 w-3 h-3 bg-red-400/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

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

        {/* Animation Container - Larger for cinematic effect */}
        <div className="relative h-96 md:h-[32rem] lg:h-[36rem] flex items-center justify-center mb-8">
          {/* Long Zig-Zag Path SVG */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1000 500" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                <stop offset="20%" stopColor="#F87171" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#EF4444" stopOpacity="1" />
                <stop offset="60%" stopColor="#F87171" stopOpacity="1" />
                <stop offset="80%" stopColor="#EF4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Long zig-zag winding path */}
            <path
              d="M 80 120 Q 180 80 280 140 Q 380 200 480 120 Q 580 40 680 160 Q 780 280 880 200 Q 920 180 920 200"
              stroke="url(#pathGradient)"
              strokeWidth="5"
              fill="none"
              strokeDasharray="20,10"
              className="animate-pulse"
              filter="url(#glow)"
            />
            {/* Path enhancement dots */}
            <circle cx="180" cy="100" r="3" fill="#EF4444" opacity="0.7" className="animate-pulse" />
            <circle cx="380" cy="160" r="2.5" fill="#F87171" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
            <circle cx="580" cy="80" r="3" fill="#EF4444" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
            <circle cx="780" cy="230" r="2.5" fill="#F87171" opacity="0.7" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
          </svg>

          {/* City Labels - Positioned at different heights */}
          <div className="absolute left-2 md:left-6 top-8 md:top-12">
            <div className="flex items-center gap-2 bg-gradient-to-r from-wedding-cream/95 to-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-red-300/40 shadow-lg">
              <MapPin size={16} className="text-red-600" />
              <span className="text-sm md:text-base font-dancing-script text-red-700 font-semibold">
                Kiara - Jaipur
              </span>
            </div>
          </div>

          <div className="absolute right-2 md:right-6 bottom-16 md:bottom-20">
            <div className="flex items-center gap-2 bg-gradient-to-r from-wedding-cream/95 to-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-red-300/40 shadow-lg">
              <MapPin size={16} className="text-red-600" />
              <span className="text-sm md:text-base font-dancing-script text-red-700 font-semibold">
                Sidharth - Delhi
              </span>
            </div>
          </div>

          {/* Animated Hearts */}
          {heartsVisible && (
            <>
              {/* Kiara's Heart from Jaipur (top-left) */}
              <div 
                className="absolute left-8 md:left-12 top-16 md:top-20 w-8 h-8 md:w-12 md:h-12"
                style={{
                  animation: 'heart-journey-left 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Heart size={isMobile ? 16 : 24} className="text-white fill-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-300/50 to-transparent animate-ping"></div>
                </div>
              </div>

              {/* Sidharth's Heart from Delhi (bottom-right) */}
              <div 
                className="absolute right-8 md:right-12 bottom-24 md:bottom-28 w-8 h-8 md:w-12 md:h-12"
                style={{
                  animation: 'heart-journey-right 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-400 via-red-400 to-red-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Heart size={isMobile ? 16 : 24} className="text-white fill-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300/50 to-transparent animate-ping"></div>
                </div>
              </div>
            </>
          )}

          {/* Center Glow Effect */}
          {textVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-red-300/60 via-pink-300/60 to-red-400/60 rounded-full animate-pulse blur-2xl"></div>
            </div>
          )}

          {/* Enhanced Sparkles */}
          {sparklesVisible && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(16)].map((_, i) => (
                <Sparkles
                  key={i}
                  size={isMobile ? 12 : 16}
                  className={`absolute text-red-500 animate-sparkle`}
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.12}s`,
                    animationDuration: '2.8s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Text Box - Positioned below the animation */}
        {textVisible && (
          <div className="flex justify-center">
            <div className="transform animate-scale-in">
              <div className="bg-gradient-to-br from-white/95 to-red-50/90 backdrop-blur-lg px-6 py-4 md:px-8 md:py-6 rounded-2xl border border-red-200/50 shadow-xl max-w-sm mx-auto">
                <h3 className="font-great-vibes text-2xl md:text-4xl text-red-600 text-center mb-1 animate-fade-in">
                  Dil Se Dil Tak... 💖
                </h3>
                <p className="font-dancing-script text-sm md:text-lg text-red-500/80 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  Two hearts, one beautiful journey
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom decorative text */}
        <div className="text-center mt-12 md:mt-16">
          <p className="font-dancing-script text-lg md:text-xl text-wedding-maroon/70 italic">
            "Distance means nothing when someone means everything"
          </p>
          <div className="mt-4 w-32 h-0.5 bg-gradient-to-r from-transparent via-red-400/50 to-transparent mx-auto"></div>
        </div>
      </div>

      {/* Custom keyframes styles */}
      <style>{`
        @keyframes heart-journey-left {
          0% {
            left: 2rem;
            top: 4rem;
            transform: scale(1);
          }
          20% {
            left: 18%;
            top: 22%;
            transform: scale(1.05);
          }
          40% {
            left: 28%;
            top: 35%;
            transform: scale(1.1);
          }
          60% {
            left: 38%;
            top: 28%;
            transform: scale(1.15);
          }
          80% {
            left: 48%;
            top: 45%;
            transform: scale(1.2);
          }
          100% {
            left: 50%;
            top: 50%;
            transform: scale(1.3);
          }
        }

        @keyframes heart-journey-right {
          0% {
            right: 2rem;
            bottom: 6rem;
            transform: scale(1);
          }
          20% {
            right: 18%;
            bottom: 55%;
            transform: scale(1.05);
          }
          40% {
            right: 28%;
            bottom: 35%;
            transform: scale(1.1);
          }
          60% {
            right: 38%;
            bottom: 60%;
            transform: scale(1.15);
          }
          80% {
            right: 48%;
            bottom: 42%;
            transform: scale(1.2);
          }
          100% {
            right: 50%;
            bottom: 50%;
            transform: scale(1.3);
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
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
          animation: scale-in 1.2s ease-out forwards;
        }

        .animate-sparkle {
          animation: sparkle 2.8s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          @keyframes heart-journey-left {
            0% {
              left: 1.5rem;
              top: 3rem;
              transform: scale(1);
            }
            20% {
              left: 16%;
              top: 25%;
              transform: scale(1.03);
            }
            40% {
              left: 26%;
              top: 38%;
              transform: scale(1.06);
            }
            60% {
              left: 36%;
              top: 32%;
              transform: scale(1.1);
            }
            80% {
              left: 46%;
              top: 48%;
              transform: scale(1.15);
            }
            100% {
              left: 50%;
              top: 50%;
              transform: scale(1.2);
            }
          }

          @keyframes heart-journey-right {
            0% {
              right: 1.5rem;
              bottom: 5rem;
              transform: scale(1);
            }
            20% {
              right: 16%;
              bottom: 52%;
              transform: scale(1.03);
            }
            40% {
              right: 26%;
              bottom: 38%;
              transform: scale(1.06);
            }
            60% {
              right: 36%;
              bottom: 58%;
              transform: scale(1.1);
            }
            80% {
              right: 46%;
              bottom: 45%;
              transform: scale(1.15);
            }
            100% {
              right: 50%;
              bottom: 50%;
              transform: scale(1.2);
            }
          }
        }
      `}</style>
    </section>
  );
};

export default RomanticJourneySection;
