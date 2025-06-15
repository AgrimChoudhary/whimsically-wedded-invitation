
import React from 'react';
import { Heart, MessageCircle, Clock } from 'lucide-react';
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
    <Card className={`group bg-gradient-to-br from-wedding-cream/90 via-white/95 to-wedding-blush/20 border-wedding-gold/20 shadow-gold-soft hover:shadow-gold-glow transition-all duration-300 ${compact ? 'h-32' : 'h-40'}`}>
      <CardContent className={`h-full flex flex-col justify-between ${compact ? 'p-2' : 'p-4'}`}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`rounded-full bg-wedding-gold/20 flex items-center justify-center ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}>
                <span className={`font-medium text-wedding-maroon ${compact ? 'text-xs' : 'text-sm'}`}>
                  {wish.guest_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className={`font-medium text-wedding-maroon ${compact ? 'text-xs' : 'text-sm'}`}>
                  {wish.guest_name}
                </p>
                <div className={`flex items-center text-gray-500 ${compact ? 'text-xs' : 'text-xs'}`}>
                  <Clock size={10} className="mr-1" />
                  {formatDistanceToNow(new Date(wish.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>

          <p className={`text-gray-700 leading-relaxed ${compact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'}`}>
            {wish.content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-wedding-gold/10">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`px-1 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors ${compact ? 'h-6' : 'h-8'}`}
            >
              <Heart 
                size={compact ? 12 : 14} 
                className={`mr-1 ${wish.likes_count > 0 ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="text-xs">{wish.likes_count}</span>
            </Button>

            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReply}
                className={`px-1 text-gray-600 hover:text-wedding-maroon hover:bg-wedding-cream transition-colors ${compact ? 'h-6' : 'h-8'}`}
              >
                <MessageCircle size={compact ? 12 : 14} className="mr-1" />
                <span className="text-xs">{wish.replies_count}</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WishCard;
