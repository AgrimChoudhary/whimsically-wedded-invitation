
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import { Button } from '@/components/ui/button';
import InvitationHeader from '@/components/InvitationHeader';
import CoupleSection from '@/components/CoupleSection';
import FamilyDetails from '@/components/FamilyDetails';
import EventTimeline from '@/components/EventTimeline';
import PhotoGrid from '@/components/PhotoGrid';
import CountdownTimer from '@/components/CountdownTimer';
import Footer from '@/components/Footer';
import RSVPModal from '@/components/RSVPModal';
import { FloatingPetals, MusicPlayer, Confetti } from '@/components/AnimatedElements';
import { ArrowLeftCircle, Sparkles, Heart, MapPin, Gift } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const { guestName } = useGuest();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Simulating page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleOpenDashboard = () => {
    setConfetti(true);
    setTimeout(() => {
      setShowRSVP(true);
      setConfetti(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full pattern-background">
      {isLoading ? (
        <div className="loading-overlay flex flex-col items-center justify-center min-h-screen">
          <div className="loading-spinner mb-4 w-12 h-12 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-wedding-maroon font-dancing-script text-xl">Preparing your invitation...</p>
        </div>
      ) : (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
          <FloatingPetals />
          <MusicPlayer />
          <Confetti isActive={confetti} />
          
          {/* Quick navigation buttons */}
          <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-3">
            {!isMobile && (
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                size="icon"
                className="rounded-full bg-wedding-cream/80 backdrop-blur-sm border-wedding-gold/30 hover:bg-wedding-cream shadow-gold-soft"
                aria-label="Go back"
              >
                <ArrowLeftCircle size={20} className="text-wedding-maroon" />
              </Button>
            )}
          </div>
          
          {/* Back button for mobile */}
          {isMobile && (
            <button 
              onClick={() => navigate('/')}
              className="fixed top-4 left-4 z-30 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeftCircle size={16} className="mr-1" />
              <span className="text-xs">Back</span>
            </button>
          )}
          
          {/* Content */}
          <InvitationHeader />
          <CoupleSection />
          <FamilyDetails />
          <EventTimeline />
          <PhotoGrid />
          <CountdownTimer />
          
          {/* Dashboard Button */}
          <div className="py-12 w-full text-center">
            <div className="relative inline-block">
              <Button
                onClick={handleOpenDashboard}
                className="relative overflow-hidden bg-wedding-gold hover:bg-wedding-deep-gold text-white px-8 py-6 rounded-full transition-all duration-300 shadow-gold-soft hover:shadow-gold-glow"
              >
                <span className="relative z-10 flex items-center font-medium">
                  <Sparkles size={18} className="mr-2" />
                  Explore Our Event Dashboard
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-wedding-gold to-wedding-deep-gold opacity-0 hover:opacity-100 transition-opacity duration-500"></span>
                
                {/* Decorative elements */}
                <span className="absolute -top-6 -left-6 text-white/10">
                  <Gift size={24} />
                </span>
                <span className="absolute -bottom-6 -right-6 text-white/10">
                  <Heart size={24} />
                </span>
              </Button>
              
              {/* Animated embellishments */}
              <div className="absolute -left-4 -top-4 w-8 h-8 border-t-2 border-l-2 border-wedding-blush/40 rounded-tl-lg"></div>
              <div className="absolute -right-4 -top-4 w-8 h-8 border-t-2 border-r-2 border-wedding-blush/40 rounded-tr-lg"></div>
              <div className="absolute -left-4 -bottom-4 w-8 h-8 border-b-2 border-l-2 border-wedding-blush/40 rounded-bl-lg"></div>
              <div className="absolute -right-4 -bottom-4 w-8 h-8 border-b-2 border-r-2 border-wedding-blush/40 rounded-br-lg"></div>
            </div>
          </div>
          
          <Footer />
          
          {/* RSVP Modal */}
          <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} />
        </div>
      )}
    </div>
  );
};

export default Invitation;
