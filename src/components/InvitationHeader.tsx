
import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { useGuest } from '@/context/GuestContext';
import { AnimatedGuestName } from './AnimatedGuestName';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvitationHeaderProps {
  groomName?: string;
  brideName?: string;
}

const InvitationHeader: React.FC<InvitationHeaderProps> = ({ 
  groomName = "Sidharth", 
  brideName = "Kiara" 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({ ganesha: false, couple: false });
  const { guestName, isLoading: isGuestLoading } = useGuest();
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (imageType: 'ganesha' | 'couple') => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageType]: true
    }));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-wedding-cream via-wedding-blush/20 to-wedding-cream">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 opacity-20 animate-pulse-soft">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#D4AF37"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 w-16 h-16 opacity-20 animate-pulse-soft" style={{ animationDelay: '1s' }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#D4AF37"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        {/* Ganesha Image with loading placeholder */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            {!imagesLoaded.ganesha && (
              <div className="absolute inset-0 bg-wedding-cream/50 animate-pulse rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src="https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_fit,f_auto,q_auto/sample.jpg" 
              alt="Lord Ganesha" 
              className={`w-full h-full object-contain transition-opacity duration-300 ${imagesLoaded.ganesha ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => handleImageLoad('ganesha')}
              loading="eager"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Guest Welcome */}
          <div className="mb-6 relative">
            <h3 className="font-great-vibes text-xl md:text-2xl text-wedding-gold mb-2">
              Dear{' '}
              {isGuestLoading ? (
                <span className="inline-block w-20 h-6 bg-wedding-gold/20 rounded animate-pulse"></span>
              ) : (
                <AnimatedGuestName 
                  name={guestName}
                  animationType="brush"
                  className="font-great-vibes text-wedding-gold"
                  delay={700}
                  fallback="Honored Guest"
                />
              )}
            </h3>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/50 to-transparent mx-auto"></div>
          </div>

          {/* Wedding Announcement */}
          <div className="mb-8">
            <p className="text-sm md:text-base text-gray-600 mb-4 font-poppins leading-relaxed">
              You are cordially invited to celebrate the sacred union of
            </p>
            
            <div className="space-y-3 mb-6">
              <h1 className="font-great-vibes text-3xl md:text-5xl text-wedding-maroon">
                {groomName}
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
                <Heart size={20} className="text-wedding-blush fill-wedding-blush animate-pulse-soft" />
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
              </div>
              <h1 className="font-great-vibes text-3xl md:text-5xl text-wedding-maroon">
                {brideName}
              </h1>
            </div>
          </div>

          {/* Date Display */}
          <div className="mb-8">
            <div className="inline-block py-3 px-6 bg-wedding-gold/10 rounded-full border border-wedding-gold/30 shadow-gold-soft">
              <p className="text-wedding-maroon font-dancing-script text-lg md:text-xl">
                <Sparkles size={18} className="inline mr-2 text-wedding-gold" />
                June 30, 2025
                <Sparkles size={18} className="inline ml-2 text-wedding-gold" />
              </p>
            </div>
          </div>

          {/* Couple Image with loading placeholder */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden shadow-gold-soft">
            {!imagesLoaded.couple && (
              <div className="absolute inset-0 bg-wedding-cream/50 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src="https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,f_auto,q_auto,g_faces/sample.jpg" 
              alt="Traditional Indian Couple" 
              className={`w-full h-full object-cover transition-opacity duration-300 ${imagesLoaded.couple ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => handleImageLoad('couple')}
              loading="eager"
            />
            <div className="absolute inset-0 rounded-full border-4 border-wedding-gold/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationHeader;
