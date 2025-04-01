
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
import { ArrowLeftCircle, Heart, Volume2, VolumeX } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { fetchInvitationById, formatInvitationData } from '@/lib/supabase-helpers';
import { toast } from '@/hooks/use-toast';

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const { guestName } = useGuest();
  const { isPlaying, toggleMusic } = useAudio();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { id } = useParams();
  
  // Default wedding data - fallback values
  const [invitationData, setInvitationData] = useState({
    brideFirstName: "Ananya",
    brideName: "Ananya",
    brideLastName: "Sharma",
    groomFirstName: "Arjun", 
    groomName: "Arjun",
    groomLastName: "Patel",
    coupleImageUrl: "",
    weddingDate: new Date('2025-04-10'),
    weddingTime: "11:00 AM",
    weddingVenue: "Divine Gardens",
    weddingAddress: "789 Blessing Avenue, New Delhi",
    mapUrl: "https://goo.gl/maps/Ghi12345Jkl",
    contactEmail: "",
    contactPhone: "",
    brideFamily: {
      title: "Sharma Family",
      members: []
    },
    groomFamily: {
      title: "Patel Family",
      members: []
    },
    events: [],
    galleryImages: []
  });
  
  // Fetch invitation data if ID is provided
  const { isLoading: isDataLoading, error } = useQuery({
    queryKey: ['invitation', id],
    queryFn: () => fetchInvitationById(id || ''),
    enabled: !!id,
    onSuccess: (data) => {
      if (data?.invitation) {
        const formattedData = formatInvitationData(data.invitation);
        
        setInvitationData({
          brideFirstName: formattedData.bride_name?.split(' ')[0] || "Ananya",
          brideName: formattedData.bride_name || "Ananya",
          brideLastName: formattedData.bride_name?.split(' ').slice(1).join(' ') || "Sharma",
          groomFirstName: formattedData.groom_name?.split(' ')[0] || "Arjun",
          groomName: formattedData.groom_name || "Arjun",
          groomLastName: formattedData.groom_name?.split(' ').slice(1).join(' ') || "Patel",
          coupleImageUrl: formattedData.couple_image_url || "",
          weddingDate: formattedData.wedding_date ? new Date(formattedData.wedding_date) : new Date('2025-04-10'),
          weddingTime: formattedData.wedding_time || "11:00 AM",
          weddingVenue: formattedData.wedding_venue || "Divine Gardens",
          weddingAddress: formattedData.wedding_address || "789 Blessing Avenue, New Delhi",
          mapUrl: formattedData.map_url || "https://goo.gl/maps/Ghi12345Jkl",
          contactEmail: formattedData.contact_email || "",
          contactPhone: formattedData.contact_phone || "",
          brideFamily: {
            title: `${formattedData.bride_name?.split(' ')[0] || "Sharma"} Family`,
            members: formattedData.bride_family || []
          },
          groomFamily: {
            title: `${formattedData.groom_name?.split(' ')[0] || "Patel"} Family`,
            members: formattedData.groom_family || []
          },
          events: data.events || [],
          galleryImages: formattedData.gallery_images || []
        });
      }
      
      setIsLoading(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load invitation data",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  });
  
  useEffect(() => {
    // If no ID, just show loading for a bit and then show the default template
    if (!id) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [id]);
  
  const handleOpenRSVP = () => {
    setConfetti(true);
    setTimeout(() => {
      setShowRSVP(true);
      setConfetti(false);
    }, 800);
  };

  const handleAcceptInvitation = () => {
    setConfetti(true);
    setTimeout(() => {
      setShowThankYouMessage(true);
      setConfetti(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full pattern-background">
      {isLoading || isDataLoading ? (
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
                onClick={() => navigate('/')}
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
              onClick={() => navigate('/')}
              className="fixed top-4 left-4 z-30 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeftCircle size={16} className="mr-1" />
              <span className="text-xs">Back</span>
            </button>
          )}
          
          <InvitationHeader 
            brideName={invitationData.brideFirstName}
            groomName={invitationData.groomFirstName}
            coupleImageUrl={invitationData.coupleImageUrl}
          />
          
          <CountdownTimer 
            weddingDate={invitationData.weddingDate} 
            weddingTime={invitationData.weddingTime}
          />
          
          <CoupleSection />
          
          <FamilyDetails 
            brideFamily={invitationData.brideFamily}
            groomFamily={invitationData.groomFamily}
          />
          
          <EventTimeline />
          <PhotoGrid />
          
          <div className="py-10 w-full text-center bg-floral-pattern">
            <div className="relative inline-block">
              {showThankYouMessage ? (
                <div className="glass-card p-6 border border-wedding-gold/30 shadow-gold-glow rounded-lg text-center">
                  <h3 className="text-xl font-playfair text-wedding-maroon mb-3">Thanks for Accepting Our Invitation</h3>
                  <p className="text-gray-600 mb-4">We look forward to celebrating our special day with you!</p>
                  <Badge variant="outline" className="bg-wedding-gold/10 text-wedding-gold animate-pulse-soft">
                    More features coming soon...
                  </Badge>
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
          
          <Footer 
            venueAddress={invitationData.weddingAddress}
            venueMapUrl={invitationData.mapUrl}
            contactPhone={invitationData.contactPhone}
            contactEmail={invitationData.contactEmail}
            brideFirstName={invitationData.brideFirstName}
            groomFirstName={invitationData.groomFirstName}
            weddingDate={invitationData.weddingDate}
          />
          
          <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} />
        </div>
      )}
    </div>
  );
};

export default Invitation;
