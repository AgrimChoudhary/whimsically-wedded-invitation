
import React, { useRef, useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { TriangleRight } from 'lucide-react';

const photos = [
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
    caption: 'Our first date'
  },
  {
    url: 'https://images.unsplash.com/photo-1529636798458-92182e662485',
    caption: 'Beach vacation'
  },
  {
    url: 'https://images.unsplash.com/photo-1537907510278-10acdb198d0f',
    caption: 'City lights'
  },
  {
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf',
    caption: 'The proposal'
  },
  {
    url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a',
    caption: 'Evening walk'
  },
  {
    url: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999',
    caption: 'Coffee date'
  }
];

const PhotoGrid: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: activeIndex * carouselRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  return (
    <section ref={sectionRef} className="w-full py-12">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            Our Journey Together
          </span>
          <h2 className="font-playfair text-3xl text-wedding-maroon">Photo Memories</h2>
        </div>
        
        {/* Full width carousel for mobile */}
        <div className="relative md:hidden mb-8">
          <div 
            ref={carouselRef}
            className="flex overflow-x-hidden snap-x snap-mandatory w-full"
          >
            {photos.map((photo, index) => (
              <div 
                key={index} 
                className="w-full flex-shrink-0 snap-center px-2"
              >
                <div className={`glass-card overflow-hidden transition-all duration-500 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                  <AspectRatio ratio={4/3}>
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </AspectRatio>
                  <p className="text-center py-2 text-sm text-gray-700">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-wedding-gold w-4' : 'bg-wedding-gold/30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Grid for larger screens */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`glass-card overflow-hidden transition-all duration-500 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative group">
                <AspectRatio ratio={4/3}>
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                </AspectRatio>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center pl-1">
                    <TriangleRight size={20} className="text-wedding-maroon" />
                  </div>
                </div>
              </div>
              <p className="text-center py-3 text-sm text-gray-700">{photo.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGrid;
