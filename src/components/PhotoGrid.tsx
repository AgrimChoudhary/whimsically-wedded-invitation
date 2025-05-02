
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X, Heart, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  url: string;
  title?: string;
  description?: string;
}

interface PhotoGridProps {
  photos?: Photo[];
  title?: string;
}

const defaultPhotos: Photo[] = [
  { 
    url: "/lovable-uploads/photo1.jpg",
    title: "First Date",
    description: "Where our story began"
  },
  { 
    url: "/lovable-uploads/photo2.jpg",
    title: "Mountain Hike",
    description: "Adventures together"
  },
  { 
    url: "/lovable-uploads/photo3.jpg",
    title: "Beach Day",
    description: "Sun, sand and love"
  },
  { 
    url: "/lovable-uploads/photo4.jpg",
    title: "Family Dinner",
    description: "Celebrations with loved ones"
  },
  { 
    url: "/lovable-uploads/photo5.jpg",
    title: "The Proposal",
    description: "The day I said yes!"
  },
  { 
    url: "/lovable-uploads/photo6.jpg",
    title: "Engagement Day",
    description: "Officially committed"
  }
];

const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos = defaultPhotos,
  title = "Our Photo Gallery" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<{[key: number]: boolean}>({});
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [likeAnimation, setLikeAnimation] = useState<{[key: number]: boolean}>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);
  
  const goToNextSlide = () => {
    setSlideDirection('left');
    setCurrentIndex(prevIndex => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  };
  
  const goToPrevSlide = () => {
    setSlideDirection('right');
    setCurrentIndex(prevIndex => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevSlide();
    } else if (e.key === 'ArrowRight') {
      goToNextSlide();
    } else if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };
  
  const toggleLike = (index: number) => {
    setLikedPhotos(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    
    // Trigger like animation
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
  
  // Add touch swipe support
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left
        goToNextSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right
        goToPrevSlide();
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, []);
  
  // Add keyboard navigation
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Animation variants
  const variants = {
    enter: (direction: string) => {
      return {
        x: direction === 'right' ? 300 : -300,
        opacity: 0,
        scale: 0.9
      };
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: (direction: string) => {
      return {
        x: direction === 'right' ? -300 : 300,
        opacity: 0,
        scale: 0.9,
        transition: {
          duration: 0.3
        }
      };
    }
  };
  
  // Heart animation variants
  const heartAnimationVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.5, 1], 
      opacity: [0, 1, 1],
      transition: { 
        duration: 0.5,
        times: [0, 0.3, 1]
      }
    }
  };

  return (
    <div className="py-16 bg-wedding-cream/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-dancing-script text-3xl sm:text-4xl text-wedding-maroon mb-3">{title}</h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto mb-3">
            Explore our collection of cherished moments that tell the story of our love
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <div className="w-2 h-2 rounded-full bg-wedding-gold/40 animate-pulse"></div>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
        </div>

        {/* Main photo carousel */}
        <div 
          ref={containerRef}
          className={cn(
            "relative bg-white p-6 rounded-lg shadow-md overflow-hidden transition-opacity duration-1000",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-wedding-cream/20 rounded-lg overflow-hidden">
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                key={currentIndex}
                custom={slideDirection}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                {/* Photo frame with decorative border */}
                <div className="relative w-full h-full overflow-hidden">
                  <img 
                    src={photos[currentIndex].url} 
                    alt={photos[currentIndex].title || "Wedding memory"} 
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                  
                  {/* Elegant frame */}
                  <div className="absolute inset-0 pointer-events-none border-[8px] border-white"></div>
                  <div className="absolute inset-[8px] pointer-events-none border border-wedding-gold/20"></div>
                  
                  {/* Photo info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h4 className="text-white font-medium text-lg">{photos[currentIndex].title}</h4>
                    {photos[currentIndex].description && (
                      <p className="text-white/80 text-sm mt-1">{photos[currentIndex].description}</p>
                    )}
                  </div>
                  
                  {/* Like button with animation */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(currentIndex);
                    }}
                  >
                    {likeAnimation[currentIndex] && (
                      <motion.div
                        variants={heartAnimationVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Heart 
                          className="text-red-500 fill-red-500" 
                          size={28} 
                        />
                      </motion.div>
                    )}
                    
                    <Heart 
                      size={20} 
                      className={likedPhotos[currentIndex] ? "text-red-500 fill-red-500" : "text-white"} 
                    />
                  </Button>
                  
                  {/* Fullscreen button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm"
                    onClick={() => setIsFullscreen(true)}
                  >
                    <Image size={16} className="text-wedding-maroon" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation arrows */}
            <Button
              size="icon"
              variant="ghost"
              onClick={goToPrevSlide}
              className="absolute top-1/2 left-2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-sm z-10"
            >
              <ArrowLeft size={18} className="text-wedding-maroon" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={goToNextSlide}
              className="absolute top-1/2 right-2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-sm z-10"
            >
              <ArrowRight size={18} className="text-wedding-maroon" />
            </Button>
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-4 gap-1.5">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-wedding-gold scale-110' 
                    : 'bg-wedding-gold/30 hover:bg-wedding-gold/50'
                }`}
                onClick={() => {
                  setSlideDirection(index > currentIndex ? 'left' : 'right');
                  setCurrentIndex(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Mobile swipe hint */}
          {isMobile && (
            <div className="text-center text-xs text-gray-500 mt-3">
              Swipe left or right to navigate
            </div>
          )}
        </div>
      </div>
      
      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white z-10"
              onClick={() => setIsFullscreen(false)}
            >
              <X size={24} />
            </Button>
            
            <div className="relative w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={slideDirection}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative"
                >
                  <img 
                    src={photos[currentIndex].url} 
                    alt={photos[currentIndex].title || "Wedding memory"} 
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  
                  {/* Photo info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h4 className="text-white font-medium text-lg">{photos[currentIndex].title}</h4>
                    {photos[currentIndex].description && (
                      <p className="text-white/80 text-sm mt-1">{photos[currentIndex].description}</p>
                    )}
                  </div>
                  
                  {/* Like button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-black/40 hover:bg-black/60"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(currentIndex);
                    }}
                  >
                    {likeAnimation[currentIndex] && (
                      <motion.div
                        variants={heartAnimationVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Heart 
                          className="text-red-500 fill-red-500" 
                          size={40} 
                        />
                      </motion.div>
                    )}
                    
                    <Heart 
                      size={28} 
                      className={likedPhotos[currentIndex] ? "text-red-500 fill-red-500" : "text-white"} 
                    />
                  </Button>
                </motion.div>
              </AnimatePresence>
              
              {/* Fullscreen navigation */}
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide();
                }}
                className="absolute top-1/2 left-4 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 hover:bg-black/60 text-white"
              >
                <ArrowLeft size={24} />
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide();
                }}
                className="absolute top-1/2 right-4 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 hover:bg-black/60 text-white"
              >
                <ArrowRight size={24} />
              </Button>
              
              {/* Photo counter */}
              <Badge className="absolute top-4 left-4 bg-black/60 text-white">
                {currentIndex + 1} / {photos.length}
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGrid;
