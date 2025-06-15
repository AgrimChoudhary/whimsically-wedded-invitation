
import React from 'react';
import { Heart, MessageCircle, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wish } from '@/hooks/useWishes';
import { useGuest } from '@/context/GuestContext';
import { formatDistanceToNow } from 'date-fns';

interface WishCardProps {
  wish: Wish;
  onLike?: (wishId: string) => void;
  onReply?: (wishId: string) => void;
  compact?: boolean;
}

const WishCard: React.FC<WishCardProps> = ({ 
  wish, 
  onLike, 
  onReply, 
  compact = false 
}) => {
  const { guestId, guestName } = useGuest();

  const handleLike = () => {
    if (guestId && guestName && onLike) {
      onLike(wish.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(wish.id);
    }
  };

  return (
    <Card className={`group relative overflow-hidden bg-gradient-to-br from-wedding-cream/90 via-white/95 to-wedding-blush/20 border-wedding-gold/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] ${compact ? 'h-36' : 'h-44'}`}>
      {/* Decorative corner elements */}
      <div className="absolute top-2 right-2 text-wedding-gold/20 group-hover:text-wedding-gold/40 transition-colors duration-300">
        <Sparkles size={compact ? 12 : 16} />
      </div>
      
      <CardContent className={`h-full flex flex-col justify-between relative z-10 ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`rounded-full bg-gradient-to-br from-wedding-gold/30 to-wedding-gold/20 flex items-center justify-center shadow-sm ${compact ? 'w-7 h-7' : 'w-9 h-9'}`}>
                <span className={`font-semibold text-wedding-maroon ${compact ? 'text-xs' : 'text-sm'}`}>
                  {wish.guest_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className={`font-medium text-wedding-maroon ${compact ? 'text-sm' : 'text-base'}`}>
                  {wish.guest_name}
                </p>
                <div className={`flex items-center text-wedding-gold/70 ${compact ? 'text-xs' : 'text-xs'}`}>
                  <Clock size={compact ? 10 : 12} className="mr-1" />
                  {formatDistanceToNow(new Date(wish.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>

          <p className={`text-gray-700 leading-relaxed font-poppins italic ${compact ? 'text-sm line-clamp-2' : 'text-sm line-clamp-3'}`}>
            "{wish.content}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-wedding-gold/20">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`px-2 text-gray-600 hover:text-red-500 hover:bg-red-50/80 transition-all duration-300 ${compact ? 'h-7' : 'h-8'} rounded-full group/like`}
            >
              <Heart 
                size={compact ? 14 : 16} 
                className={`mr-1 transition-all duration-300 ${
                  wish.likes_count > 0 
                    ? 'fill-red-500 text-red-500 animate-pulse' 
                    : 'group-hover/like:scale-110'
                }`}
              />
              <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium`}>
                {wish.likes_count}
              </span>
            </Button>

            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReply}
                className={`px-2 text-gray-600 hover:text-wedding-maroon hover:bg-wedding-cream/80 transition-all duration-300 ${compact ? 'h-7' : 'h-8'} rounded-full group/reply`}
              >
                <MessageCircle 
                  size={compact ? 14 : 16} 
                  className="mr-1 group-hover/reply:scale-110 transition-transform duration-300" 
                />
                <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium`}>
                  {wish.replies_count}
                </span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-wedding-gold/10 via-transparent to-wedding-blush/10"></div>
      </div>
    </Card>
  );
};

export default WishCard;
