
import React, { useState, useRef } from 'react';
import { Send, Upload, X, Heart, Feather, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useGuest } from '@/context/GuestContext';

interface WishComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, imageFile?: File) => Promise<boolean>;
  isSubmitting?: boolean;
}

const WishComposerModal: React.FC<WishComposerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [wishText, setWishText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { guestName } = useGuest();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!wishText.trim()) return;

    const success = await onSubmit(wishText, selectedImage || undefined);
    if (success) {
      setWishText('');
      setSelectedImage(null);
      setImagePreview(null);
      onClose();
    }
  };

  const handleClose = () => {
    setWishText('');
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-white/95 via-wedding-cream/90 to-wedding-blush/20 border-2 border-wedding-gold/40 shadow-2xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-wedding-maroon text-center mb-2">
            Share Your Blessing
          </DialogTitle>
          <p className="text-wedding-gold/70 font-poppins text-center text-sm">
            Leave a heartfelt wish for the happy couple
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Guest Avatar Section */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-12 h-12 border-2 border-wedding-gold/30">
              {imagePreview ? (
                <AvatarImage src={imagePreview} alt="Your photo" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-wedding-gold/40 to-wedding-deep-gold/30 text-wedding-maroon font-bold">
                  {guestName?.charAt(0).toUpperCase() || 'G'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-wedding-maroon">{guestName || 'Guest'}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-wedding-gold hover:text-wedding-maroon transition-colors p-0 h-auto font-normal"
              >
                <Image size={12} className="mr-1" />
                {selectedImage ? 'Change photo' : 'Add your photo (optional)'}
              </Button>
            </div>
            {selectedImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={removeImage}
                className="p-1 h-auto text-gray-500 hover:text-red-500"
              >
                <X size={16} />
              </Button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Wish Text Area */}
          <div className="relative">
            <Textarea
              placeholder="Share your heartfelt wishes, blessings, and beautiful thoughts for the couple's journey together..."
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              maxLength={280}
              className="resize-none border-2 border-wedding-gold/30 focus:border-wedding-gold bg-white/90 text-sm font-poppins leading-relaxed p-4 rounded-lg shadow-inner min-h-[120px]"
              rows={5}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {wishText.length}/280
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-wedding-gold/20">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 font-poppins"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!wishText.trim() || isSubmitting || wishText.length > 280}
              className="bg-gradient-to-r from-wedding-gold to-wedding-deep-gold hover:from-wedding-deep-gold hover:to-wedding-gold text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 font-poppins font-medium"
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

        {/* Decorative elements */}
        <div className="absolute top-3 right-3 text-wedding-gold/30">
          <Heart size={16} className="animate-pulse" />
        </div>
        <div className="absolute bottom-3 left-3 text-wedding-blush/40">
          <Feather size={14} className="animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WishComposerModal;
