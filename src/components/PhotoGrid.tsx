
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X, Heart, Star, Image, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

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
    title: "First Date"
  },
  { 
    url: "/lovable-uploads/photo2.jpg",
    title: "Mountain Hike"
  },
  { 
    url: "/lovable-uploads/photo3.jpg",
    title: "Beach Day"
  },
  { 
    url: "/lovable-uploads/photo4.jpg",
    title: "Family Dinner"
  },
  { 
    url: "/lovable-uploads/photo5.jpg",
    title: "The Proposal"
  },
  { 
    url: "/lovable-uploads/photo6.jpg",
    title: "Engagement Day"
  }
];

const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos = defaultPhotos,
  title = "Our Photo Gallery" 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<{[key: number]: boolean}>({});
  const [likeAnimation, setLikeAnimation] = useState<{[key: number]: boolean}>({});
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const isMobile = useIsMobile();
  const lightboxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);
  
  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setFadeOut(false);
      document.body.style.overflow = 'auto';
    }, 300);
  };
  
  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (selectedPhoto === null) return;
    
    // Set the slide direction for animation
    setSlideDirection(direction === 'prev' ? 'right' : 'left');
    
    // Play page turn sound
    const audioElement = new Audio('/sounds/page-turn.mp3');
    audioElement.volume = 0.3;
    audioElement.play().catch(err => console.log('Audio play failed:', err));
    
    // Apply a fade-out effect
    setFadeOut(true);
    
    setTimeout(() => {
      if (direction === 'prev') {
        setSelectedPhoto(prev => (prev === 0 ? photos.length - 1 : prev - 1));
      } else {
        setSelectedPhoto(prev => (prev === photos.length - 1 ? 0 : prev + 1));
      }
      setFadeOut(false);
    }, 200); // Short delay for the transition
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isVisible) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigatePhoto('prev');
      } else if (e.key === 'ArrowRight') {
        navigatePhoto('next');
      }
    }
  };
  
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
  
  // Add touch swipe support for lightbox
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
      if (touchStartX - touchEndX > 50) {
        // Swipe left
        navigatePhoto('next');
      } else if (touchEndX - touchStartX > 50) {
        // Swipe right
        navigatePhoto('prev');
      }
    };
    
    const lightbox = lightboxRef.current;
    if (lightbox && isVisible) {
      lightbox.addEventListener('touchstart', handleTouchStart);
      lightbox.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        lightbox.removeEventListener('touchstart', handleTouchStart);
        lightbox.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isVisible, selectedPhoto]);
  
  // Add keyboard navigation
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, selectedPhoto]);

  // Variants for framer-motion animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const lightboxVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const slideVariants = {
    enterFromLeft: {
      x: -50,
      opacity: 0
    },
    enterFromRight: {
      x: 50,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exitToLeft: {
      x: -50,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    exitToRight: {
      x: 50,
      opacity: 0,
      transition: {
        duration: 0.3
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
        
        {/* Improved gallery with mobile-friendly slides */}
        <div className="relative bg-white p-6 rounded-lg shadow-md mb-8 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-wedding-maroon font-medium">Browse Our Photos</h3>
            <Badge variant="outline" className="bg-wedding-gold/10">
              <ZoomIn size={14} className="mr-1" /> Click to Enlarge
            </Badge>
          </div>
          
          <div 
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-0 transition-opacity duration-1000",
              isLoaded && "opacity-100"
            )}
          >
            {photos.map((photo, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                className="relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:shadow-lg"
                onClick={() => openLightbox(index)}
              >
                <AspectRatio ratio={1} className="bg-wedding-cream">
                  <img 
                    src={photo.url} 
                    alt={photo.title || "Wedding memory"} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Simple elegant frame */}
                  <div className="absolute inset-0 border-[4px] border-white pointer-events-none"></div>
                  
                  {/* View overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 px-3 py-2 rounded-full flex items-center gap-2">
                      <ZoomIn size={16} className="text-wedding-maroon" />
                      <span className="text-sm font-medium text-wedding-maroon">View</span>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  {photo.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-center text-sm">
                      {photo.title}
                    </div>
                  )}
                </AspectRatio>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Lightbox with improved transitions */}
        <AnimatePresence>
          {isVisible && selectedPhoto !== null && (
            <motion.div 
              ref={lightboxRef}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={lightboxVariants}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              onClick={closeLightbox}
            >
              <div className="relative max-w-7xl max-h-[90vh] mx-4">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeLightbox();
                    }}
                    className="bg-black/30 hover:bg-black/50 text-white rounded-full"
                  >
                    <X size={24} />
                  </Button>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedPhoto}
                    initial={slideDirection === 'left' ? "enterFromRight" : "enterFromLeft"}
                    animate="center"
                    exit={slideDirection === 'left' ? "exitToLeft" : "exitToRight"}
                    variants={slideVariants}
                    className={`relative transition-opacity duration-300 ${fadeOut ? 'opacity-50' : 'opacity-100'}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-white p-2 rounded-lg shadow-xl overflow-hidden">
                      <img 
                        src={photos[selectedPhoto].url} 
                        alt={photos[selectedPhoto].title || "Wedding memory"} 
                        className="max-w-full max-h-[70vh] object-contain"
                      />
                    </div>
                    
                    {/* Photo info */}
                    {(photos[selectedPhoto].title || photos[selectedPhoto].description) && (
                      <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm text-white text-center rounded-lg">
                        {photos[selectedPhoto].title && <h4 className="font-medium">{photos[selectedPhoto].title}</h4>}
                        {photos[selectedPhoto].description && <p className="text-sm opacity-90 mt-1">{photos[selectedPhoto].description}</p>}
                      </div>
                    )}
                    
                    {/* Like button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePhoto(selectedPhoto);
                      }}
                    >
                      <Heart
                        size={20}
                        className={likedPhotos[selectedPhoto] ? 'text-red-500 fill-red-500' : 'text-white'}
                      />
                    </Button>
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation buttons */}
                {photos.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigatePhoto('prev');
                      }}
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12"
                    >
                      <ArrowLeft size={24} />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigatePhoto('next');
                      }}
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12"
                    >
                      <ArrowRight size={24} />
                    </Button>
                  </>
                )}
                
                {/* Photo counter badge */}
                <Badge 
                  className="absolute top-4 left-4 bg-black/50 text-white hover:bg-black/50"
                >
                  <Image size={14} className="mr-1" /> {selectedPhoto + 1} / {photos.length}
                </Badge>
                
                {/* Mobile swiping hint */}
                {isMobile && (
                  <div className="absolute bottom-16 left-0 right-0 text-center text-white/60 text-sm">
                    Swipe left or right to navigate
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PhotoGrid;
