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
import { ArrowLeftCircle, Heart, MapPin, User, Music, Volume2, VolumeX } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import AnimatedGuestName from '../components/AnimatedGuestName';

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const { guestName, isLoading: isGuestLoading, updateGuestStatus, guestId, hasAccepted } = useGuest();
  const { isPlaying, toggleMusic } = useAudio();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
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

  // Wedding date - May 15, 2025
  const weddingDate = new Date('2025-05-15T20:00:00'); // PLACEHOLDER_WEDDING_DATE
  
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
            groomName="Sidharth Malhotra"
            brideName="Kiara Advani"
          />
          
          {/* Section ordering as requested: countdown, wedding journey, family details, events, photos */}
          <CountdownTimer 
            weddingDate={weddingDate} 
            weddingTime="8:00 PM"
          />
          
          <FamilyDetails 
            groomFamily={{
              title: "Groom's Family",
              members: [
                { 
                  name: "Mr. Sunil Malhotra & Mrs. Rimma Malhotra", 
                  relation: "Parents of the Groom",
                  image: "https://i.imgur.com/0ptttDA.jpg",
                  description: "Loving parents who have guided him through life's journey."
                },
                { 
                  name: "Mr. Sunil Malhotra", 
                  relation: "Father of the Groom",
                  image: "https://i.imgur.com/gyWCv9j.jpg",
                  description: "A captain in the merchant navy who has been his son's strength and inspiration.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mrs. Rimma Malhotra", 
                  relation: "Mother of the Groom",
                  image: "https://i.imgur.com/inlRoXu.jpg",
                  description: "A homemaker whose love and support have been the foundation of their family.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mr. Harshad Malhotra", 
                  relation: "Brother of the Groom",
                  image: "https://i.imgur.com/wXn3A6m.jpg",
                  description: "An elder brother who works in the banking sector and has always been Sidharth's role model.",
                  showInDialogOnly: true
                },
              ],
            }}
            brideFamily={{
              title: "Bride's Family",
              members: [
                { 
                  name: "Mr. Jagdeep Advani & Mrs. Genevieve Advani", 
                  relation: "Parents of the Bride",
                  image: "https://i.imgur.com/sc58DrO.jpg",
                  description: "Loving parents who have always encouraged her to follow her dreams."
                },
                { 
                  name: "Mr. Jagdeep Advani", 
                  relation: "Father of the Bride",
                  image: "https://i.imgur.com/LtWkc4z.jpg",
                  description: "A successful businessman from a Sindhi family who has been her pillar of strength.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mrs. Genevieve Advani", 
                  relation: "Mother of the Bride",
                  image: "https://i.imgur.com/NmpDsyO.jpg",
                  description: "A former teacher with Scottish, Irish, and Portuguese ancestry who has been her guiding light.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mr. Mishaal Advani", 
                  relation: "Brother of the Bride",
                  image: "https://i.imgur.com/hYL8v2C.jpg",
                  description: "A musician who followed his passion after working as a software engineer.",
                  showInDialogOnly: true
                },
              ],
            }}
          />

          <CoupleSection />
  
          <EventTimeline />
          
          <PhotoGrid
            title="Our Photo Gallery" 
            photos={[
              { 
                url: "https://i.imgur.com/6a2Edjt.jpg",
                title: "Our Wedding Day",
                description: "The most magical day of our lives"
              },
              { 
                url: "https://i.imgur.com/OvJZV2K.jpg",
                title: "Mehendi Celebration",
                description: "Celebrating our mehendi ceremony with loved ones"
              },
              { 
                url: "https://i.imgur.com/ST4jeDE.jpg",
                title: "Mumbai Reception",
                description: "Our reception with friends and family"
              },
              { 
                url: "https://i.imgur.com/gV5IYa8.jpg",
                title: "Shershaah Promotion",
                description: "Together at the Shershaah promotional event"
              },
              { 
                url: "https://i.imgur.com/D74vxms.jpg",
                title: "Haldi Ceremony",
                description: "Joyful moments from our haldi ceremony"
              },
              { 
                url: "https://i.imgur.com/ZrQMiH6.jpg",
                title: "Wedding Portrait",
                description: "A special portrait after our wedding"
              },
            ]}
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
