import React, { useState, useEffect } from 'react';
import WelcomeForm from '@/components/WelcomeForm';
import { FloatingPetals } from '@/components/AnimatedElements';
import { Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSparkle, setShowSparkle] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Simulating assets loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Sparkle effect timing
    const sparkleTimer = setInterval(() => {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 700);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(sparkleTimer);
    };
  }, []);

  return (
    <div className="min-h-screen pattern-background">
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-spinner mb-4"></div>
          <p className="text-wedding-maroon font-dancing-script text-xl">Loading our love story...</p>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-wedding-cream bg-opacity-50 z-0"></div>
          
          <FloatingPetals />
          
          <div className="relative z-10 text-center mb-8">
            <h1 className="font-great-vibes text-4xl sm:text-5xl md:text-6xl text-wedding-maroon mb-4 opacity-0 animate-fade-in-up relative inline-block">
              Umashankar & Bhavna
              {showSparkle && (
                <Sparkles 
                  size={isMobile ? 16 : 24} 
                  className="absolute text-wedding-gold animate-pulse-soft" 
                  style={{ 
                    top: isMobile ? '-10px' : '-15px', 
                    right: isMobile ? '-15px' : '-25px'
                  }} 
                />
              )}
            </h1>
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-gold mb-2">
                Wedding Invitation
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
                <div className="w-2 h-2 rounded-full bg-wedding-gold/40"></div>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
              </div>
            </div>
          </div>
          
          <WelcomeForm />
          
          {/* Background decorative elements */}
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-wedding-gold/20 rounded-bl-3xl opacity-30"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-wedding-gold/20 rounded-tr-3xl opacity-30"></div>
        </div>
      )}
    </div>
  );
};

export default Index;
