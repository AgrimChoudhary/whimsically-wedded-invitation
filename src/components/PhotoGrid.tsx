
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface Photo {
  url: string;
}

interface PhotoGridProps {
  photos?: Photo[];
  title?: string;
}

const defaultPhotos: Photo[] = [
  { url: "/lovable-uploads/photo1.jpg" },
  { url: "/lovable-uploads/photo2.jpg" },
  { url: "/lovable-uploads/photo3.jpg" },
  { url: "/lovable-uploads/photo4.jpg" },
  { url: "/lovable-uploads/photo5.jpg" },
  { url: "/lovable-uploads/photo6.jpg" }
];

const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos = defaultPhotos,
  title = "Our Memories" 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const isMobile = useIsMobile();
  
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
  
  // Add keyboard navigation
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, selectedPhoto]);

  return (
    <div className="py-16 bg-wedding-cream/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl text-wedding-maroon mb-3">{title}</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <div className="w-2 h-2 rounded-full bg-wedding-gold/40"></div>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
        </div>
        
        <div 
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 opacity-0 transition-opacity duration-1000",
            isLoaded && "opacity-100"
          )}
        >
          {photos.map((photo, index) => (
            <div 
              key={index}
              className={cn(
                "aspect-square overflow-hidden rounded-lg cursor-pointer group relative transition-transform duration-500",
                isLoaded && "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => openLightbox(index)}
            >
              <img 
                src={photo.url} 
                alt="Wedding memory" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                  <p className="text-white font-medium truncate">{/* Nothing to render here */}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {isVisible && selectedPhoto !== null && (
          <div 
            className={cn(
              "fixed inset-0 z-50 bg-black/90 flex items-center justify-center transition-opacity duration-300",
              fadeOut ? "opacity-0" : "opacity-100"
            )}
            onClick={closeLightbox}
          >
            <div className="relative max-w-7xl max-h-[90vh] mx-4">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeLightbox();
                  }}
                  className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <img 
                src={photos[selectedPhoto].url} 
                alt="Wedding memory full size" 
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {photos.length > 1 && !isMobile && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto('prev');
                    }}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto('next');
                    }}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                  >
                    <ArrowRight size={24} />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white">{/* Nothing to render here */}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGrid;
