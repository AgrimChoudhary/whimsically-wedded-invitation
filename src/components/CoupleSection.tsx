
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CoupleSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useIsMobile();
  
  // Use the uploaded wedding images
  const weddingImages = [
    "/lovable-uploads/5dd881f6-d881-416e-b698-ac19aad670dd.png",
    "/lovable-uploads/18803395-23cb-484d-aa3e-14c5a849ff43.png",
    "/lovable-uploads/bff4aa29-fbc0-446c-9d83-7485124a051a.png",
    "/lovable-uploads/e3d55c88-356e-467c-a7c3-e53c761e4c9b.png",
    "/lovable-uploads/3a6a95e2-7082-45b6-b6f5-dd572b4f3622.png",
    "/lovable-uploads/67153292-d418-4fea-80c2-3a6507d6d812.png"
  ];
  
  // Auto-scroll through images
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentImageIndex((prev) => (prev + 1) % weddingImages.length);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isHovered, weddingImages.length]);

  return (
    <section className="w-full py-4 md:py-6 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="glass-card overflow-hidden shadow-gold-soft hover:shadow-gold-glow transition-all duration-700 relative">
          <div 
            className="relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AspectRatio ratio={isMobile ? 4/3 : 16/9} className="bg-wedding-cream">
              <div className="absolute inset-0 overflow-hidden">
                {weddingImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Wedding Image ${index + 1}`} 
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      currentImageIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                    }`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      objectPosition: 'center',
                    }}
                    loading="lazy"
                  />
                ))}
                
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
              
              {/* Image pagination dots */}
              <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 z-10">
                {weddingImages.map((_, index) => (
                  <button 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index 
                        ? 'bg-wedding-gold w-4' 
                        : 'bg-wedding-gold/30'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`View wedding image ${index + 1}`}
                  />
                ))}
              </div>
            </AspectRatio>
            
            {/* Bottom overlay with date information */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex justify-center">
              <div className="inline-block py-1 px-4 bg-wedding-gold/60 backdrop-blur-sm rounded-full text-white text-sm shadow-gold-soft">
                <Calendar size={16} className="inline-block mr-2" />
                <span>April 29, 2025</span>
              </div>
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
