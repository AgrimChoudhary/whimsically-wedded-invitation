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
  
  // Couple names as placeholders for easy future changes
  const GROOM_FIRST_NAME = "Sidharth";
  const GROOM_LAST_NAME = "Malhotra";
  const BRIDE_FIRST_NAME = "Kiara";
  const BRIDE_LAST_NAME = "Advani";
  const GROOM_FATHER = "Sunil Malhotra";
  const GROOM_MOTHER = "Rimma Malhotra";
  const BRIDE_FATHER = "Jagdeep Advani";
  const BRIDE_MOTHER = "Genevieve Advani";
  
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

  // Calculate wedding date - 1.5 months from now
  const getWeddingDate = () => {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setMonth(now.getMonth() + 1);
    futureDate.setDate(now.getDate() + 15); // Add 15 days to make it 1.5 months
    futureDate.setHours(20, 0, 0, 0); // 8:00 PM
    return futureDate;
  };
  
  const weddingDate = getWeddingDate();
  
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
            groomName={GROOM_FIRST_NAME}
            brideName={BRIDE_FIRST_NAME}
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
                  name: `Mr. ${GROOM_FATHER} & Mrs. ${GROOM_MOTHER}`, 
                  relation: "Parents of the Groom",
                  image: "https://www.bollywoodbiography.in/wp-content/uploads/2021/11/sunil-malhotra-with-wife-rimma-malhotra.webp",
                  description: "Loving parents who have guided him through life's journey."
                },
                { 
                  name: `Mr. ${GROOM_FATHER}`, 
                  relation: "Father of the Groom",
                  image: "https://i.redd.it/cpy26r2olopc1.jpeg",
                  description: "A captain in the merchant navy who has been his son's strength and inspiration.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mrs. Rimma Malhotra", 
                  relation: "Mother of the Groom",
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlLzeDQRuyataQCZvhLYG9Zmnt5Ukhga_Y4s-7kapr87PeSxxd",
                  description: "A homemaker whose love and support have been the foundation of their family.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mr. Harshad Malhotra", 
                  relation: "Brother of the Groom",
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSky-6UnO7vxLPnf6QWlgLPKcgqNNQpkVVwHvtzeEDgnZcMkPPA8y5nsMJzf63z58v6WPBhb37K3tVNKO72k8iuCg",
                  description: "An elder brother who works in the banking sector and has always been Sidharth's role model.",
                  showInDialogOnly: true
                },
              ],
            }}
            brideFamily={{
              title: "Bride's Family",
              members: [
                { 
                  name: `Mr. ${BRIDE_FATHER} & Mrs. ${BRIDE_MOTHER}`, 
                  relation: "Parents of the Bride",
                  image: "https://static.toiimg.com/thumb/imgsize-23456,msid-70473421,width-600,resizemode-4/70473421.jpg",
                  description: "Loving parents who have always encouraged her to follow her dreams."
                },
                { 
                  name: `Mr. ${BRIDE_FATHER}`, 
                  relation: "Father of the Bride",
                  image: "https://starsunfolded.com/wp-content/uploads/2023/02/Jagdeep-Advani.jpg",
                  description: "A successful businessman from a Sindhi family who has been her pillar of strength.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mrs. Genevieve Advani", 
                  relation: "Mother of the Bride",
                  image: "https://www.bollywoodbiography.in/wp-content/uploads/2023/02/Genevieve-Jaffrey.jpg",
                  description: "A former teacher with Scottish, Irish, and Portuguese ancestry who has been her guiding light.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mr. Mishaal Advani", 
                  relation: "Brother of the Bride",
                  image: "https://static.sociofyme.com/thumb/97725020/97725020.jpg?imgsize=702924&width=420&height=746&resizemode=76",
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
                url: "https://shaadiwish.com/blog/wp-content/uploads/2023/02/Kiara-Advani-Pink-Lehenga-1.jpg",
                title: "Our Wedding Day",
                description: "The most magical day of our lives"
              },
              { 
                url: "https://i.ytimg.com/vi/ie5LRcmvSss/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBa2_kuZKn5ezhF-rnkbiN_HPK4bA",
                title: "Mehendi Celebration",
                description: "Celebrating our mehendi ceremony with loved ones"
              },
              { 
                url: "https://i.ytimg.com/vi/PuDFCIGk0Ow/sddefault.jpg",
                title: "Mumbai Reception",
                description: "Our reception with friends and family"
              },
              { 
                url: "https://cdn.shopify.com/s/files/1/0665/6222/8454/files/Kiara_Advani_wedding_jewellery_480x480.jpg?v=1681196092",
                title: "Wedding Jewelry",
                description: "Beautiful jewelry for our special day"
              },
              { 
                url: "https://peepingmoon-cdn.sgp1.digitaloceanspaces.com/engpeepingmoon/060223115000-63e0e9683fa72sidharth-malhotra-kiara-advani-sangeet-resized.jpg",
                title: "Sangeet Ceremony",
                description: "Joyful moments from our sangeet celebration"
              },
              { 
                url: "https://data1.ibtimes.co.in/en/full/781807/sidharth-malhotra-kiara-advani-wedding.jpg?h=450&l=50&t=40",
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
