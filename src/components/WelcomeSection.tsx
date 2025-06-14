
import React from 'react';
import { Heart } from 'lucide-react';
import WelcomeForm from './WelcomeForm';

const WelcomeSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-cream via-white to-wedding-blush relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-wedding-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-wedding-maroon/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-wedding-gold/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-wedding-maroon/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart size={20} className="text-wedding-gold animate-pulse" fill="currentColor" />
            <span className="text-wedding-gold font-medium tracking-wider uppercase text-sm">
              You're Invited
            </span>
            <Heart size={20} className="text-wedding-gold animate-pulse" fill="currentColor" />
          </div>
          
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-wedding-maroon mb-4 leading-tight">
            Welcome to Our
            <br />
            <span className="text-wedding-gold">Wedding Celebration</span>
          </h1>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            Join us as we begin our journey together in love and happiness
          </p>
        </div>

        <WelcomeForm />
      </div>
    </section>
  );
};

export default WelcomeSection;
