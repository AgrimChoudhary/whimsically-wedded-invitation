
import React from 'react';
import { Calendar, User, Heart, X, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-wedding-cream border-wedding-gold/30 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-playfair text-wedding-maroon text-xl flex items-center justify-center gap-2">
            <Heart size={16} className="text-wedding-gold" /> RSVP <Heart size={16} className="text-wedding-gold" />
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Will you be joining us to celebrate?
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">Please contact us to confirm your attendance</p>
            
            <div className="mt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <User size={16} className="text-wedding-gold" />
                <span className="text-gray-700">भावेश (वर के भाई)</span>
              </div>
              <a 
                href="tel:+918302710005" 
                className="flex items-center justify-center gap-2 text-wedding-maroon hover:text-wedding-gold transition-colors"
              >
                <Phone size={16} />
                <span>+91 8302 710 005</span>
              </a>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-wedding-gold/80 text-white rounded-full hover:bg-wedding-gold transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RSVPModal;
