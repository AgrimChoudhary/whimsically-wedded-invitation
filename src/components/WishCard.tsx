
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
      <CardContent className={`p-4 h-full flex flex-col justify-between ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-wedding-gold/20 flex items-center justify-center">
                <span className="text-sm font-medium text-wedding-maroon">
                  {wish.guest_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-wedding-maroon">
                  {wish.guest_name}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {formatDistanceToNow(new Date(wish.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>

          <p className={`text-gray-700 leading-relaxed ${compact ? 'text-sm line-clamp-2' : 'text-sm line-clamp-3'}`}>
            {wish.content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-wedding-gold/10">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="h-8 px-2 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Heart 
                size={14} 
                className={`mr-1 ${wish.likes_count > 0 ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="text-xs">{wish.likes_count}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReply}
              className="h-8 px-2 text-gray-600 hover:text-wedding-maroon hover:bg-wedding-cream transition-colors"
            >
              <MessageCircle size={14} className="mr-1" />
              <span className="text-xs">{wish.replies_count}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WishCard;
