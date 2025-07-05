
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User, Calendar, MapPin, Sparkles } from 'lucide-react';
import { useGuest } from '@/context/GuestContext';
import { useWedding } from '@/context/WeddingContext';
import { formatWeddingDate } from '@/placeholders';

const WelcomeForm = () => {
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setGuestName: setContextGuestName } = useGuest();
  const { weddingData } = useWedding();

  // Determine which name to show first based on groomFirst flag
  const firstPersonName = weddingData.groomFirst ? weddingData.couple.groomFirstName : weddingData.couple.brideFirstName;
  const secondPersonName = weddingData.groomFirst ? weddingData.couple.brideFirstName : weddingData.couple.groomFirstName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);
    
    try {
      setContextGuestName(guestName.trim());
      // Pass along any existing URL parameters
      navigate(`/invitation${location.search}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <Card className="bg-white/80 backdrop-blur-lg border-2 border-wedding-gold/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-wedding-cream/20 via-white/40 to-wedding-blush/20"></div>
        
        <CardHeader className="relative text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart size={20} className="text-wedding-blush animate-pulse" fill="#F8BBD9" />
            <CardTitle className="text-xl font-dancing-script text-wedding-maroon">
              You're Invited!
            </CardTitle>
            <Heart size={20} className="text-wedding-blush animate-pulse" fill="#F8BBD9" />
          </div>
          
          <CardDescription className="text-sm text-gray-600 leading-relaxed">
            <p className="mb-2">
              Join <span className="font-medium text-wedding-maroon">{firstPersonName}</span> and{' '}
              <span className="font-medium text-wedding-maroon">{secondPersonName}</span> as they celebrate their special day
            </p>
            
            {/* Wedding details preview */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-wedding-gold">
                <Calendar size={14} />
                <span>{formatWeddingDate(weddingData.mainWedding.date)} at {weddingData.mainWedding.time}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-wedding-gold">
                <MapPin size={14} />
                <span>{weddingData.mainWedding.venue.name}</span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative pt-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wedding-maroon/60" size={18} />
              <Input
                type="text"
                placeholder="Enter your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="pl-11 h-12 border-2 border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 bg-white/90 text-wedding-maroon placeholder:text-wedding-maroon/50"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={!guestName.trim() || isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-wedding-gold to-wedding-deep-gold hover:from-wedding-deep-gold hover:to-wedding-gold text-white font-medium rounded-lg transition-all duration-300 shadow-gold-soft hover:shadow-gold-glow transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Opening Invitation...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  View Invitation
                  <Sparkles size={16} />
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Enter your name to view the complete wedding invitation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeForm;
