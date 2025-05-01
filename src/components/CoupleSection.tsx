
import React, { useState, useRef, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface PhotoSlide {
  url: string;
  caption?: string;
}

const CoupleSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<{[key: number]: boolean}>({});
  const isMobile = useIsMobile();

  // Demo photos for our journey
  const photos: PhotoSlide[] = [
    { 
      url: "/lovable-uploads/photo1.jpg", 
      caption: "When we first met" 
    },
    { 
      url: "/lovable-uploads/photo2.jpg", 
      caption: "Our first date" 
    },
    { 
      url: "/lovable-uploads/photo3.jpg", 
      caption: "Celebrating together" 
    },
    { 
      url: "/lovable-uploads/photo4.jpg", 
      caption: "Beautiful memories" 
    },
    { 
      url: "/lovable-uploads/photo5.jpg", 
      caption: "The proposal" 
    },
    { 
      url: "/lovable-uploads/photo6.jpg", 
      caption: "Our engagement" 
    },
  ];

  const handleLikePhoto = (index: number) => {
    setLikedPhotos(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
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
                  src="/lovable-uploads/7f492c44-762e-4c64-86d8-d52fc38e8e39.jpg" 
                  alt="Umashankar and Bhavana Wedding" 
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
        
        {/* Our Journey Photos Carousel */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h3 className="font-dancing-script text-2xl sm:text-3xl text-wedding-maroon mb-2">Our Love Story</h3>
            <p className="text-sm text-gray-600">Swipe to see highlights from our journey together</p>
          </div>
          
          <Carousel
            className="relative"
            opts={{
              align: "center",
              loop: true
            }}
          >
            <CarouselContent>
              {photos.map((photo, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 p-1">
                  <div className="relative group overflow-hidden rounded-lg shadow-gold-soft hover:shadow-gold-glow transition-all duration-300">
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img 
                        src={photo.url} 
                        alt={photo.caption || "Love journey"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-center text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="font-medium text-sm">{photo.caption}</p>
                    </div>
                    
                    {/* Like Button */}
                    <button 
                      className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${likedPhotos[index] ? 'bg-red-50/80 scale-110' : 'bg-white/70 opacity-0 group-hover:opacity-100'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePhoto(index);
                      }}
                      aria-label="Like photo"
                    >
                      <Heart 
                        size={16} 
                        className={`${likedPhotos[index] ? 'text-red-500 fill-red-500' : 'text-wedding-maroon'}`}
                      />
                    </button>
                    
                    {/* Decorative corners */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/40"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/40"></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/40"></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/40"></div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden sm:block">
              <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-none" />
              <CarouselNext className="right-2 bg-white/80 hover:bg-white border-none" />
            </div>
            
            {/* Mobile navigation dots */}
            {isMobile && (
              <div className="flex justify-center gap-1 mt-3">
                {photos.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full transition-all ${index === 0 ? 'bg-wedding-gold' : 'bg-wedding-gold/30'}`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
