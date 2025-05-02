
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
  title = "Our Memories" 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<{[key: number]: boolean}>({});
  const [likeAnimation, setLikeAnimation] = useState<{[key: number]: boolean}>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const isMobile = useIsMobile();
  const lightboxRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Animation controls for each photo
  const controls = useAnimation();
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % photos.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, photos.length]);
  
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
    
    // Play page turn sound
    const audioElement = new Audio('/sounds/page-turn.mp3');
    audioElement.volume = 0.3;
    audioElement.play().catch(err => console.log('Audio play failed:', err));
    
    if (direction === 'prev') {
      setSelectedPhoto(prev => (prev === 0 ? photos.length - 1 : prev - 1));
    } else {
      setSelectedPhoto(prev => (prev === photos.length - 1 ? 0 : prev + 1));
    }
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

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      photoRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isVisible) {
            const scrollPosition = window.scrollY;
            const offset = scrollPosition * 0.05 * (index % 3 === 0 ? 0.7 : index % 3 === 1 ? 1 : 1.3);
            ref.style.transform = `translateY(${offset}px) scale(${1 + Math.min(offset * 0.0005, 0.05)})`;
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
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
        
        <div 
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-0 transition-opacity duration-1000",
            isLoaded && "opacity-100"
          )}
        >
          {photos.map((photo, index) => (
            <motion.div 
              key={index}
              ref={el => photoRefs.current[index] = el}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              custom={index}
              className={cn(
                "aspect-square overflow-hidden rounded-lg cursor-pointer group relative transition-all duration-500 photo-frame",
                isLoaded && "animate-fade-in"
              )}
              onClick={() => openLightbox(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold-light/10 to-gold-dark/10 z-10 pointer-events-none"></div>
              
              <AspectRatio ratio={1} className="bg-wedding-cream">
                <img 
                  src={photo.url} 
                  alt={photo.title || "Wedding memory"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </AspectRatio>
              
              {/* Elegant photo frame */}
              <div className="absolute inset-0 border-[12px] border-white shadow-lg pointer-events-none transform translate-z-0 perspective-1000">
                <div className="absolute inset-0 border border-wedding-gold/20"></div>
                
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-wedding-gold/40"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-wedding-gold/40"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-wedding-gold/40"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-wedding-gold/40"></div>
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
              
              {/* Click to view indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <ZoomIn size={16} className="text-wedding-maroon" />
                  <span className="text-sm font-medium text-wedding-maroon">View</span>
                </div>
              </div>
              
              {/* Caption */}
              {photo.title && (
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent pt-8 z-30">
                  <p className="font-medium">{photo.title}</p>
                  {photo.description && <p className="text-xs opacity-80">{photo.description}</p>}
                </div>
              )}
              
              {/* Like button */}
              <Button
                size="icon"
                variant="ghost"
                className={`absolute bottom-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md transition-all duration-300 z-30 ${likedPhotos[index] ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikePhoto(index);
                }}
                aria-label={likedPhotos[index] ? "Unlike photo" : "Like photo"}
              >
                <Heart
                  size={18}
                  className={`transition-colors ${likedPhotos[index] ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                />
              </Button>
              
              {/* Heart animation */}
              {likeAnimation[index] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                  <Heart
                    size={48}
                    className="text-red-500 fill-red-500 animate-scale-up-fade opacity-0"
                  />
                </div>
              )}
              
              {/* Decorative elements */}
              <div className="absolute top-3 left-3 w-3 h-3 z-30">
                <Star size={12} className="text-wedding-gold/70" fill="#D4AF37" />
              </div>
              <div className="absolute top-3 right-3 w-3 h-3 z-30">
                <Star size={12} className="text-wedding-gold/70" fill="#D4AF37" />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Lightbox */}
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
                
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Elegant photo frame in lightbox */}
                  <div className="p-4 bg-white shadow-2xl rounded-lg overflow-hidden">
                    <div className="relative">
                      <img 
                        src={photos[selectedPhoto].url} 
                        alt={photos[selectedPhoto].title || "Wedding memory full size"} 
                        className="max-w-full max-h-[70vh] object-contain"
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      {/* Decorative frame elements */}
                      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-wedding-gold/40"></div>
                      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-wedding-gold/40"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-wedding-gold/40"></div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-wedding-gold/40"></div>
                    </div>
                  </div>
                  
                  {/* Photo info overlay */}
                  {(photos[selectedPhoto].title || photos[selectedPhoto].description) && (
                    <div className="absolute -bottom-12 left-0 right-0 p-4 bg-white/10 backdrop-blur-sm text-white text-center rounded-lg">
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
                  
                  {/* Counter badge */}
                  <Badge 
                    className="absolute top-4 left-4 bg-black/50 text-white hover:bg-black/50"
                  >
                    <Image size={14} className="mr-1" /> {selectedPhoto + 1} / {photos.length}
                  </Badge>
                </motion.div>
                
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
