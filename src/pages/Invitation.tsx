
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import { useAudio } from '@/context/AudioContext';
import { supabase } from '@/integrations/supabase/client';
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
import { ArrowLeftCircle, Heart, Music, Volume2, VolumeX, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import AnimatedGuestName from '../components/AnimatedGuestName';

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [showGaneshaTransition, setShowGaneshaTransition] = useState(false);
  const [hideGaneshaTransition, setHideGaneshaTransition] = useState(false);
  const [startGuestNameAnimation, setStartGuestNameAnimation] = useState(false);
  const [invitationData, setInvitationData] = useState<any>(null);
  const { guestName, isLoading: isGuestLoading, updateGuestStatus, guestId, hasAccepted } = useGuest();
  const { isPlaying, toggleMusic } = useAudio();
  const { invitationId, guestId: urlGuestId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Start Ganesha transition after loading completes
      setTimeout(() => {
        setShowGaneshaTransition(true);
        setTimeout(() => {
          setHideGaneshaTransition(true);
          setTimeout(() => {
            setStartGuestNameAnimation(true);
          }, 300);
        }, 4000);
      }, 200);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (invitationId) {
      fetchInvitationData();
    }
  }, [invitationId]);
  
  const fetchInvitationData = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_invitations')
        .select('*')
        .eq('id', invitationId)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setInvitationData(data);
    } catch (error: any) {
      console.error('Error fetching invitation:', error);
      toast.error('Invitation not found');
      navigate('/');
    }
  };
  
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

  const getWeddingDate = () => {
    if (invitationData?.wedding_date) {
      const date = new Date(invitationData.wedding_date);
      if (invitationData?.wedding_time) {
        const timeString = invitationData.wedding_time;
        const [hours, minutes] = timeString.split(':');
        date.setHours(parseInt(hours), parseInt(minutes));
      } else {
        date.setHours(20, 0, 0, 0);
      }
      return date;
    }
    
    // Fallback to 1.5 months from now
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setMonth(now.getMonth() + 1);
    futureDate.setDate(now.getDate() + 15);
    futureDate.setHours(20, 0, 0, 0);
    return futureDate;
  };
  
  const weddingDate = getWeddingDate();

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
                onClick={() => navigate('/')}
                variant="outline"
                size="icon"
                className="rounded-full bg-wedding-cream/80 backdrop-blur-sm border-wedding-gold/30 hover:bg-wedding-cream shadow-gold-soft"
                aria-label="Go home"
              >
                <Home size={18} className="text-wedding-maroon" />
              </Button>
            )}
          </div>
          
          {isMobile && (
            <button 
              onClick={() => navigate('/')}
              className="fixed top-4 left-4 z-30 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
              aria-label="Go home"
            >
              <Home size={16} className="mr-1" />
              <span className="text-xs">Home</span>
            </button>
          )}
          
          <InvitationHeader 
            invitationData={invitationData}
            startGuestNameAnimation={startGuestNameAnimation}
          />
          
          <CountdownTimer 
            weddingDate={weddingDate} 
            weddingTime={invitationData?.wedding_time || "8:00 PM"}
          />
          
          {/* Use dynamic data if available, otherwise show default family details */}
          <FamilyDetails 
            groomFamily={{
              title: "Groom's Family",
              members: [
                { 
                  name: invitationData?.groom_parents || `Mr. ${invitationData?.invitation_data?.groom_father || 'Sunil Malhotra'} & Mrs. ${invitationData?.invitation_data?.groom_mother || 'Rimma Malhotra'}`, 
                  relation: "Parents of the Groom",
                  image: "https://www.bollywoodbiography.in/wp-content/uploads/2021/11/sunil-malhotra-with-wife-rimma-malhotra.webp",
                  description: "Loving parents who have guided him through life's journey."
                },
              ],
            }}
            brideFamily={{
              title: "Bride's Family",
              members: [
                { 
                  name: invitationData?.bride_parents || `Mr. ${invitationData?.invitation_data?.bride_father || 'Jagdeep Advani'} & Mrs. ${invitationData?.invitation_data?.bride_mother || 'Genevieve Advani'}`, 
                  relation: "Parents of the Bride",
                  image: "https://static.toiimg.com/thumb/imgsize-23456,msid-70473421,width-600,resizemode-4/70473421.jpg",
                  description: "Loving parents who have always encouraged her to follow her dreams."
                },
              ],
            }}
          />

          <RomanticJourneySection />
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
