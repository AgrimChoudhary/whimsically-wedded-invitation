
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, Heart, Sparkles, Users, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useWishes } from '@/hooks/useWishes';
import { useGuest } from '@/context/GuestContext';
import { useIsMobile } from '@/hooks/use-mobile';
import WishCard from './WishCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface WishesCarouselProps {
  onViewAll?: () => void;
}

const WishesCarousel: React.FC<WishesCarouselProps> = ({ onViewAll }) => {
  const [wishText, setWishText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { wishes, isLoading, isSubmitting, submitWish, toggleLike } = useWishes();
  const { guestId, guestName } = useGuest();
  const isMobile = useIsMobile();

  const handleSubmitWish = async () => {
    if (!wishText.trim() || !guestId || !guestName) return;

    const success = await submitWish(wishText, guestId, guestName);
    if (success) {
      setWishText('');
      setIsExpanded(false);
    }
  };

  const handleLike = (wishId: string) => {
    if (guestId && guestName) {
      toggleLike(wishId, guestId, guestName);
    }
  };

  const displayWishes = wishes.slice(0, 8); // Show latest 8 wishes in carousel

  return (
    <div className="py-8 w-full bg-gradient-to-b from-white/60 to-wedding-cream/40 relative overflow-hidden" style={{ minHeight: '320px', maxHeight: '380px' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 left-4 text-wedding-gold/20">
          <Heart size={24} className="animate-pulse" />
        </div>
        <div className="absolute top-8 right-8 text-wedding-blush/30">
          <Sparkles size={20} className="animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-6 left-8 text-wedding-gold/20">
          <Users size={18} className="animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-playfair text-wedding-maroon">
                  Wedding Wishes
                </h2>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-wedding-gold via-wedding-blush to-transparent"></div>
              </div>
              <div className="text-wedding-gold/50">
                <Heart size={20} className="animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-wedding-gold/70 mt-1 font-poppins">Share your love and best wishes</p>
          </div>
          
          {wishes.length > 8 && (
            <button
              onClick={onViewAll}
              className="flex items-center space-x-2 text-sm text-wedding-maroon hover:text-wedding-gold transition-all duration-300 underline underline-offset-2 font-poppins hover:scale-105"
            >
              <span>View all {wishes.length} wishes</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Enhanced Inline Post Wish Section */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-wedding-gold/20 via-wedding-blush/20 to-wedding-gold/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300 opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-4 border border-wedding-gold/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <Edit3 size={16} className="text-wedding-gold" />
                <span className="text-sm font-medium text-wedding-maroon">Share Your Wishes</span>
              </div>
              
              <Textarea
                placeholder="Write your heartfelt wishes for the happy couple..."
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                maxLength={280}
                className={`resize-none border-wedding-gold/30 focus:border-wedding-gold bg-white/80 transition-all duration-300 ${
                  isExpanded ? 'min-h-[80px]' : 'min-h-[44px]'
                }`}
                rows={isExpanded ? 3 : 1}
              />
              
              {isExpanded && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-wedding-gold/20 animate-fade-in">
                  <div className="flex items-center space-x-4">
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <span>{wishText.length}/280</span>
                      <span className="text-wedding-gold">•</span>
                      <span className="text-wedding-gold/70">characters</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false);
                        setWishText('');
                      }}
                      className="text-gray-600 h-8 px-3 text-xs hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmitWish}
                      disabled={!wishText.trim() || isSubmitting || wishText.length > 280}
                      className="bg-gradient-to-r from-wedding-gold to-wedding-deep-gold hover:from-wedding-deep-gold hover:to-wedding-gold text-white h-8 px-4 text-xs shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Posting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send size={12} />
                          <span>Post Wish</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Wishes Carousel */}
        {isLoading ? (
          <div className="text-center py-8" style={{ height: '160px' }}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative">
                <div className="w-8 h-8 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 border-2 border-wedding-gold/20 rounded-full animate-pulse"></div>
              </div>
              <p className="mt-3 text-gray-600 text-sm font-poppins">Loading beautiful wishes...</p>
            </div>
          </div>
        ) : displayWishes.length > 0 ? (
          <div className="relative" style={{ height: '160px' }}>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {displayWishes.map((wish, index) => (
                  <CarouselItem 
                    key={wish.id} 
                    className={`pl-2 md:pl-4 ${isMobile ? 'basis-full' : 'basis-1/2 lg:basis-1/3'}`}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="animate-fade-in">
                      <WishCard 
                        wish={wish} 
                        onLike={handleLike}
                        compact={true}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {!isMobile && displayWishes.length > 2 && (
                <>
                  <CarouselPrevious className="bg-white/90 border-wedding-gold/40 hover:bg-wedding-cream text-wedding-maroon shadow-lg hover:shadow-xl transition-all duration-300 -left-10" />
                  <CarouselNext className="bg-white/90 border-wedding-gold/40 hover:bg-wedding-cream text-wedding-maroon shadow-lg hover:shadow-xl transition-all duration-300 -right-10" />
                </>
              )}
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-8 relative" style={{ height: '160px' }}>
            <div className="glass-card border border-wedding-gold/30 rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-wedding-cream/30 via-white/50 to-wedding-blush/30"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <Heart size={40} className="text-wedding-gold/60 animate-pulse" />
                </div>
                <h3 className="text-lg font-playfair text-wedding-maroon mb-2">
                  Be the First to Share
                </h3>
                <p className="text-gray-600 font-poppins text-sm max-w-xs">
                  Start the celebration by sharing your heartfelt wishes for the happy couple!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishesCarousel;
