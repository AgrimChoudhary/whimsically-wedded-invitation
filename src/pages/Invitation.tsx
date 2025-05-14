import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { FloatingPetals, Confetti } from '@/components/AnimatedElements';
import { ArrowLeftCircle, Heart, User, Music, Volume2, VolumeX } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Default values from weddingConfig, used as fallbacks or if DB data is incomplete
import { 
  WEDDING_DATE as DEFAULT_WEDDING_DATE, 
  WEDDING_TIME as DEFAULT_WEDDING_TIME, 
  GROOM_FIRST_NAME as DEFAULT_GROOM_FIRST_NAME, 
  BRIDE_FIRST_NAME as DEFAULT_BRIDE_FIRST_NAME,
  // Constants for sections not yet dynamic
  GROOM_LAST_NAME, 
  BRIDE_LAST_NAME,
  GROOM_FATHER,
  GROOM_MOTHER,
  BRIDE_FATHER,
  BRIDE_MOTHER,
  VENUE_NAME as DEFAULT_VENUE_NAME, // Will be from DB
  // VENUE_ADDRESS, // Will be from DB
  // VENUE_MAP_LINK, // Will be from DB
  WEDDING_PHOTOS
} from '@/config/weddingConfig';

// Define a type for the master invitation details fetched from Supabase
interface MasterInvitationDetails {
  id: string;
  bride_first_name: string;
  bride_last_name: string;
  groom_first_name: string;
  groom_last_name: string;
  wedding_date: string; // YYYY-MM-DD
  wedding_time: string; // HH:MM
  couple_photo_url?: string | null;
  venue_name: string;
  venue_address: string;
  venue_map_link?: string | null;
  phone_number?: string | null;
  email?: string | null;
  // Add other fields from 'invitations' table as needed
}

const fetchMasterInvitationDetails = async (): Promise<MasterInvitationDetails | null> => {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
    console.error('Error fetching master invitation details:', error);
    throw error; // Or handle more gracefully, e.g., return null and use all defaults
  }
  return data as MasterInvitationDetails | null;
};

const Invitation = () => {
  const [initialPageLoading, setInitialPageLoading] = useState(true); // Renamed from isLoading to avoid conflict
  const [showRSVP, setShowRSVP] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false); // Renamed from confetti
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  
  const { guestName, isLoading: isGuestLoading, updateGuestStatus, guestId, hasAccepted } = useGuest();
  const { isPlaying, toggleMusic } = useAudio();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: invitationDetails, isLoading: isLoadingInvitationDetails } = useQuery<MasterInvitationDetails | null>({
    queryKey: ['masterInvitationDetails'],
    queryFn: fetchMasterInvitationDetails,
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialPageLoading(false);
    }, 1500);
    
    if (guestId && hasAccepted) {
      setShowThankYouMessage(true);
    }
    
    return () => clearTimeout(timer);
  }, [guestId, hasAccepted]);
  
  // Removed handleOpenRSVP as RSVPModal not primary focus here

  const handleAcceptInvitation = () => {
    setConfettiActive(true);
    updateGuestStatus('accepted');
    setTimeout(() => {
      setShowThankYouMessage(true);
      setConfettiActive(false);
    }, 800);
  };

  const parseWeddingDateTime = () => {
    const dateStr = invitationDetails?.wedding_date || DEFAULT_WEDDING_DATE.replace(/,/g, '');
    const timeStr = invitationDetails?.wedding_time || DEFAULT_WEDDING_TIME;

    // Parse date (YYYY-MM-DD or Month Day Year)
    let year, month, day;
    if (dateStr.includes('-')) { // YYYY-MM-DD
        [year, month, day] = dateStr.split('-').map(Number);
        month -= 1; // JS months are 0-indexed
    } else { // Month Day Year
        const parts = dateStr.split(' ');
        month = new Date(Date.parse(`${parts[0]} 1, 2000`)).getMonth();
        day = parseInt(parts[1], 10);
        year = parseInt(parts[2], 10);
    }
    
    // Parse time (HH:MM)
    let hours = 19, minutes = 0; // Default to 7:00 PM
    if (timeStr) {
        const timeParts = timeStr.match(/(\d+):(\d+)/);
        if (timeParts) {
            hours = parseInt(timeParts[1], 10);
            minutes = parseInt(timeParts[2], 10);
        }
    }
    
    return new Date(year, month, day, hours, minutes, 0);
  };
  
  const weddingDateObject = parseWeddingDateTime();
  
  const getCurrentGuestIdPath = () => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length === 2 && pathParts[0] === 'invitation') {
      return pathParts[1]; // This is the guest ID from URL like /invitation/:guestId
    }
    // If the path is just /:guestId (older format perhaps)
    if (pathParts.length === 1 && pathParts[0] !== 'invitation' && pathParts[0] !== 'guest-management') {
        return pathParts[0];
    }
    return null;
  };
  
  const currentGuestIdPath = getCurrentGuestIdPath();

  // Determine effective values, preferring DB over defaults
  const effectiveGroomFirstName = invitationDetails?.groom_first_name || DEFAULT_GROOM_FIRST_NAME;
  const effectiveBrideFirstName = invitationDetails?.bride_first_name || DEFAULT_BRIDE_FIRST_NAME;
  const effectiveWeddingTime = invitationDetails?.wedding_time || DEFAULT_WEDDING_TIME;

  const isLoadingCombined = initialPageLoading || isLoadingInvitationDetails;

  return (
    <div className="min-h-screen w-full pattern-background">
      {isLoadingCombined ? (
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
                    <span className="font-great-vibes gold-highlight animate-shimmer">{guestName || "Guest Name"}</span>
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
          <Confetti isActive={confettiActive} />
          
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
                onClick={() => currentGuestIdPath ? navigate(`/${currentGuestIdPath}`) : navigate('/')}
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
              onClick={() => currentGuestIdPath ? navigate(`/${currentGuestIdPath}`) : navigate('/')}
              className="fixed top-4 left-4 z-30 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeftCircle size={16} className="mr-1" />
              <span className="text-xs">Back</span>
            </button>
          )}
          
          <InvitationHeader 
            groomName={effectiveGroomFirstName}
            brideName={effectiveBrideFirstName}
          />
          
          <CountdownTimer 
            weddingDate={weddingDateObject} 
            weddingTime={effectiveWeddingTime} // Pass the time string
          />
          
          <FamilyDetails 
            groomFamily={{
              title: "Groom's Family",
              members: [
                { name: `Mr. ${GROOM_FATHER} & Mrs. ${GROOM_MOTHER}`, relation: "Parents of the Groom", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ILlate0ymbJOAj2L--rea5OqaoYCckJFB1_M7D_sA4EfkDh9-iLSw7jKFb9INTnIJWg&usqp=CAU", description: "Loving parents..." },
                { 
                  name: `Mr. ${GROOM_FATHER}`, 
                  relation: "Father of the Groom",
                  image: "https://yt3.ggpht.com/2Ume85bWmFMd-2-NYAZ-tJhTOBMfn84Pujcfh-lBfW7e-9aQwnS7CIz_nEIwL1BDpjGNVkUMSU7w=s890-nd-v1",
                  description: "A loving father who has been his son's strength and inspiration.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mrs. Saroj Kohli", 
                  relation: "Mother of the Groom",
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ILlate0ymbJOAj2L--rea5OqaoYCckJFB1_M7D_sA4EfkDh9-iLSw7jKFb9INTnIJWg&usqp=CAU",
                  description: "A homemaker whose love and support have been the foundation of their family.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mr. Vikas Kohli", 
                  relation: "Brother of the Groom",
                  image: "https://static.abplive.com/wp-content/uploads/2020/03/16185151/5.jpg",
                  description: "An elder brother who has always been Virat's role model.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mrs. Bhawna Dhingra", 
                  relation: "Sister of the Groom",
                  image: "https://telugu.cdn.zeenews.com/telugu/sites/default/files/bhawnakohlidhingra.jpg",
                  description: "An elder sister who has always been supportive of Virat.",
                  showInDialogOnly: true
                },
              ],
            }}
            brideFamily={{
              title: "Bride's Family",
              members: [
                { name: `Mr. ${BRIDE_FATHER} & Mrs. ${BRIDE_MOTHER}`, relation: "Parents of the Bride", image: "https://pbs.twimg.com/media/EXojUvqWoAMir7F.jpg", description: "Loving parents..." },
                { 
                  name: `Mr. ${BRIDE_FATHER}`, 
                  relation: "Father of the Bride",
                  image: "https://static.toiimg.com/thumb/msid-73275478,width-400,resizemode-4/73275478.jpg",
                  description: "A loving father who has been her pillar of strength.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mrs. Ashima Sharma", 
                  relation: "Mother of the Bride",
                  image: "https://pbs.twimg.com/media/EXojUvqWoAMir7F.jpg",
                  description: "A loving mother who has been her guiding light.",
                  showInDialogOnly: true
                },
                { 
                  name: "Mr. Karnesh Sharma", 
                  relation: "Brother of the Bride",
                  image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTI_d1kgU8WyT9_M93C9EBA-rfdg00hK23XwEMB3fux1VId-HG5",
                  description: "An elder brother who has always been supportive of Anushka.",
                  showInDialogOnly: true
                },
              ],
            }}
          />

          <CoupleSection /> {/* Uses GROOM_FIRST_NAME, BRIDE_FIRST_NAME from config for now */}
  
          <EventTimeline /> {/* Uses hardcoded events for now */}
          
          <PhotoGrid
            title="Our Photo Gallery" 
            photos={WEDDING_PHOTOS} // Uses weddingConfig.ts for now
          />
          
          <div className="py-10 w-full text-center bg-floral-pattern">
            <div className="relative inline-block">
              {showThankYouMessage ? (
                <div className="luxury-card p-6 border border-wedding-gold/30 shadow-gold-glow rounded-lg text-center luxury-glow-hover">
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
