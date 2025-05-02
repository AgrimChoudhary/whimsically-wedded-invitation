
import React, { useState, useRef, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface PhotoSlide {
  url: string;
  caption?: string;
}

const memories = [
  {
    url: "/lovable-uploads/photo1.jpg",
    caption: "First Date"
  },
  {
    url: "/lovable-uploads/photo2.jpg",
    caption: "Mountain Hike"
  },
  {
    url: "/lovable-uploads/photo3.jpg",
    caption: "Beach Day"
  },
  {
    url: "/lovable-uploads/photo4.jpg",
    caption: "Family Dinner"
  },
  {
    url: "/lovable-uploads/photo5.jpg",
    caption: "The Proposal"
  },
  {
    url: "/lovable-uploads/photo6.jpg",
    caption: "Engagement Day"
  }
];

const CoupleSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<{[key: number]: boolean}>({});
  const [likeAnimation, setLikeAnimation] = useState<{[key: number]: boolean}>({});
  const isMobile = useIsMobile();

  const handleLikePhoto = (index: number) => {
    setLikedPhotos(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    setLikeAnimation(prev => ({
      ...prev,
      [index]: true
    }));
    setTimeout(() => {
      setLikeAnimation(prev => ({
        ...prev,
        [index]: false
      }));
    }, 1000);
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

        {/* Our Memories Carousel */}
        <div className="mt-16 mb-12">
          <div className="text-center mb-10">
            <h2 className="font-dancing-script text-3xl sm:text-4xl text-wedding-maroon mb-2">Our Memories</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Explore our collection of cherished moments that tell the story of our love
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
              <div className="w-2 h-2 rounded-full bg-wedding-gold/40 animate-pulse"></div>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
            </div>
          </div>

          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-24">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {memories.map((memory, index) => (
                  <CarouselItem key={index} className="pl-4 md:pl-6 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                    <div className="relative group">
                      <Card className="rounded-xl overflow-hidden border-2 border-wedding-gold/10 hover:border-wedding-gold/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <CardContent className="p-0 relative">
                          <AspectRatio ratio={3/4} className="bg-wedding-cream">
                            <img 
                              src={memory.url} 
                              alt={memory.caption || "Wedding memory"} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </AspectRatio>

                          {/* Elegant frame effect */}
                          <div className="absolute inset-0 pointer-events-none border-[8px] border-white/40"></div>
                          <div className="absolute inset-4 pointer-events-none border border-wedding-gold/20"></div>
                          <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-wedding-gold/40"></div>
                          <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-wedding-gold/40"></div>
                          <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-wedding-gold/40"></div>
                          <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-wedding-gold/40"></div>

                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Caption */}
                          {memory.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-center text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent pt-8">
                              <p className="font-medium text-sm md:text-base">{memory.caption}</p>
                            </div>
                          )}

                          {/* Like button */}
                          <Button
                            size="icon"
                            variant="outline"
                            className={`absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md transition-all duration-300 ${likedPhotos[index] ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePhoto(index);
                            }}
                            aria-label={likedPhotos[index] ? "Unlike photo" : "Like photo"}
                          >
                            <Heart
                              size={16}
                              className={`transition-colors ${likedPhotos[index] ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                            />
                          </Button>
                          
                          {/* Heart animation */}
                          {likeAnimation[index] && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Heart
                                size={48}
                                className="text-red-500 fill-red-500 animate-scale-up-fade opacity-0"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center gap-2 mt-6">
                <CarouselPrevious className="static transform-none h-9 w-9 rounded-full border-wedding-gold/30 bg-white/80 hover:bg-wedding-gold/10" />
                <CarouselNext className="static transform-none h-9 w-9 rounded-full border-wedding-gold/30 bg-white/80 hover:bg-wedding-gold/10" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
