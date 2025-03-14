
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, Heart, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CoupleSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section className="w-full py-8 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="glass-card overflow-hidden shadow-gold-soft hover:shadow-gold-glow transition-all duration-700 relative">
          <div 
            className="relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AspectRatio ratio={isMobile ? 16/9 : 21/9} className="bg-wedding-cream">
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a" 
                  alt="Ananya and Arjun" 
                  className={`w-full h-full object-cover transition-transform duration-10000 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-black/20 transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`}></div>
                
                {/* Decorative Overlay Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/20"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/20"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white/20"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/20"></div>
                </div>
              </div>
            </AspectRatio>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
              <div className="relative z-10 bg-black/40 backdrop-blur-sm p-4 md:p-6 rounded-lg max-w-3xl mx-auto">
                <div className="inline-block py-1 px-4 bg-wedding-gold/80 backdrop-blur-sm rounded-full text-white text-sm mb-3 flex items-center justify-center space-x-2">
                  <Calendar size={16} className={`transition-transform duration-500 ${isHovered ? 'rotate-12' : 'rotate-0'}`} />
                  <span>14th February 2025</span>
                </div>
                
                <h3 className="font-dancing-script text-2xl sm:text-3xl md:text-4xl mb-3">Join us for our wedding celebration</h3>
                
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm font-light">
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} className="text-wedding-gold" />
                    <span>Divine Gardens, Blessing Avenue</span>
                  </div>
                  <div className="hidden md:flex items-center">
                    <span className="px-2">•</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart size={16} className={`text-wedding-blush transition-transform duration-500 ${isHovered ? 'scale-125' : 'scale-100'}`} />
                    <span>Ceremony & Reception</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Photo credit */}
            <div className="absolute top-2 right-2 text-white/70 text-xs bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded">
              Photo: Pre-wedding
            </div>
          </div>
          
          {/* Animated border effect on hover */}
          <div className={`absolute inset-0 pointer-events-none border-2 border-transparent transition-all duration-700 ${isHovered ? 'border-wedding-gold/30' : ''}`}></div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
