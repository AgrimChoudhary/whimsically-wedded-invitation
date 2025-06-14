
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import { useWedding } from '@/context/WeddingContext';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import InvitationHeader from '@/components/InvitationHeader';
import CoupleSection from '@/components/CoupleSection';
import CountdownTimer from '@/components/CountdownTimer';
import FamilyDetails from '@/components/FamilyDetails';
import RomanticJourneySection from '@/components/RomanticJourneySection';
import EventTimeline from '@/components/EventTimeline';
import PhotoGrid from '@/components/PhotoGrid';
import Footer from '@/components/Footer';
import RSVPModal from '@/components/RSVPModal';
import { FloatingPetals, Confetti, FireworksDisplay } from '@/components/AnimatedElements';
import { ArrowLeftCircle, Heart, MapPin, User, Music, Volume2, VolumeX } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import AnimatedGuestName from '../components/AnimatedGuestName';

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [showGaneshaTransition, setShowGaneshaTransition] = useState(false);
  const [hideGaneshaTransition, setHideGaneshaTransition] = useState(false);
  const [startGuestNameAnimation, setStartGuestNameAnimation] = useState(false);
  const { guestName, isLoading: isGuestLoading, updateGuestStatus, guestId, hasAccepted } = useGuest();
  const { weddingData } = useWedding();
  const { isPlaying, toggleMusic } = useAudio();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Start Ganesha transition after loading completes with a slight delay for smoother experience
      setTimeout(() => {
        setShowGaneshaTransition(true);
        // Hide the transition element after animation completes (4s total for smoother transition)
        setTimeout(() => {
          setHideGaneshaTransition(true);
          // Start guest name animation after Ganesha transition completes
          setTimeout(() => {
            setStartGuestNameAnimation(true);
          }, 300);
        }, 4000);
      }, 200);
    }, 1500);
    
    // If there's a guestId and they've already accepted, show thank you message
    if (guestId && hasAccepted) {
      setShowThankYouMessage(true);
    }
    
    return () => clearTimeout(timer);
  }, [guestId, hasAccepted]);
  
  const handleOpenRSVP = () => {
    setConfetti(true);
    setTimeout(() => {
      setShowRSVP(true);
      setConfetti(false);
    }, 800);
  };

  const handleAcceptInvitation = () => {
    setConfetti(true);
    updateGuestStatus('accepted');
    setTimeout(() => {
      setShowThankYouMessage(true);
      setConfetti(false);
    }, 800);
  };
  
  // Get guestId from path to use for navigation
  const getCurrentGuestId = () => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length === 2 && pathParts[0] === 'invitation') {
      return pathParts[1];
    }
    return null;
  };
  
  const currentGuestId = getCurrentGuestId();

  return (
    <div className="min-h-screen w-full pattern-background">
      {isLoading ? (
        <div className="loading-overlay flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            <div className="loading-spinner mb-4 w-16 h-16 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-wedding-gold/10 rounded-full animate-pulse-soft"></div>
          </div>
          
          {/* Ganesha Image in Loading Screen */}
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 via-yellow-400/30 to-red-400/20 rounded-full blur-xl animate-pulse-soft"></div>
            <div className="relative bg-gradient-to-br from-orange-50/90 via-yellow-50/95 to-orange-50/90 backdrop-blur-lg rounded-full p-6 border border-orange-200/60">
              <img 
                src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                alt="Lord Ganesha" 
                className="w-24 h-24 object-contain animate-floating"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-wedding-maroon font-dancing-script text-xl md:text-2xl mb-2">Preparing your invitation...</p>
            
            <div className="mb-3 mt-1 relative">
              <h3 className="font-great-vibes text-xl md:text-2xl text-wedding-gold">
                Dear <span className="relative inline-block min-w-[80px]">
                  {isGuestLoading ? (
                    <span className="absolute inset-0 w-full h-6 bg-wedding-gold/10 rounded animate-pulse"></span>
                  ) : (
                    <span className="font-great-vibes gold-highlight animate-shimmer">{guestName || "Guest"}</span>
                  )}
                </span>
              </h3>
              
              <div className="mt-1 mx-auto w-32 h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
            </div>
            
            <p className="text-wedding-gold/70 text-sm md:text-base font-dancing-script">
              The celebration awaits<span className="loading-dots"></span>
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
          {/* Enhanced Transitioning Ganesha Image */}
          {showGaneshaTransition && !hideGaneshaTransition && (
            <div 
              className="fixed inset-0 z-50 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.3) 70%, transparent 100%)'
              }}
            >
              <div className="ganesha-transition-container">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 via-yellow-400/30 to-red-400/20 rounded-full blur-xl animate-pulse-soft"></div>
                  <div className="relative bg-gradient-to-br from-orange-50/90 via-yellow-50/95 to-orange-50/90 backdrop-blur-lg rounded-full p-6 border border-orange-200/60">
                    <img 
                      src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                      alt="Lord Ganesha" 
                      className="w-24 h-24 object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <FloatingPetals />
          <Confetti isActive={confetti} />
          
          <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-3">
            <Button 
              onClick={toggleMusic}
              variant="outline"
              size="icon"
              className="rounded-full bg-wedding-cream/80 backdrop-blur-sm border-wedding-gold/30 hover:bg-wedding-cream shadow-gold-soft"
              aria-label={isPlaying ? "Mute music" : "Play music"}
            >
              {isPlaying ? (
                <Volume2 size={18} className="text-wedding-maroon" />
              ) : (
                <VolumeX size={18} className="text-wedding-maroon" />
              )}
            </Button>
            
            {!isMobile && (
              <Button 
                onClick={() => currentGuestId ? navigate(`/${currentGuestId}`) : navigate('/')}
                variant="outline"
                size="icon"
                className="rounded-full bg-wedding-cream/80 backdrop-blur-sm border-wedding-gold/30 hover:bg-wedding-cream shadow-gold-soft"
                aria-label="Go back"
              >
                <ArrowLeftCircle size={18} className="text-wedding-maroon" />
              </Button>
            )}
          </div>
          
          {isMobile && (
            <button 
              onClick={() => currentGuestId ? navigate(`/${currentGuestId}`) : navigate('/')}
              className="fixed top-4 left-4 z-30 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeftCircle size={16} className="mr-1" />
              <span className="text-xs">Back</span>
            </button>
          )}
          
          <InvitationHeader 
            groomName={weddingData.couple.groomFirstName}
            brideName={weddingData.couple.brideFirstName}
            startGuestNameAnimation={startGuestNameAnimation}
          />
          
          {/* Section ordering: countdown, family details, romantic journey, wedding journey, events, photos */}
          <CountdownTimer 
            weddingDate={weddingData.mainWedding.date} 
            weddingTime={weddingData.mainWedding.time}
          />
          
          <FamilyDetails />

          {/* New Romantic Journey Section */}
          <RomanticJourneySection />

          <CoupleSection />
  
          <EventTimeline />
          
          <PhotoGrid
            title="Our Photo Gallery" 
            photos={weddingData.photoGallery}
          />
          
          <div className="py-10 w-full text-center bg-floral-pattern">
            <div className="relative inline-block">
              {showThankYouMessage ? (
                <div className="glass-card p-6 border border-wedding-gold/30 shadow-gold-glow rounded-lg text-center">
                  <h3 className="text-xl font-playfair text-wedding-maroon mb-2">
                    {isGuestLoading ? (
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    ) : (
                      <>
                        Dear{' '}
                        <AnimatedGuestName 
                          name={guestName}
                          animationType="brush"
                          className="font-playfair text-wedding-maroon"
                          delay={700}
                          fallback="Guest Name"
                        />,
                      </>
                    )}
                  </h3>
                  <h3 className="text-xl font-playfair text-wedding-maroon mb-3">Thank You for Accepting!</h3>
                  <p className="text-gray-600 mb-4 font-poppins">We are extremely excited to celebrate our special day with you!</p>
                  <p className="text-sm text-wedding-maroon italic font-poppins">
                    We are truly honored to have you join us in our celebration of love and commitment.
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleAcceptInvitation}
                  className="relative overflow-hidden bg-wedding-gold hover:bg-wedding-deep-gold text-white px-8 py-6 rounded-full transition-all duration-300 shadow-gold-soft hover:shadow-gold-glow"
                >
                  <span className="relative z-10 flex items-center font-medium">
                    <Heart size={18} className="mr-2" />
                    Accept Invitation
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-wedding-gold to-wedding-deep-gold opacity-0 hover:opacity-100 transition-opacity duration-500"></span>
                  
                  <span className="absolute -top-6 -left-6 text-white/10">
                    <User size={24} />
                  </span>
                  <span className="absolute -bottom-6 -right-6 text-white/10">
                    <Heart size={24} />
                  </span>
                </Button>
              )}
              
              <div className="absolute -left-4 -top-4 w-8 h-8 border-t-2 border-l-2 border-wedding-blush/40 rounded-tl-lg"></div>
              <div className="absolute -right-4 -top-4 w-8 h-8 border-t-2 border-r-2 border-wedding-blush/40 rounded-tr-lg"></div>
              <div className="absolute -left-4 -bottom-4 w-8 h-8 border-b-2 border-l-2 border-wedding-blush/40 rounded-bl-lg"></div>
              <div className="absolute -right-4 -bottom-4 w-8 h-8 border-b-2 border-r-2 border-wedding-blush/40 rounded-br-lg"></div>
            </div>
          </div>
          
          <Footer />
          
          <RSVPModal open={showRSVP} onOpenChange={() => setShowRSVP(false)} />
        </div>
      )}
    </div>
  );
};

export default Invitation;
