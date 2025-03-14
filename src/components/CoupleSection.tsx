
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const CoupleSection: React.FC = () => {
  return (
    <section className="w-full py-8 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="glass-card overflow-hidden">
          <div className="relative w-full">
            <AspectRatio ratio={21/9} className="bg-wedding-cream">
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a" 
                  alt="Ananya and Arjun" 
                  className="w-full h-full object-cover transition-transform duration-15000 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </AspectRatio>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
              <div className="inline-block py-1 px-4 bg-wedding-gold/80 backdrop-blur-sm rounded-full text-white text-sm mb-2">
                14th February 2025
              </div>
              <h3 className="font-dancing-script text-3xl">Join us for our wedding celebration</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
