
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
    <div className="py-8 w-full bg-gradient-to-b from-white/50 to-wedding-cream/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <h2 className="text-2xl md:text-3xl font-playfair text-wedding-maroon mb-2">
              Wedding Wishes
            </h2>
            <div className="absolute -left-4 -top-2 text-wedding-gold/30">
              <Heart size={20} />
            </div>
            <div className="absolute -right-4 -bottom-2 text-wedding-gold/30">
              <Heart size={20} />
            </div>
          </div>
          <p className="text-gray-600 font-poppins text-sm">
            Share your heartfelt wishes for the happy couple
          </p>
        </div>

        {/* Inline Post Wish Section */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="glass-card p-4 border border-wedding-gold/20 rounded-lg">
            <Textarea
              placeholder="Share your wishes for the happy couple..."
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              maxLength={280}
              className={`resize-none border-wedding-gold/30 focus:border-wedding-gold transition-all duration-300 ${
                isExpanded ? 'min-h-[80px]' : 'min-h-[40px]'
              }`}
              rows={isExpanded ? 3 : 1}
            />
            
            {isExpanded && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-wedding-gold/20">
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
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitWish}
                    disabled={!wishText.trim() || isSubmitting || wishText.length > 280}
                    className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                  >
                    <Send size={14} className="mr-1" />
                    {isSubmitting ? 'Posting...' : 'Post Wish'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Wishes Carousel */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading wishes...</p>
          </div>
        ) : displayWishes.length > 0 ? (
          <div className="relative">
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
                  <CarouselPrevious className="bg-wedding-cream/80 border-wedding-gold/30 hover:bg-wedding-cream text-wedding-maroon" />
                  <CarouselNext className="bg-wedding-cream/80 border-wedding-gold/30 hover:bg-wedding-cream text-wedding-maroon" />
                </>
              )}
            </Carousel>

            {/* View All Link */}
            {wishes.length > 6 && (
              <div className="text-center mt-4">
                <button
                  onClick={onViewAll}
                  className="text-sm text-wedding-maroon hover:text-wedding-gold transition-colors underline underline-offset-2 font-poppins"
                >
                  View all {wishes.length} wishes
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 glass-card border border-wedding-gold/20 rounded-lg">
            <Heart size={48} className="mx-auto text-wedding-gold/50 mb-4" />
            <p className="text-gray-600 font-poppins">
              Be the first to share your wishes for the happy couple!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishesCarousel;
