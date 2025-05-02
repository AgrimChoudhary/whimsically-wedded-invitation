
import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, ChevronLeft, ChevronRight, Heart, ExpandIcon } from 'lucide-react';
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
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const isMobile = useIsMobile();

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === memories.length - 1 ? 0 : prev + 1));
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? memories.length - 1 : prev - 1));
  };

  // Auto-advance the slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextPhoto();
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

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

        {/* Our Memories Slideshow */}
        <div className="mt-16 mb-12">
          <div className="text-center mb-8">
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

          <div className="relative bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-gold-soft border border-wedding-gold/20">
            <div className="relative overflow-hidden rounded-lg aspect-[4/3] md:aspect-[16/9]">
              {/* Current image with transition */}
              <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-100">
                <img 
                  src={memories[currentPhotoIndex].url} 
                  alt={memories[currentPhotoIndex].caption || "Wedding memory"} 
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Elegant frame effect */}
                <div className="absolute inset-0 pointer-events-none border-[8px] border-white/40"></div>
                <div className="absolute inset-4 pointer-events-none border border-wedding-gold/20"></div>

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-center text-sm md:text-base">
                    {memories[currentPhotoIndex].caption}
                  </p>
                </div>
                
                {/* Fullscreen hint */}
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullImage(true);
                  }}
                >
                  <ExpandIcon size={16} className="text-wedding-maroon" />
                </Button>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/50 hover:bg-white/80"
                onClick={handlePrevPhoto}
              >
                <ChevronLeft size={24} className="text-wedding-maroon" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/50 hover:bg-white/80"
                onClick={handleNextPhoto}
              >
                <ChevronRight size={24} className="text-wedding-maroon" />
              </Button>
            </div>

            {/* Indicator dots */}
            <div className="absolute bottom-[-20px] left-0 right-0 flex justify-center gap-1.5">
              {memories.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPhotoIndex ? 'bg-wedding-gold scale-125' : 'bg-wedding-gold/30'
                  }`}
                  onClick={() => setCurrentPhotoIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen image dialog */}
      <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-wedding-gold/30">
          <div className="relative">
            <img 
              src={memories[currentPhotoIndex].url} 
              alt={memories[currentPhotoIndex].caption || "Wedding memory"} 
              className="w-full h-auto"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
              <p className="text-white text-center">
                {memories[currentPhotoIndex].caption}
              </p>
            </div>
            
            {/* Navigation in fullscreen */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 left-2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
            >
              <ChevronLeft size={24} className="text-white" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 right-2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
            >
              <ChevronRight size={24} className="text-white" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CoupleSection;
