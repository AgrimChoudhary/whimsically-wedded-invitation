
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Confetti } from './AnimatedElements';
import { Heart } from 'lucide-react';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState('');
  const [guests, setGuests] = useState('1');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };
  
  const handleClose = () => {
    onClose();
    // Reset form after animation completes
    setTimeout(() => {
      if (isSubmitted) {
        setName('');
        setEmail('');
        setAttendance('');
        setGuests('1');
        setMessage('');
        setIsSubmitted(false);
      }
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md glass-card border-wedding-gold/30 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-playfair text-2xl text-wedding-maroon">
            <span className="flex items-center justify-center">
              RSVP
              <Heart size={16} className="ml-2 text-wedding-blush" />
            </span>
          </DialogTitle>
        </DialogHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 my-2">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
                className="bg-white/70 border-wedding-blush focus:border-wedding-gold"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="bg-white/70 border-wedding-blush focus:border-wedding-gold"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Will you attend?</Label>
              <RadioGroup 
                value={attendance} 
                onValueChange={setAttendance}
                className="flex space-x-4"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" className="text-wedding-gold" />
                  <Label htmlFor="yes">Yes, I'll be there</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" className="text-wedding-gold" />
                  <Label htmlFor="no">Sorry, can't make it</Label>
                </div>
              </RadioGroup>
            </div>
            
            {attendance === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input 
                  id="guests" 
                  type="number" 
                  min="1" 
                  max="5" 
                  value={guests} 
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-white/70 border-wedding-blush focus:border-wedding-gold w-24"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="message">Message for the Couple (Optional)</Label>
              <Textarea 
                id="message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white/70 border-wedding-blush focus:border-wedding-gold resize-none"
                rows={3}
              />
            </div>
            
            <DialogFooter className="pt-2">
              <Button 
                type="submit"
                disabled={isSubmitting || !name || !email || !attendance}
                className="w-full bg-wedding-gold hover:bg-wedding-gold/90 text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send RSVP'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-playfair text-wedding-maroon mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-4">Your RSVP has been submitted successfully. We look forward to celebrating with you!</p>
            <Button 
              onClick={handleClose}
              className="bg-wedding-gold hover:bg-wedding-gold/90 text-white"
            >
              Close
            </Button>
            <Confetti isActive={true} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RSVPModal;
