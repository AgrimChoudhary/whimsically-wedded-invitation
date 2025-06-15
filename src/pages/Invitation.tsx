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
import WishesCarousel from '@/components/WishesCarousel';
import WishesModal from '@/components/WishesModal';
import Footer from '@/components/Footer';
import RSVPModal from '@/components/RSVPModal';
import { FloatingPetals, Confetti, FireworksDisplay } from '@/components/AnimatedElements';
import { ArrowLeftCircle, Heart, MapPin, User, Music, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import AnimatedGuestName from '../components/AnimatedGuestName';

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [showWishesModal, setShowWishesModal] = useState(false);
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
          
          {/* Section ordering: countdown, family details, romantic journey, wedding journey, events, photos, wishes */}
          <CountdownTimer 
            weddingDate={weddingData.mainWedding.date} 
            weddingTime={weddingData.mainWedding.time}
          />
          
          <FamilyDetails 
            groomFamily={weddingData.family.groomFamily}
            brideFamily={weddingData.family.brideFamily}
          />

          {/* New Romantic Journey Section */}
          <RomanticJourneySection />

          <CoupleSection />
  
          <EventTimeline />
          
          <PhotoGrid
            title="Our Photo Gallery" 
            photos={weddingData.photoGallery}
          />

          {/* New Wishes Carousel Section */}
          <WishesCarousel onViewAll={() => setShowWishesModal(true)} />
          
          {/* Enhanced Accept Invitation Section with Visual Focus */}
          <div className="py-16 w-full text-center relative overflow-hidden">
            {/* Spotlight Background Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-wedding-gold/10 via-wedding-cream/20 to-transparent"></div>
            
            {/* Subtle Border Lines Leading to Button */}
            <div className="absolute inset-x-0 top-8 h-px bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-8 h-px bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
            
            {/* Decorative Side Lines */}
            <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 w-px h-24 md:h-32 bg-gradient-to-b from-transparent via-wedding-gold/40 to-transparent"></div>
            <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-px h-24 md:h-32 bg-gradient-to-b from-transparent via-wedding-gold/40 to-transparent"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto px-4">
              {/* Focus Ring Around Content */}
              <div className="absolute -inset-8 md:-inset-12 rounded-3xl border-2 border-wedding-gold/20 opacity-60 animate-pulse"></div>
              <div className="absolute -inset-4 md:-inset-6 rounded-2xl border border-wedding-gold/30 opacity-40"></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-wedding-gold/20">
                {showThankYouMessage ? (
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-playfair text-wedding-maroon mb-2">
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
                    <h3 className="text-xl md:text-2xl font-playfair text-wedding-maroon mb-4">Thank You for Accepting!</h3>
                    <p className="text-gray-600 mb-4 font-poppins">We are extremely excited to celebrate our special day with you!</p>
                    <p className="text-sm text-wedding-maroon italic font-poppins">
                      We are truly honored to have you join us in our celebration of love and commitment.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    {/* Call to Action Text */}
                    <h3 className="text-2xl md:text-3xl font-playfair text-wedding-maroon mb-4">
                      Your Presence is Our Present
                    </h3>
                    <p className="text-wedding-gold/80 mb-8 font-poppins text-sm md:text-base">
                      Please confirm your attendance to make our day complete
                    </p>
                    
                    {/* Enhanced Accept Button with Spotlight Effect */}
                    <div className="relative inline-block">
                      {/* Glowing Ring Effect */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-wedding-gold/30 via-wedding-deep-gold/40 to-wedding-gold/30 rounded-full blur-xl animate-pulse"></div>
                      
                      <Button
                        onClick={handleAcceptInvitation}
                        className="relative overflow-hidden bg-gradient-to-r from-wedding-gold via-wedding-deep-gold to-wedding-gold hover:from-wedding-deep-gold hover:via-wedding-gold hover:to-wedding-deep-gold text-white px-10 py-6 md:px-12 md:py-8 rounded-full transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-110 text-base md:text-lg font-semibold border-2 border-white/30"
                      >
                        <span className="relative z-10 flex items-center font-medium">
                          <Heart size={20} className="md:w-6 md:h-6 mr-3 animate-pulse" />
                          Accept Invitation
                        </span>
                        
                        {/* Shimmer Effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer"></span>
                        
                        {/* Decorative Icons */}
                        <span className="absolute -top-6 -left-6 text-white/20">
                          <Heart size={24} className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </span>
                        <span className="absolute -bottom-6 -right-6 text-white/20">
                          <Sparkles size={24} className="animate-pulse" style={{ animationDelay: '1s' }} />
                        </span>
                      </Button>
                    </div>
                    
                    <p className="text-xs md:text-sm text-wedding-gold/60 mt-6 font-poppins italic">
                      "A wedding is a celebration of love, and we want to celebrate with you"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Footer />
          
          <RSVPModal open={showRSVP} onOpenChange={() => setShowRSVP(false)} />
          <WishesModal open={showWishesModal} onOpenChange={setShowWishesModal} />
        </div>
      )}
    </div>
  );
};

export default Invitation;
