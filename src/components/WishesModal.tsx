
import React, { useState } from 'react';
import { X, Heart, MessageCircle, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWishes } from '@/hooks/useWishes';
import { useGuest } from '@/context/GuestContext';
import WishCard from './WishCard';

interface WishesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WishesModal: React.FC<WishesModalProps> = ({ open, onOpenChange }) => {
  const [replyText, setReplyText] = useState('');
  const [replyingToWishId, setReplyingToWishId] = useState<string | null>(null);
  const { wishes, isLoading, toggleLike } = useWishes();
  const { guestId, guestName } = useGuest();

  const handleLike = (wishId: string) => {
    if (guestId && guestName) {
      toggleLike(wishId, guestId, guestName);
    }
  };

  const handleReply = (wishId: string) => {
    setReplyingToWishId(wishId);
  };

  const handleSubmitReply = () => {
    // TODO: Implement reply submission
    console.log('Reply to wish:', replyingToWishId, replyText);
    setReplyText('');
    setReplyingToWishId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] bg-gradient-to-br from-wedding-cream/95 via-white/98 to-wedding-blush/30 border-wedding-gold/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-playfair text-wedding-maroon text-center">
            All Wedding Wishes
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading wishes...</p>
            </div>
          ) : wishes.length > 0 ? (
            <div className="space-y-4">
              {wishes.map((wish) => (
                <div key={wish.id}>
                  <WishCard 
                    wish={wish} 
                    onLike={handleLike}
                    onReply={handleReply}
                    compact={false}
                  />
                  
                  {/* Reply Section */}
                  {replyingToWishId === wish.id && (
                    <div className="mt-3 ml-4 p-3 bg-white/50 rounded-lg border border-wedding-gold/20">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        maxLength={280}
                        className="min-h-[60px] border-wedding-gold/30 focus:border-wedding-gold"
                        rows={2}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500">
                          {replyText.length}/280 characters
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyingToWishId(null);
                              setReplyText('');
                            }}
                            className="text-gray-600"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSubmitReply}
                            disabled={!replyText.trim() || replyText.length > 280}
                            className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                          >
                            <Send size={14} className="mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart size={48} className="mx-auto text-wedding-gold/50 mb-4" />
              <p className="text-gray-600 font-poppins">
                No wishes yet. Be the first to share your wishes!
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default WishesModal;
