
import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGuest } from '@/context/GuestContext';

interface RSVPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RSVPModal: React.FC<RSVPModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const { guestName, updateGuestStatus, guestStatus } = useGuest();

  useEffect(() => {
    if (guestStatus === 'accepted') {
      setIsAccepted(true);
    } else {
      setIsAccepted(false);
    }
  }, [guestStatus]);

  const handleAccept = async () => {
    setIsAccepting(true);
    await updateGuestStatus('accepted');
    setIsAccepted(true);
    setIsAccepting(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-wedding-gold/30 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-great-vibes text-wedding-maroon text-center">
            RSVP
          </DialogTitle>
          <DialogDescription className="text-center">
            We look forward to celebrating our special day with you.
          </DialogDescription>
        </DialogHeader>
        
        {isAccepted ? (
          <div className="py-6 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-playfair text-wedding-maroon mb-2">Thank You!</h3>
            <p className="text-gray-700">
              Dear {guestName}, your response has been recorded.
            </p>
            <p className="mt-2 text-gray-600">
              We're thrilled you will be joining us on our special day.
            </p>
          </div>
        ) : (
          <div className="py-6 text-center">
            <h3 className="text-xl font-playfair text-wedding-maroon mb-2">
              Dear {guestName}
            </h3>
            <p className="text-gray-700">
              Will you be joining us on our wedding celebration?
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleAccept}
                disabled={isAccepting}
                className="bg-wedding-gold hover:bg-wedding-deep-gold text-white transition-colors"
              >
                {isAccepting ? 'Processing...' : 'Accept Invitation'}
              </Button>
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-center">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-wedding-gold/30 text-wedding-maroon"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RSVPModal;
