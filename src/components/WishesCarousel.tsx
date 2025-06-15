
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react';
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

  const displayWishes = wishes.slice(0, 6); // Show latest 6 wishes in carousel

  return (
    <div className="py-6 w-full bg-gradient-to-b from-white/50 to-wedding-cream/30" style={{ minHeight: '280px', maxHeight: '320px' }}>
      <div className="container mx-auto px-4">
        {/* Compact Header with View All Link */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative inline-block">
            <h2 className="text-xl md:text-2xl font-playfair text-wedding-maroon">
              Wedding Wishes
            </h2>
            <div className="absolute -left-3 -top-1 text-wedding-gold/30">
              <Heart size={16} />
            </div>
            <div className="absolute -right-3 -bottom-1 text-wedding-gold/30">
              <Heart size={16} />
            </div>
          </div>
          {wishes.length > 6 && (
            <button
              onClick={onViewAll}
              className="text-xs text-wedding-maroon hover:text-wedding-gold transition-colors underline underline-offset-2 font-poppins"
            >
              View all {wishes.length} wishes
            </button>
          )}
        </div>

        {/* Compact Inline Post Wish Section */}
        <div className="mb-4 max-w-2xl mx-auto">
          <div className="glass-card p-3 border border-wedding-gold/20 rounded-lg">
            <Textarea
              placeholder="Share your wishes for the happy couple..."
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              maxLength={280}
              className={`resize-none border-wedding-gold/30 focus:border-wedding-gold transition-all duration-300 ${
                isExpanded ? 'min-h-[70px]' : 'min-h-[36px]'
              }`}
              rows={isExpanded ? 3 : 1}
            />
            
            {isExpanded && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-wedding-gold/20">
                <div className="text-xs text-gray-500">
                  {wishText.length}/280 characters
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      setWishText('');
                    }}
                    className="text-gray-600 h-7 px-2 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitWish}
                    disabled={!wishText.trim() || isSubmitting || wishText.length > 280}
                    className="bg-wedding-gold hover:bg-wedding-deep-gold text-white h-7 px-2 text-xs"
                  >
                    <Send size={12} className="mr-1" />
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compact Wishes Carousel */}
        {isLoading ? (
          <div className="text-center py-6">
            <div className="inline-block w-5 h-5 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600 text-sm">Loading wishes...</p>
          </div>
        ) : displayWishes.length > 0 ? (
          <div className="relative" style={{ height: '140px' }}>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {displayWishes.map((wish) => (
                  <CarouselItem 
                    key={wish.id} 
                    className={`pl-2 md:pl-4 ${isMobile ? 'basis-full' : 'basis-1/2 lg:basis-1/3'}`}
                  >
                    <WishCard 
                      wish={wish} 
                      onLike={handleLike}
                      compact={true}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {!isMobile && displayWishes.length > 2 && (
                <>
                  <CarouselPrevious className="bg-wedding-cream/80 border-wedding-gold/30 hover:bg-wedding-cream text-wedding-maroon -left-8" />
                  <CarouselNext className="bg-wedding-cream/80 border-wedding-gold/30 hover:bg-wedding-cream text-wedding-maroon -right-8" />
                </>
              )}
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-6 glass-card border border-wedding-gold/20 rounded-lg" style={{ height: '140px' }}>
            <div className="flex flex-col items-center justify-center h-full">
              <Heart size={32} className="text-wedding-gold/50 mb-2" />
              <p className="text-gray-600 font-poppins text-sm">
                Be the first to share your wishes!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishesCarousel;
