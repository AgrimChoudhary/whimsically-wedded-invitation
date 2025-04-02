
import React, { useRef, useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { TriangleRight, Maximize, Heart, Star, Image, Eye } from 'lucide-react';
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
    url: '/lovable-uploads/photo1.jpg',
    caption: 'Our first date'
  },
  {
    url: '/lovable-uploads/photo2.jpg',
    caption: 'Beach vacation'
  },
  {
    url: '/lovable-uploads/photo3.jpg',
    caption: 'City lights'
  },
  {
    url: '/lovable-uploads/photo4.jpg',
    caption: 'The proposal'
  },
  {
    url: '/lovable-uploads/photo5.jpg',
    caption: 'Evening walk'
  },
  {
    url: '/lovable-uploads/photo6.jpg',
    caption: 'Coffee date'
  }
];

// Fallback images if user uploads aren't available
const fallbackPhotos = [
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
  'https://images.unsplash.com/photo-1529636798458-92182e662485',
  'https://images.unsplash.com/photo-1537907510278-10acdb198d0f',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf',
  'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a',
  'https://images.unsplash.com/photo-1516589091380-5d8e87df6999'
];

const PhotoGrid: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Check if the user's photos exist, otherwise use fallbacks
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImagesLoaded(true);
    img.onerror = () => setImagesLoaded(false);
    img.src = photos[0].url;
  }, []);
  
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
    setCarouselIndex(index);
    setIsDialogOpen(true);
  };
  
  const getPhotoUrl = (index: number) => {
    return imagesLoaded ? photos[index].url : fallbackPhotos[index % fallbackPhotos.length];
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <section ref={sectionRef} className="w-full py-10 bg-wedding-cream/30">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            <Image size={12} className="inline mr-1" /> Our Journey Together
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl text-wedding-maroon mb-1">Photo Memories</h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">Moments captured in time, memories that will last forever</p>
        </div>
        
        {/* Mobile carousel with enhanced navigation */}
        <div className="relative md:hidden mb-6">
          <Carousel className="w-full" setApi={api => api && api.scrollTo(carouselIndex)}>
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
                          src={getPhotoUrl(index)} 
                          alt={photo.caption} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          loading="lazy"
                        />
                        
                        {/* Floating hearts animation */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {[...Array(5)].map((_, i) => (
                            <Heart 
                              key={i}
                              size={12 + Math.random() * 8} 
                              className="absolute text-wedding-blush/60 animate-float" 
                              fill="#FFDEE2"
                              style={{ 
                                top: `${10 + Math.random() * 80}%`, 
                                left: `${10 + Math.random() * 80}%`,
                                animationDuration: `${5 + Math.random() * 5}s`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: 0.5 + Math.random() * 0.5
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* View button overlay */}
                        <div className="absolute top-2 right-2 z-10">
                          <button 
                            className="bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPhotoDialog(index);
                            }}
                            aria-label="View photo"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                          <p className="text-white font-dancing-script text-lg">{photo.caption}</p>
                        </div>
                      </AspectRatio>
                      
                      {/* Photo frame effect */}
                      <div className="absolute inset-0 border-[3px] border-white/70 shadow-lg pointer-events-none"></div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/70 hover:bg-white" />
            <CarouselNext className="right-2 bg-white/70 hover:bg-white" />
          </Carousel>
          
          {/* Improved mobile indicators */}
          <div className="flex justify-center gap-1 mt-2">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-wedding-gold w-4' 
                    : 'bg-wedding-gold/30'
                }`}
                onClick={() => {
                  setActiveIndex(index);
                  setCarouselIndex(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Enhanced desktop grid with honeycomb-inspired layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`glass-card overflow-hidden transition-all duration-500 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              } hover:shadow-gold-glow photo-3d-effect`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                transform: hoveredIndex === index ? 'scale(1.05) rotate(1deg)' : 'scale(1) rotate(0deg)'
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="relative group cursor-pointer"
                onClick={() => openPhotoDialog(index)}
              >
                <AspectRatio ratio={4/3}>
                  <img 
                    src={getPhotoUrl(index)} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Floating hearts animation - only visible on hover */}
                  {hoveredIndex === index && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(8)].map((_, i) => (
                        <Heart 
                          key={i}
                          size={12 + Math.random() * 12} 
                          className="absolute text-wedding-blush/60 animate-float" 
                          fill="#FFDEE2"
                          style={{ 
                            top: `${10 + Math.random() * 80}%`, 
                            left: `${10 + Math.random() * 80}%`,
                            animationDuration: `${3 + Math.random() * 3}s`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: 0.5 + Math.random() * 0.5
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Transparent view button */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      className="bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPhotoDialog(index);
                      }}
                      aria-label="View photo"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                    <p className="text-white font-dancing-script text-xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {photo.caption}
                    </p>
                  </div>
                  
                  {/* Enhanced photo frame effect */}
                  <div className="absolute inset-0 border-4 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  {/* Decorative corners */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-white/0 group-hover:border-white/70 transition-all duration-300"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-white/0 group-hover:border-white/70 transition-all duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-white/0 group-hover:border-white/70 transition-all duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-white/0 group-hover:border-white/70 transition-all duration-300"></div>
                </AspectRatio>
                
                {/* Enhanced glitter effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 glitter-effect pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Photo Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-0" aria-describedby="photo-dialog-description">
            <DialogClose className="absolute right-4 top-4 z-10 bg-white/70 p-2 rounded-full hover:bg-white transition-colors duration-300" />
            
            <div className="relative">
              {selectedPhoto !== null && (
                <>
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={getPhotoUrl(selectedPhoto)} 
                      alt={photos[selectedPhoto].caption} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating hearts animation in fullscreen view */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(12)].map((_, i) => (
                        <Heart 
                          key={i}
                          size={16 + Math.random() * 14} 
                          className="absolute text-wedding-blush/60 animate-float" 
                          fill="#FFDEE2"
                          style={{ 
                            top: `${Math.random() * 100}%`, 
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${5 + Math.random() * 5}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: 0.3 + Math.random() * 0.4
                          }}
                        />
                      ))}
                    </div>
                  </AspectRatio>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <h3 className="font-dancing-script text-2xl mb-1">{photos[selectedPhoto].caption}</h3>
                    <p id="photo-dialog-description" className="sr-only">Fullscreen view of {photos[selectedPhoto].caption}</p>
                  </div>
                  
                  {/* Navigation arrows for the dialog */}
                  <button 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIndex = (selectedPhoto - 1 + photos.length) % photos.length;
                      setSelectedPhoto(newIndex);
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIndex = (selectedPhoto + 1) % photos.length;
                      setSelectedPhoto(newIndex);
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
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
