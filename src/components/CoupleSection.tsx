
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, Heart, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CoupleSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section className="w-full py-4 md:py-6 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-4">
          <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-maroon mb-2">Our Wedding Journey</h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">Join us as we celebrate our love and begin our journey together with blessings from family and friends</p>
        </div>
        
        <div className="glass-card overflow-hidden shadow-gold-soft hover:shadow-gold-glow transition-all duration-700 relative">
          <div 
            className="relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AspectRatio ratio={isMobile ? 4/3 : 21/9} className="bg-wedding-cream">
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a" 
                  alt="Ananya and Arjun" 
                  className={`w-full h-full object-cover transition-transform duration-10000 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-700 ${isHovered ? 'opacity-30' : 'opacity-60'}`}></div>
                
                {/* Hindu Wedding Elements overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-3 left-3 w-16 h-16 md:w-24 md:h-24">
                    <img 
                      src="https://i.imgur.com/eK7BXjh.png" 
                      alt="Kalash decoration" 
                      className="w-full h-full object-contain opacity-40"
                    />
                  </div>
                  <div className="absolute top-3 right-3 w-16 h-16 md:w-24 md:h-24">
                    <img 
                      src="https://i.imgur.com/MsS23jz.png" 
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
              <div className="inline-block py-1 px-4 bg-wedding-gold/60 backdrop-blur-sm rounded-full text-white text-sm shadow-gold-soft">
                <Calendar size={16} className="inline-block mr-2" />
                <span>April 10, 2025</span>
              </div>
            </div>
          </div>
          
          {/* Animated border effect on hover */}
          <div className={`absolute inset-0 pointer-events-none border-2 border-transparent transition-all duration-700 ${isHovered ? 'border-wedding-gold/30' : ''}`}></div>
        </div>
        
        {/* Hindu wedding related information */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 glass-card p-4 border border-wedding-gold/20 shadow-gold-soft hover:shadow-gold-glow transition-all duration-500">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <Heart size={18} />
              </div>
              <div>
                <h3 className="font-playfair text-lg text-wedding-maroon mb-1">Traditional Hindu Ceremony</h3>
                <p className="text-sm text-gray-600">Join us for a beautiful traditional Hindu wedding ceremony with rituals that have been celebrated for thousands of years.</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 glass-card p-4 border border-wedding-gold/20 shadow-gold-soft hover:shadow-gold-glow transition-all duration-500">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="font-playfair text-lg text-wedding-maroon mb-1">Elegant Venue</h3>
                <p className="text-sm text-gray-600">Celebrate with us at Divine Gardens, a beautiful venue decorated with traditional Indian wedding elements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
