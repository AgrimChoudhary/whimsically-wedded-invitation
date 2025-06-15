
import React from 'react';
import { Heart, MessageCircle, Clock, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white/95 via-wedding-cream/90 to-wedding-blush/20 border-2 border-wedding-gold/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] h-80 backdrop-blur-sm">
      {/* Luxury border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-wedding-gold/20 via-transparent to-wedding-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Corner decorations */}
      <div className="absolute top-3 right-3 text-wedding-gold/30 group-hover:text-wedding-gold/60 transition-colors duration-300">
        <Sparkles size={18} className="animate-pulse" />
      </div>
      
      <CardContent className="h-full flex flex-col items-center text-center relative z-10 p-6">
        {/* Top Center - Avatar/Logo */}
        <div className="mb-4">
          <Avatar className="w-16 h-16 border-3 border-wedding-gold/40 shadow-lg">
            {wish.image_url ? (
              <AvatarImage src={wish.image_url} alt={wish.guest_name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-wedding-gold/40 to-wedding-deep-gold/30 text-wedding-maroon text-xl font-bold">
                {wish.guest_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Name and Time */}
        <div className="mb-4">
          <h3 className="font-semibold text-wedding-maroon text-lg mb-1">
            {wish.guest_name}
          </h3>
          <div className="flex items-center justify-center text-wedding-gold/70 text-sm">
            <Clock size={12} className="mr-1" />
            {formatDistanceToNow(new Date(wish.created_at), { addSuffix: true })}
          </div>
        </div>

        {/* Wish Content */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <p className="text-gray-700 leading-relaxed font-poppins italic text-sm line-clamp-4 text-center">
            "{wish.content}"
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="w-full flex items-center justify-between pt-3 border-t border-wedding-gold/20">
          {/* Bottom Left - Like Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
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

          {/* Bottom Right - Comment Button */}
          {onReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReply}
              className="px-3 text-gray-600 hover:text-wedding-maroon hover:bg-wedding-cream/80 transition-all duration-300 h-8 rounded-full group/reply"
            >
              <MessageCircle 
                size={16} 
                className="mr-2 group-hover/reply:scale-110 transition-transform duration-300" 
              />
              <span className="text-sm font-medium">
                {wish.replies_count}
              </span>
            </Button>
          )}
        </div>
      </CardContent>

      {/* Subtle luxury gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-wedding-gold/5 via-transparent to-transparent pointer-events-none"></div>
    </Card>
  );
};

export default WishCard;
