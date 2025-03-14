
import React, { useState, useEffect } from 'react';
import WelcomeForm from '@/components/WelcomeForm';
import { FloatingPetals } from '@/components/AnimatedElements';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulating assets loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
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
            <h1 className="font-great-vibes text-4xl sm:text-5xl md:text-6xl text-wedding-maroon mb-4 opacity-0 animate-fade-in-up">
              Ananya & Arjun
            </h1>
            <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-gold opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Wedding Invitation
            </h2>
          </div>
          
          <WelcomeForm />
        </div>
      )}
    </div>
  );
};

export default Index;
