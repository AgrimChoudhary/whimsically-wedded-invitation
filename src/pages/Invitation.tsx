
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import InvitationHeader from '@/components/InvitationHeader';
import CoupleSection from '@/components/CoupleSection';
import CountdownTimer from '@/components/CountdownTimer';
import FamilyDetails from '@/components/FamilyDetails';
import EventTimeline from '@/components/EventTimeline';
import PhotoGrid from '@/components/PhotoGrid';
import Footer from '@/components/Footer';
import RSVPModal from '@/components/RSVPModal';
import { FloatingPetals, Confetti, FireworksDisplay } from '@/components/AnimatedElements';
import { ArrowLeftCircle, Sparkles, Heart, MapPin, User, Music, Volume2, VolumeX, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const { guestName, isLoading: isGuestLoading, updateGuestStatus } = useGuest();
  const { isPlaying, toggleMusic } = useAudio();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  // Wedding date - April 29, 2025
  const weddingDate = new Date('2025-04-29T20:00:00');
  
  // Get guestId from path to use for navigation
  const getCurrentGuestId = () => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length === 2 && pathParts[0] === 'invitation') {
      return pathParts[1];
    }
    return null;
  };
  
  const guestId = getCurrentGuestId();

  return (
    <div className="min-h-screen w-full pattern-background">
      {isLoading ? (
        <div className="loading-overlay flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            <div className="loading-spinner mb-4 w-16 h-16 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-wedding-gold/10 rounded-full animate-pulse-soft"></div>
          </div>
          <p className="text-wedding-maroon font-dancing-script text-xl mb-1">Preparing your invitation...</p>
          <p className="text-wedding-gold/70 text-sm">The celebration awaits!</p>
        </div>
      ) : (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
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
              <>
                <Button 
                  onClick={() => guestId ? navigate(`/${guestId}`) : navigate('/')}
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-wedding-cream/80 backdrop-blur-sm border-wedding-gold/30 hover:bg-wedding-cream shadow-gold-soft"
                  aria-label="Go back"
                >
                  <ArrowLeftCircle size={18} className="text-wedding-maroon" />
                </Button>
                
                <Button 
                  onClick={() => navigate('/guest-management')}
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-wedding-cream/80 backdrop-blur-sm border-wedding-gold/30 hover:bg-wedding-cream shadow-gold-soft"
                  aria-label="Guest Management"
                >
                  <Users size={18} className="text-wedding-maroon" />
                </Button>
              </>
            )}
          </div>
          
          {isMobile && (
            <>
              <button 
                onClick={() => guestId ? navigate(`/${guestId}`) : navigate('/')}
                className="fixed top-4 left-4 z-30 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
                aria-label="Go back"
              >
                <ArrowLeftCircle size={16} className="mr-1" />
                <span className="text-xs">Back</span>
              </button>
              
              <button
                onClick={() => navigate('/guest-management')}
                className="fixed top-4 right-4 z-30 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
                aria-label="Guest Management"
              >
                <Users size={16} className="mr-1" />
                <span className="text-xs">Manage</span>
              </button>
            </>
          )}
          
          <InvitationHeader 
            groomName="Umashankar"
            brideName="Bhavana"
          />
          
          <CountdownTimer 
            weddingDate={weddingDate} 
            weddingTime="8:00 PM"
          />
          
          <CoupleSection />
          
          <FamilyDetails 
            groomFamily={{
              title: "Groom's Family",
              members: [
                { 
                  name: "श्रीमती ललिता देवी & तेजराम शर्मा", 
                  relation: "Parents (Groom)",
                  image: "https://images.unsplash.com/photo-1604849329114-a8c9f4e4b926",
                  description: ""
                }
              ]
            }}
            brideFamily={{
              title: "Bride's Family",
              members: [
                { 
                  name: "श्रीमती गीता देवी & बालकृष्ण जी शर्मा", 
                  relation: "Parents (Bride)",
                  image: "https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f",
                  description: ""
                }
              ]
            }}
          />
          
          <EventTimeline />
          <PhotoGrid />
          
          <div className="py-10 w-full text-center bg-floral-pattern">
            <div className="relative inline-block">
              {showThankYouMessage ? (
                <div className="glass-card p-6 border border-wedding-gold/30 shadow-gold-glow rounded-lg text-center">
                  <h3 className="text-xl font-playfair text-wedding-maroon mb-2">
                    {isGuestLoading ? (
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    ) : (
                      <>Dear {guestName || 'Guest'},</>
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
          
          <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} />
        </div>
      )}
    </div>
  );
};

export default Invitation;
