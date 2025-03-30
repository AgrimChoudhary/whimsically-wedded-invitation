
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, Heart, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CoupleSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section className="w-full py-6 overflow-hidden">
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
                <div className={`absolute inset-0 bg-black/30 transition-opacity duration-700 ${isHovered ? 'opacity-10' : 'opacity-100'}`}></div>
                
                {/* Decorative Overlay Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/20"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/20"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white/20"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/20"></div>
                </div>
              </div>
            </AspectRatio>
            
            {/* Simplified overlay text (removed for better mobile experience) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white text-center">
              <div className="inline-block py-1 px-4 bg-wedding-gold/80 backdrop-blur-sm rounded-full text-white text-sm">
                <Calendar size={16} className="inline-block mr-2" />
                <span>April 10, 2025</span>
              </div>
            </div>
            
            {/* Photo credit */}
            <div className="absolute top-2 right-2 text-white/70 text-xs bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded">
              Pre-wedding
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
