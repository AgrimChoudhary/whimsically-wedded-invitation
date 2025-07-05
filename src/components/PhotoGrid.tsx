
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, Heart, Play, Pause, ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface PhotoGridProps {
  title?: string;
}

interface PhotoWithLikes {
  id: string;
  url: string;
  title: string;
  description: string;
  likes: number;
  isLiked: boolean;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ title = "Our Memories" }) => {
  const { weddingData } = useWedding();
  const isMobile = useIsMobile();
  const [fullscreenImage, setFullscreenImage] = useState<number | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [photosWithLikes, setPhotosWithLikes] = useState<PhotoWithLikes[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize photos with likes data
  useEffect(() => {
    const initialPhotos = weddingData.photoGallery.map(photo => ({
      ...photo,
      likes: Math.floor(Math.random() * 50) + 5, // Random likes between 5-55
      isLiked: Math.random() > 0.7, // 30% chance of being liked
    }));
    setPhotosWithLikes(initialPhotos);
  }, [weddingData.photoGallery]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoplay || fullscreenImage === null) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photosWithLikes.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isAutoplay, fullscreenImage, photosWithLikes.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (fullscreenImage === null) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          setFullscreenImage(null);
          setIsAutoplay(false);
          break;
        case ' ':
          e.preventDefault();
          setIsAutoplay(!isAutoplay);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [fullscreenImage, isAutoplay]);

  const handleImageClick = (index: number) => {
    setFullscreenImage(index);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % photosWithLikes.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + photosWithLikes.length) % photosWithLikes.length);
  };

  const handleLike = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotosWithLikes(prev => 
      prev.map(photo => 
        photo.id === photoId 
          ? { 
              ...photo, 
              isLiked: !photo.isLiked,
              likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1
            }
          : photo
      )
    );
  };

  const handleShare = async (photo: PhotoWithLikes, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          url: photo.url
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(photo.url);
        // You could show a toast here
        console.log('Link copied to clipboard');
      } catch (error) {
        console.error('Failed to copy link');
      }
    }
  };

  const handleDownload = (photo: PhotoWithLikes, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full py-16 bg-gradient-to-br from-wedding-cream/30 via-white to-wedding-blush/20">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-dancing-script text-3xl sm:text-4xl text-wedding-maroon mb-4">{title}</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <div className="w-2 h-2 rounded-full bg-wedding-gold/40 animate-pulse"></div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {photosWithLikes.map((photo, index) => (
            <Card 
              key={photo.id} 
              className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-wedding-gold/30 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => handleImageClick(index)}
            >
              <CardContent className="p-0 relative">
                <div className="aspect-square overflow-hidden bg-wedding-cream/20">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay with enhanced effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white text-xs font-medium truncate mb-1">{photo.title}</h3>
                      
                      {/* Action buttons */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => handleLike(photo.id, e)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                            photo.isLiked 
                              ? 'bg-red-500/80 text-white' 
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Heart size={10} fill={photo.isLiked ? 'currentColor' : 'none'} />
                          <span>{photo.likes}</span>
                        </button>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => handleShare(photo, e)}
                            className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                          >
                            <Share2 size={10} />
                          </button>
                          <button
                            onClick={(e) => handleDownload(photo, e)}
                            className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                          >
                            <Download size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fullscreen modal */}
        {fullscreenImage !== null && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close button */}
              <button
                onClick={() => {
                  setFullscreenImage(null);
                  setIsAutoplay(false);
                }}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Navigation buttons */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={24} />
              </button>

              {/* Autoplay control */}
              <button
                onClick={() => setIsAutoplay(!isAutoplay)}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                {isAutoplay ? <Pause size={20} /> : <Play size={20} />}
              </button>

              {/* Main image */}
              <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
                <img 
                  src={photosWithLikes[currentIndex]?.url} 
                  alt={photosWithLikes[currentIndex]?.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
                
                {/* Image info overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-1">{photosWithLikes[currentIndex]?.title}</h3>
                      <p className="text-sm text-gray-300">Photo {currentIndex + 1} of {photosWithLikes.length}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleLike(photosWithLikes[currentIndex]?.id, e)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                          photosWithLikes[currentIndex]?.isLiked 
                            ? 'bg-red-500/80 text-white' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Heart size={16} fill={photosWithLikes[currentIndex]?.isLiked ? 'currentColor' : 'none'} />
                        <span>{photosWithLikes[currentIndex]?.likes}</span>
                      </button>
                      
                      <button
                        onClick={(e) => handleShare(photosWithLikes[currentIndex], e)}
                        className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      >
                        <Share2 size={16} />
                      </button>
                      
                      <button
                        onClick={(e) => handleDownload(photosWithLikes[currentIndex], e)}
                        className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-sm overflow-x-auto">
                {photosWithLikes.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentIndex ? 'border-wedding-gold' : 'border-white/30'
                    }`}
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGrid;
