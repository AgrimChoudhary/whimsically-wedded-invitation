
import React, { useState } from 'react';
import { Send, Heart, Sparkles, Users, Edit3, Feather, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useWishes } from '@/hooks/useWishes';
import { useGuest } from '@/context/GuestContext';
import WishCard from './WishCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  return (
    <div className="py-16 md:py-20 w-full bg-gradient-to-br from-wedding-cream/40 via-white/60 to-wedding-blush/30 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-8 left-8 text-wedding-gold/30">
          <Heart size={32} className="animate-pulse" />
        </div>
        <div className="absolute top-12 right-12 text-wedding-blush/40">
          <Sparkles size={28} className="animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-12 left-12 text-wedding-gold/30">
          <Users size={24} className="animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-8 right-8 text-wedding-maroon/20">
          <Feather size={26} className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-playfair text-wedding-maroon mb-4 relative">
              Wedding Wishes
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-wedding-gold via-wedding-deep-gold to-wedding-gold rounded-full"></div>
            </h2>
          </div>
          <p className="text-lg text-wedding-gold/80 mt-6 font-poppins max-w-2xl mx-auto leading-relaxed">
            Share your heartfelt blessings and beautiful wishes for our special day
          </p>
          
          {wishes.length > 0 && (
            <div className="flex items-center justify-center mt-4 space-x-2">
              <Heart size={16} className="text-wedding-blush fill-wedding-blush animate-pulse" />
              <span className="text-sm text-wedding-maroon font-medium">
                {wishes.length} beautiful {wishes.length === 1 ? 'wish' : 'wishes'} shared
              </span>
              <Heart size={16} className="text-wedding-blush fill-wedding-blush animate-pulse" />
            </div>
          )}
        </div>

        {/* Wishes Carousel with Enhanced Luxury Cards */}
        {isLoading ? (
          <div className="mb-16">
            <div className="flex space-x-6 overflow-hidden justify-center">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="min-w-[350px] h-64 p-6 bg-white/60 border-2 border-wedding-gold/20 shadow-xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : wishes.length > 0 ? (
          <div className="mb-16 relative">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent className="-ml-6">
                {wishes.map((wish, index) => (
                  <CarouselItem key={wish.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                    <div 
                      className="animate-fade-in h-full"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <Card className="group relative overflow-hidden bg-gradient-to-br from-white/95 via-wedding-cream/90 to-wedding-blush/20 border-2 border-wedding-gold/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] h-64 backdrop-blur-sm">
                        {/* Luxury border effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-wedding-gold/20 via-transparent to-wedding-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Corner decorations */}
                        <div className="absolute top-3 right-3 text-wedding-gold/30 group-hover:text-wedding-gold/60 transition-colors duration-300">
                          <Sparkles size={18} className="animate-pulse" />
                        </div>
                        
                        <div className="p-6 h-full flex flex-col justify-between relative z-10">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wedding-gold/40 to-wedding-deep-gold/30 flex items-center justify-center shadow-lg border-2 border-wedding-gold/30">
                                <span className="font-bold text-wedding-maroon text-lg">
                                  {wish.guest_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-wedding-maroon text-lg">
                                  {wish.guest_name}
                                </p>
                                <p className="text-wedding-gold/70 text-sm font-poppins">
                                  {new Date(wish.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed font-poppins italic text-sm line-clamp-4">
                              "{wish.content}"
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-wedding-gold/20">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(wish.id)}
                              className="px-3 text-gray-600 hover:text-red-500 hover:bg-red-50/80 transition-all duration-300 h-8 rounded-full group/like"
                            >
                              <Heart 
                                size={16} 
                                className={`mr-2 transition-all duration-300 ${
                                  wish.likes_count > 0 
                                    ? 'fill-red-500 text-red-500 animate-pulse' 
                                    : 'group-hover/like:scale-110'
                                }`}
                              />
                              <span className="text-sm font-medium">
                                {wish.likes_count}
                              </span>
                            </Button>
                          </div>
                        </div>

                        {/* Subtle luxury gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-wedding-gold/5 via-transparent to-transparent pointer-events-none"></div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Enhanced Navigation Buttons */}
              <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-wedding-gold/90 to-wedding-deep-gold/90 border-2 border-wedding-gold/50 hover:from-wedding-deep-gold hover:to-wedding-gold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110">
                <ChevronLeft size={20} />
              </CarouselPrevious>
              <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-wedding-gold/90 to-wedding-deep-gold/90 border-2 border-wedding-gold/50 hover:from-wedding-deep-gold hover:to-wedding-gold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110">
                <ChevronRight size={20} />
              </CarouselNext>
            </Carousel>

            {wishes.length > 5 && onViewAll && (
              <div className="text-center mt-8">
                <button
                  onClick={onViewAll}
                  className="inline-flex items-center space-x-2 text-wedding-maroon hover:text-wedding-gold transition-all duration-300 font-medium font-poppins hover:scale-105 bg-white/60 px-4 py-2 rounded-full shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  <span>View all {wishes.length} wishes</span>
                  <Heart size={16} className="animate-pulse" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-16 flex justify-center">
            <Card className="max-w-lg h-64 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-wedding-cream/90 via-white/95 to-wedding-blush/20 border-2 border-wedding-gold/30 shadow-2xl">
              <div className="p-4 rounded-full bg-wedding-gold/20 mb-6 border-2 border-wedding-gold/30 shadow-lg">
                <Sparkles size={32} className="text-wedding-gold animate-pulse" />
              </div>
              <h3 className="text-xl font-playfair text-wedding-maroon mb-3">
                Be the First to Share Your Blessing
              </h3>
              <p className="text-gray-600 font-poppins text-sm max-w-xs leading-relaxed">
                Your beautiful words will start this wonderful celebration of love and joy!
              </p>
            </Card>
          </div>
        )}

        {/* Enhanced Wish Composer Section */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-playfair text-wedding-maroon mb-2">Share Your Blessing</h3>
              <p className="text-wedding-gold/70 font-poppins">Leave a heartfelt wish for the happy couple</p>
            </div>
            
            <Card className={`relative overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'h-72' : 'h-32'} border-2 border-wedding-gold/40 bg-gradient-to-br from-white/95 via-wedding-cream/90 to-wedding-blush/20 shadow-2xl hover:shadow-3xl backdrop-blur-sm`}>
              {/* Luxury border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-wedding-gold/10 via-transparent to-wedding-gold/10"></div>
              
              {!isExpanded ? (
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 cursor-pointer group hover:scale-105 transition-transform duration-300"
                  onClick={() => setIsExpanded(true)}
                >
                  <div className="p-5 rounded-full bg-gradient-to-br from-wedding-gold/20 to-wedding-deep-gold/10 mb-4 border-2 border-wedding-gold/30 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Feather className="w-8 h-8 text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="text-wedding-maroon font-poppins font-medium group-hover:text-wedding-gold transition-colors duration-300">
                    Click here to write your wish...
                  </p>
                </div>
              ) : (
                <div className="p-6 flex flex-col h-full animate-fade-in relative z-10">
                  <Textarea
                    placeholder="Share your heartfelt wishes, blessings, and beautiful thoughts for the couple's journey together..."
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    maxLength={280}
                    className="flex-grow resize-none border-2 border-wedding-gold/30 focus:border-wedding-gold bg-white/90 text-sm font-poppins leading-relaxed p-4 rounded-lg shadow-inner"
                    rows={6}
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-wedding-gold/20">
                    <div className="text-sm text-gray-500 font-poppins">
                      {wishText.length}/280 characters
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsExpanded(false);
                          setWishText('');
                        }}
                        className="text-gray-600 hover:text-gray-800 h-10 px-4 text-sm hover:bg-gray-100/80 font-poppins transition-all duration-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmitWish}
                        disabled={!wishText.trim() || isSubmitting || wishText.length > 280}
                        className="bg-gradient-to-r from-wedding-gold to-wedding-deep-gold hover:from-wedding-deep-gold hover:to-wedding-gold text-white h-10 px-6 text-sm shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 font-poppins font-medium"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span>Sharing...</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} className="mr-2" />
                            <span>Share Wish</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Corner decorations */}
              <div className="absolute top-3 right-3 text-wedding-gold/30">
                <Heart size={16} className="animate-pulse" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishesCarousel;
