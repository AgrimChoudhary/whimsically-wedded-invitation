
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGuest } from '../context/GuestContext';
import { Input } from '@/components/ui/input';
import HandwritingAnimation from './HandwritingAnimation';
import TypingAnimation from './TypingAnimation';
import { ArrowRight, Heart, PenLine } from 'lucide-react';

const WelcomeForm = () => {
  const [guestCode, setGuestCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entryMessage, setEntryMessage] = useState('');
  const [showTypingComplete, setShowTypingComplete] = useState(false);
  const { guestId } = useGuest();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if there's a success parameter in the URL
  useEffect(() => {
    const status = searchParams.get('status');
    
    if (status === 'success') {
      setEntryMessage('Your invitation has been created! You can now manage your guests.');
    }
  }, [searchParams]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestCode.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Navigate to the invitation page using the guest code directly
    navigate(`/invitation/${guestCode}`);
  };
  
  const handleTypingComplete = () => {
    setShowTypingComplete(true);
  };
  
  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-lg border border-wedding-gold/20 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <div className="mb-4 text-center">
        <h3 className="font-dancing-script text-2xl text-wedding-gold mb-4">
          <HandwritingAnimation text="Welcome to our celebration" delay={800} />
        </h3>
        
        <p className="text-gray-700 text-sm mb-2">
          <TypingAnimation 
            text={entryMessage || "Please enter your invitation code to continue"}
            delay={1500}
            speed={40}
            cursor={false}
            onComplete={handleTypingComplete}
          />
        </p>
        
        {showTypingComplete && entryMessage && (
          <div className="text-center mt-2">
            <Button
              onClick={() => navigate('/guest-management')}
              className="bg-wedding-gold text-white hover:bg-wedding-deep-gold mt-2"
            >
              Go to Guest Management
            </Button>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={guestCode}
            onChange={(e) => setGuestCode(e.target.value)}
            placeholder="Enter your invitation code"
            className="pr-10 focus:ring-wedding-gold focus:border-wedding-gold"
            autoComplete="off"
            disabled={isSubmitting}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Heart size={16} className="text-wedding-gold opacity-70" />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white"
          disabled={!guestCode.trim() || isSubmitting}
        >
          {isSubmitting ? "Opening..." : "Open Invitation"}
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </form>
      
      <div className="mt-6 pt-4 border-t border-dashed border-wedding-gold/30 text-center">
        <p className="text-gray-600 text-sm mb-3">
          Want to create your own wedding invitation?
        </p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/create-invitation')}
          className="w-full border-wedding-gold/50 text-wedding-maroon hover:bg-wedding-cream hover:text-wedding-maroon"
        >
          <PenLine size={16} className="mr-2" />
          Create Your Invitation
        </Button>
      </div>
    </div>
  );
};

export default WelcomeForm;
