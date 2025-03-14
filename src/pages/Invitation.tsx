
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
import { FloatingPetals, MusicPlayer } from '@/components/AnimatedElements';
import { ArrowLeftCircle, Sparkles } from 'lucide-react';

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const { guestName } = useGuest();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulating page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
          
          {/* Back button */}
          <button 
            onClick={() => navigate('/')}
            className="fixed top-4 left-4 z-30 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300"
            aria-label="Go back"
          >
            <ArrowLeftCircle size={20} className="mr-1" />
            <span className="text-sm">Back</span>
          </button>
          
          {/* Content */}
          <InvitationHeader />
          <CoupleSection />
          <FamilyDetails />
          <EventTimeline />
          <PhotoGrid />
          <CountdownTimer />
          
          {/* Dashboard Button */}
          <div className="py-12 w-full text-center">
            <Button
              onClick={() => setShowRSVP(true)}
              className="relative overflow-hidden bg-wedding-gold hover:bg-wedding-gold/90 text-white px-8 py-6 rounded-full transition-all duration-300 shadow-gold-soft hover:shadow-gold-glow"
            >
              <span className="relative z-10 flex items-center font-medium">
                <Sparkles size={18} className="mr-2" />
                Explore Our Event Dashboard
              </span>
              <span className="absolute inset-0 bg-wedding-deep-gold opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
            </Button>
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
