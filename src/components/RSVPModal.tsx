import React, { useState } from 'react';
import { Calendar, User, Heart, X, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/AudioContext';
import { Confetti } from './AnimatedElements';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose }) => {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { isPlaying, toggleMusic } = useAudio();

  const handleAccept = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setHasAccepted(true);
      setShowConfetti(false);
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-wedding-cream border-wedding-gold/30 max-w-md mx-auto relative overflow-hidden">
        <Confetti isActive={showConfetti} />
        <DialogHeader>
          <DialogTitle className="text-center font-playfair text-wedding-maroon text-xl flex items-center justify-center gap-2">
            <Heart size={16} className="text-wedding-gold" /> RSVP <Heart size={16} className="text-wedding-gold" />
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Will you be joining us to celebrate?
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4">
          {hasAccepted ? (
            <div className="text-center py-4 animate-fade-in-up">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-kruti text-wedding-maroon mb-2">निमंत्रण स्वीकार करने के लिए धन्यवाद!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Thank you for accepting our invitation. We look forward to celebrating our special day with you!
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Button 
                  onClick={onClose}
                  variant="outline" 
                  className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-gold/10"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (!isPlaying) toggleMusic();
                    onClose();
                  }}
                  className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                >
                  Continue <span className="ml-1">→</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Please contact us to confirm your attendance</p>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <User size={16} className="text-wedding-gold" />
                    <span className="text-gray-700">भवेश कौशिक (वर के भाई)</span>
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
              
              <div className="flex justify-center gap-3 mt-6">
                <Button 
                  onClick={onClose}
                  variant="outline" 
                  className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-gold/10"
                >
                  <X size={16} className="mr-1" />
                  Close
                </Button>
                <Button 
                  onClick={handleAccept}
                  className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                >
                  <Heart size={16} className="mr-1" />
                  Accept Invitation
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RSVPModal;
