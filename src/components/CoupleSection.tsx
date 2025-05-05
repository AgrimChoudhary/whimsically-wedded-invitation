import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CoupleSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section className="w-full py-8 md:py-12 overflow-hidden bg-wedding-cream/20">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-dancing-script text-3xl sm:text-4xl text-wedding-maroon mb-2">Our Wedding Journey</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Join us as we celebrate our love and begin our journey together with blessings from family and friends
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <div className="w-2 h-2 rounded-full bg-wedding-gold/40 animate-pulse"></div>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
        </div>

        {/* Main couple image */}
        <div className="glass-card overflow-hidden shadow-gold-soft hover:shadow-gold-glow transition-all duration-700 relative mb-12">
          <div 
            className="relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AspectRatio ratio={isMobile ? 4/3 : 21/9} className="bg-wedding-cream">
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://i.imgur.com/Z4aPmMV.jpg" 
                  alt="Sidharth Malhotra and Kiara Advani Wedding" 
                  className={`w-full h-full object-cover transition-transform duration-10000 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-700 ${isHovered ? 'opacity-30' : 'opacity-60'}`}></div>
                
                {/* Hindu Wedding Elements overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-3 left-3 w-16 h-16 md:w-24 md:h-24">
                    <img 
                      src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                      alt="Kalash decoration" 
                      className="w-full h-full object-contain opacity-40"
                    />
                  </div>
                  <div className="absolute top-3 right-3 w-16 h-16 md:w-24 md:h-24">
                    <img 
                      src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                      alt="Om symbol" 
                      className="w-full h-full object-contain opacity-40"
                    />
                  </div>
                  
                  {/* Decorative border elements */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-wedding-gold/30"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-wedding-gold/30"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-wedding-gold/30"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-wedding-gold/30"></div>
                </div>
              </div>
            </AspectRatio>
            
            {/* Bottom overlay with date information */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex justify-center">
              <div className="inline-block py-2 px-6 bg-wedding-gold/60 backdrop-blur-sm rounded-full text-white text-sm sm:text-base shadow-gold-soft">
                <Calendar size={isMobile ? 16 : 18} className="inline-block mr-2" />
                <span>May 15, 2025 at 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
