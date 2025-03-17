
import React, { useRef, useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { TriangleRight, Maximize, Heart, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const photos = [
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
    caption: 'Our first date',
    description: 'Where our journey began, at that little café where time stood still.'
  },
  {
    url: 'https://images.unsplash.com/photo-1529636798458-92182e662485',
    caption: 'Beach vacation',
    description: 'Barefoot on the shore, chasing waves and building sandcastles.'
  },
  {
    url: 'https://images.unsplash.com/photo-1537907510278-10acdb198d0f',
    caption: 'City lights',
    description: 'Midnight strolls through the illuminated streets of our favorite city.'
  },
  {
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf',
    caption: 'The proposal',
    description: 'When "Will you?" turned into "Yes, forever and always!"'
  },
  {
    url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a',
    caption: 'Evening walk',
    description: 'Hand in hand, watching the sun paint the sky in hues of gold and pink.'
  },
  {
    url: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999',
    caption: 'Coffee date',
    description: 'Quiet conversations and stolen glances over steaming cups of coffee.'
  }
];

const PhotoGrid: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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
      if (!isDialogOpen) {
        setActiveIndex((prev) => (prev + 1) % photos.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isDialogOpen]);
  
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: activeIndex * carouselRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);
  
  const openPhotoDialog = (index: number) => {
    setSelectedPhoto(index);
    setIsDialogOpen(true);
  };

  return (
    <section ref={sectionRef} className="w-full py-12 bg-wedding-cream/30">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            Our Journey Together
          </span>
          <h2 className="font-playfair text-3xl text-wedding-maroon">Photo Memories</h2>
        </div>
        
        {/* Mobile carousel */}
        <div className="relative md:hidden mb-8">
          <Carousel className="w-full">
            <CarouselContent>
              {photos.map((photo, index) => (
                <CarouselItem key={index}>
                  <div 
                    className={`glass-card overflow-hidden transition-all duration-500 ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div 
                      className="relative cursor-pointer"
                      onClick={() => openPhotoDialog(index)}
                    >
                      <AspectRatio ratio={4/3}>
                        <img 
                          src={photo.url} 
                          alt={photo.caption} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                          <div className="transform scale-0 hover:scale-100 transition-transform duration-300 bg-white/80 p-2 rounded-full">
                            <Maximize size={18} className="text-wedding-maroon" />
                          </div>
                        </div>
                      </AspectRatio>
                    </div>
                    <div className="text-center py-3">
                      <p className="text-sm font-medium text-wedding-maroon">{photo.caption}</p>
                      <p className="text-xs text-gray-600 mt-1 px-4">{photo.description.substring(0, 60)}...</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/70 hover:bg-white" />
            <CarouselNext className="right-2 bg-white/70 hover:bg-white" />
          </Carousel>
        </div>
        
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`glass-card overflow-hidden transition-all duration-500 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              } hover:shadow-gold-glow`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div 
                className="relative group cursor-pointer"
                onClick={() => openPhotoDialog(index)}
              >
                <AspectRatio ratio={4/3}>
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white/80 p-2 rounded-full mb-2">
                      <Maximize size={18} className="text-wedding-maroon" />
                    </div>
                  </div>
                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-white/0 group-hover:border-white/70 transition-all duration-300"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-white/0 group-hover:border-white/70 transition-all duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-white/0 group-hover:border-white/70 transition-all duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-white/0 group-hover:border-white/70 transition-all duration-300"></div>
                </AspectRatio>
                
                {/* Random floating heart effect */}
                {index % 2 === 0 && (
                  <Heart 
                    size={14} 
                    className="absolute text-wedding-blush/70 animate-float" 
                    style={{ 
                      top: `${20 + Math.random() * 30}%`, 
                      left: `${60 + Math.random() * 30}%`,
                      animationDuration: `${5 + Math.random() * 3}s`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                )}
                
                {/* Random floating star effect */}
                {index % 3 === 0 && (
                  <Star 
                    size={12} 
                    className="absolute text-wedding-gold/70 animate-float" 
                    style={{ 
                      top: `${30 + Math.random() * 40}%`, 
                      right: `${10 + Math.random() * 20}%`,
                      animationDuration: `${4 + Math.random() * 3}s`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                )}
              </div>
              <div className="text-center py-3 px-2">
                <p className="font-medium text-wedding-maroon">{photo.caption}</p>
                <p className="text-sm text-gray-600 mt-1">{photo.description.substring(0, 60)}...</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Photo Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-0">
            <DialogClose className="absolute right-4 top-4 z-10 bg-white/70 p-2 rounded-full hover:bg-white transition-colors duration-300" />
            
            <div className="relative">
              {selectedPhoto !== null && (
                <>
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={photos[selectedPhoto].url} 
                      alt={photos[selectedPhoto].caption} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <h3 className="font-dancing-script text-2xl mb-1">{photos[selectedPhoto].caption}</h3>
                    <p className="text-white/90 text-sm">{photos[selectedPhoto].description}</p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PhotoGrid;
