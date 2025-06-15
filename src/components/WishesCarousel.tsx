
import React, { useState } from 'react';
import { Send, Heart, Sparkles, Users, Edit3, Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useWishes } from '@/hooks/useWishes';
import { useGuest } from '@/context/GuestContext';
import WishCard from './WishCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface WishesCarouselProps {
  onViewAll?: () => void;
}

const WishesCarousel: React.FC<WishesCarouselProps> = ({ onViewAll }) => {
  const [wishText, setWishText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { wishes, isLoading, isSubmitting, submitWish, toggleLike } = useWishes();
  const { guestId, guestName } = useGuest();

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

  const displayWishes = wishes.slice(0, 5); // Show latest 5 wishes in grid

  const WishComposer = () => (
    <Card className={`relative overflow-hidden transition-all duration-500 ease-in-out group ${isExpanded ? 'h-56' : 'h-44'} border-wedding-gold/30 bg-gradient-to-br from-wedding-cream/90 via-white/95 to-wedding-blush/20 shadow-lg`}>
      {!isExpanded ? (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => setIsExpanded(true)}
        >
          <div className="p-3 rounded-full bg-wedding-gold/10 mb-2 border border-wedding-gold/20">
            <Feather className="w-6 h-6 text-wedding-gold" />
          </div>
          <h3 className="font-playfair text-lg text-wedding-maroon">Leave a Wish</h3>
          <p className="text-sm text-wedding-gold/80 mt-1 font-poppins">Share your blessings</p>
        </div>
      ) : (
        <div className="p-4 flex flex-col h-full animate-fade-in">
          <Textarea
            placeholder="Let your words of love and joy blossom here..."
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            maxLength={280}
            className="flex-grow resize-none border-wedding-gold/30 focus:border-wedding-gold bg-white/80 text-sm"
            rows={4}
            autoFocus
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-wedding-gold/20">
            <div className="text-xs text-gray-500">
              {wishText.length}/280
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-gray-600 h-8 px-3 text-xs hover:bg-gray-100"
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
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} className="mr-2" />
                    <span>Post Wish</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="py-12 md:py-16 w-full bg-wedding-cream/30 relative overflow-hidden bg-floral-pattern">
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
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-playfair text-wedding-maroon">
                  Wedding Wishes
                </h2>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-wedding-gold via-wedding-blush to-transparent"></div>
              </div>
              <div className="text-wedding-gold/50">
                <Heart size={24} className="animate-pulse" />
              </div>
            </div>
            <p className="text-base text-wedding-gold/70 mt-2 font-poppins">Share your love and best wishes for the couple</p>
          </div>
          
          {wishes.length > 5 && (
            <button
              onClick={onViewAll}
              className="flex items-center space-x-2 text-sm font-medium text-wedding-maroon hover:text-wedding-gold transition-all duration-300 font-poppins hover:scale-105"
            >
              <span>View all {wishes.length} wishes</span>
              <Heart size={14} />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-44 p-4 bg-white/50">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WishComposer />
            
            {displayWishes.map((wish, index) => (
              <div 
                key={wish.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <WishCard 
                  wish={wish} 
                  onLike={handleLike}
                />
              </div>
            ))}

            {wishes.length === 0 && (
              <div className="md:col-span-2 lg:col-span-2 animate-fade-in">
                 <Card className="h-44 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-wedding-cream/90 via-white/95 to-wedding-blush/20 border-wedding-gold/30 shadow-lg">
                    <div className="p-3 rounded-full bg-wedding-gold/10 mb-3 border border-wedding-gold/20">
                      <Sparkles size={24} className="text-wedding-gold" />
                    </div>
                    <h3 className="text-lg font-playfair text-wedding-maroon">
                      Be the First to Congratulate
                    </h3>
                    <p className="text-gray-600 font-poppins text-sm max-w-xs mt-1">
                      Your beautiful words will start the celebration of love!
                    </p>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishesCarousel;
