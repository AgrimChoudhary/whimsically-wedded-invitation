
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
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80",
    title: "Our Wedding Day",
    description: "The most magical day of our lives"
  },
  { 
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    title: "Mehendi Celebration",
    description: "Celebrating our mehendi ceremony with loved ones"
  },
  { 
    url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    title: "Mumbai Reception",
    description: "Our reception with friends and family"
  },
  { 
    url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    title: "Wedding Jewelry",
    description: "Beautiful jewelry for our special day"
  },
  { 
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    title: "Sangeet Ceremony",
    description: "Joyful moments from our sangeet celebration"
  },
  { 
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80&auto=format&fit=crop",
    title: "Wedding Portrait",
    description: "A special portrait after our wedding"
  },
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
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: number]: boolean}>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const handleImageLoad = (index: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [index]: true
    }));
  };
  
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
        goToNextSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {
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
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

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
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: (direction: string) => {
      return {
        x: direction === 'right' ? -300 : 300,
        opacity: 0,
        scale: 0.9,
        transition: {
          duration: 0.2
        }
      };
    }
  };
  
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
    <div className="py-12 bg-wedding-cream/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-maroon mb-3">{title}</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-3">
            Explore our collection of cherished moments that tell the story of our love
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-wedding-gold/40 animate-pulse"></div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
        </div>

        <div 
          ref={containerRef}
          className={cn(
            "relative bg-white p-4 sm:p-5 rounded-lg shadow-md overflow-hidden transition-opacity duration-1000 max-w-3xl mx-auto",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-wedding-cream/20 rounded-lg overflow-hidden">
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
                <div className="relative w-full h-full overflow-hidden">
                  {!imageLoadingStates[currentIndex] && (
                    <div className="absolute inset-0 bg-wedding-cream/50 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <img 
                    src={photos[currentIndex].url} 
                    alt={photos[currentIndex].title || "Wedding memory"} 
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-300",
                      imageLoadingStates[currentIndex] ? "opacity-100" : "opacity-0"
                    )}
                    loading="lazy"
                    onLoad={() => handleImageLoad(currentIndex)}
                  />
                  
                  <div className="absolute inset-0 pointer-events-none border-[6px] border-white"></div>
                  <div className="absolute inset-[6px] pointer-events-none border border-wedding-gold/20"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <h4 className="text-white font-medium text-sm sm:text-base">{photos[currentIndex].title}</h4>
                    {photos[currentIndex].description && (
                      <p className="text-white/80 text-xs sm:text-sm mt-1">{photos[currentIndex].description}</p>
                    )}
                  </div>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm transition-all duration-300"
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
                          size={20} 
                        />
                      </motion.div>
                    )}
                    
                    <Heart 
                      size={16} 
                      className={likedPhotos[currentIndex] ? "text-red-500 fill-red-500" : "text-white"} 
                    />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm"
                    onClick={() => setIsFullscreen(true)}
                  >
                    <Image size={14} className="text-wedding-maroon" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={goToPrevSlide}
              className="absolute top-1/2 left-2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-sm z-10"
            >
              <ArrowLeft size={16} className="text-wedding-maroon" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={goToNextSlide}
              className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-sm z-10"
            >
              <ArrowRight size={16} className="text-wedding-maroon" />
            </Button>
          </div>
          
          <div className="flex justify-center mt-3 gap-1">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
          
          {isMobile && (
            <div className="text-center text-xs text-gray-500 mt-2">
              Swipe left or right to navigate
            </div>
          )}
        </div>
      </div>
      
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
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h4 className="text-white font-medium text-lg">{photos[currentIndex].title}</h4>
                    {photos[currentIndex].description && (
                      <p className="text-white/80 text-sm mt-1">{photos[currentIndex].description}</p>
                    )}
                  </div>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-black/40 hover:bg-black/60"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(currentIndex);
                    }}
                  >
                    <Heart 
                      size={28} 
                      className={likedPhotos[currentIndex] ? "text-red-500 fill-red-500" : "text-white"} 
                    />
                  </Button>
                </motion.div>
              </AnimatePresence>
              
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
