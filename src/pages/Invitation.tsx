
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
import { ArrowLeftCircle, Sparkles, Heart, MapPin, User, Music, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { fetchInvitationById, formatInvitationData } from '@/lib/supabase-helpers';
import WelcomeForm from '@/components/WelcomeForm';
import { useToast } from '@/components/ui/use-toast';

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [activePage, setActivePage] = useState<'welcome' | 'invitation'>('welcome');
  
  const { guestName } = useGuest();
  const { isPlaying, toggleMusic } = useAudio();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { id } = useParams();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadInvitation = async () => {
      setIsLoading(true);
      
      if (id) {
        try {
          const data = await fetchInvitationById(id);
          if (data) {
            const formattedData = formatInvitationData(data.invitation);
            setInvitationData({
              ...formattedData,
              events: data.events.map((event: any) => ({
                id: event.id,
                name: event.event_name,
                date: event.event_date,
                time: event.event_time,
                venue: event.event_venue,
                address: event.event_address
              }))
            });
          }
        } catch (error) {
          console.error("Error loading invitation:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load the invitation. Please try again.",
          });
        }
      }
      
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };
    
    loadInvitation();
  }, [id, toast]);
  
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

  const togglePage = () => {
    setActivePage(prev => prev === 'welcome' ? 'invitation' : 'welcome');
  };

  // Default wedding date - April 10, 2025
  const weddingDate = invitationData?.wedding_date 
    ? new Date(invitationData.wedding_date) 
    : new Date('2025-04-10T11:00:00');

  if (isLoading) {
    return (
      <div className="loading-overlay flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="loading-spinner mb-4 w-16 h-16 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-wedding-gold/10 rounded-full animate-pulse-soft"></div>
        </div>
        <p className="text-wedding-maroon font-dancing-script text-xl mb-1">Preparing your invitation...</p>
        <p className="text-wedding-gold/70 text-sm">The celebration awaits!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pattern-background">
      <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
        <FloatingPetals />
        <Confetti isActive={confetti} />
        
        {/* Page Navigation */}
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 flex gap-2 bg-wedding-cream/80 backdrop-blur-sm py-1 px-3 rounded-full border border-wedding-gold/30 shadow-gold-soft">
          <Button 
            variant="ghost" 
            size="sm"
            className={`px-3 rounded-full ${activePage === 'welcome' ? 'bg-wedding-gold/20 text-wedding-maroon' : 'text-gray-600'}`}
            onClick={() => setActivePage('welcome')}
          >
            Welcome
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={`px-3 rounded-full ${activePage === 'invitation' ? 'bg-wedding-gold/20 text-wedding-maroon' : 'text-gray-600'}`}
            onClick={() => setActivePage('invitation')}
          >
            Invitation
          </Button>
        </div>

        {/* Media Controls */}
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
        
        {/* Welcome Page */}
        {activePage === 'welcome' && (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <WelcomeForm />
            
            {/* Navigation Arrow */}
            <button 
              onClick={togglePage}
              className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 bg-wedding-cream/80 backdrop-blur-sm p-2 rounded-full border border-wedding-gold/30 shadow-gold-soft"
            >
              <ChevronRight size={20} className="text-wedding-maroon" />
            </button>
          </div>
        )}
        
        {/* Invitation Page */}
        {activePage === 'invitation' && (
          <>
            <InvitationHeader 
              brideName={invitationData?.bride_name || "Ananya"}
              groomName={invitationData?.groom_name || "Arjun"}
              coupleImageUrl={invitationData?.couple_image_url}
            />
            
            <CountdownTimer 
              weddingDate={weddingDate} 
              weddingTime={invitationData?.wedding_time || "11:00 AM"}
            />
            
            <CoupleSection />
            
            <FamilyDetails 
              brideFamily={{
                title: `${invitationData?.bride_name || "Bride"}'s Family`,
                members: invitationData?.bride_family?.map((member: any) => ({
                  name: member.name,
                  relation: member.relation,
                  description: member.description,
                  image: member.image || "https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f"
                })) || []
              }}
              groomFamily={{
                title: `${invitationData?.groom_name || "Groom"}'s Family`,
                members: invitationData?.groom_family?.map((member: any) => ({
                  name: member.name,
                  relation: member.relation,
                  description: member.description,
                  image: member.image || "https://images.unsplash.com/photo-1604849329114-a8c9f4e4b926"
                })) || []
              }}
            />
            
            {invitationData?.events && invitationData.events.length > 0 && (
              <EventTimeline events={invitationData.events} />
            )}
            
            {invitationData?.gallery_images && invitationData.gallery_images.length > 0 && (
              <PhotoGrid images={invitationData.gallery_images} />
            )}
            
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
            
            {/* Navigation Arrow */}
            <button 
              onClick={togglePage}
              className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-wedding-cream/80 backdrop-blur-sm p-2 rounded-full border border-wedding-gold/30 shadow-gold-soft"
            >
              <ChevronLeft size={20} className="text-wedding-maroon" />
            </button>
          </>
        )}
        
        <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} />
      </div>
    </div>
  );
};

export default Invitation;
