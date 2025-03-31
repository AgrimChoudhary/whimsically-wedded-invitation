import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { ArrowLeftCircle, Heart, User, Volume2, VolumeX, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface InvitationData {
  id: string;
  bride_name: string;
  bride_about: string | null;
  groom_name: string;
  groom_about: string | null;
  couple_story: string | null;
  wedding_date: string;
  wedding_time: string | null;
  wedding_venue: string | null;
  wedding_address: string | null;
  map_url: string | null;
  bride_parents: string | null;
  bride_family: string | null;
  groom_parents: string | null;
  groom_family: string | null;
  rsvp_email: string | null;
  rsvp_phone: string | null;
  custom_message: string | null;
  couple_image_url: string | null;
  gallery_images: string[];
  events: {
    id: string;
    event_name: string;
    event_date: string | null;
    event_time: string | null;
    event_venue: string | null;
    event_address: string | null;
  }[];
}

const CustomInvitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { guestName } = useGuest();
  const { isPlaying, toggleMusic } = useAudio();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    const fetchInvitationData = async () => {
      try {
        // Fetch invitation data
        const { data: invitation, error: invitationError } = await supabase
          .from('wedding_invitations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (invitationError) {
          throw invitationError;
        }
        
        if (!invitation) {
          setError('Invitation not found');
          setIsLoading(false);
          return;
        }
        
        // Fetch events related to this invitation
        const { data: events, error: eventsError } = await supabase
          .from('wedding_events')
          .select('*')
          .eq('invitation_id', id);
        
        if (eventsError) {
          throw eventsError;
        }
        
        // Combine the data and convert gallery_images from Json to string[]
        setInvitationData({
          ...invitation,
          gallery_images: Array.isArray(invitation.gallery_images) 
            ? invitation.gallery_images 
            : [],
          events: events || []
        });
      } catch (error) {
        console.error('Error fetching invitation:', error);
        setError('Failed to load invitation');
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };
    
    fetchInvitationData();
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

  if (error) {
    return (
      <div className="min-h-screen w-full pattern-background flex flex-col items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-playfair text-wedding-maroon mb-4">Invitation Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-wedding-gold text-white">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

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
          
          {invitationData && (
            <>
              <div className="w-full py-8 px-4 text-center bg-floral-pattern">
                <h1 className="font-great-vibes text-4xl sm:text-5xl text-wedding-maroon">
                  {invitationData.bride_name} & {invitationData.groom_name}
                </h1>
                <p className="font-dancing-script text-xl text-wedding-gold mt-2">Wedding Invitation</p>
                <p className="text-sm text-gray-600 mt-4">
                  {new Date(invitationData.wedding_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  {invitationData.wedding_time && ` at ${invitationData.wedding_time}`}
                </p>
              </div>
              
              <CountdownTimer 
                weddingDate={new Date(invitationData.wedding_date)} 
              />
              
              <div className="w-full py-6">
                <div className="max-w-4xl mx-auto px-4">
                  <div className="glass-card p-6 border border-wedding-gold/30">
                    <div className="text-center mb-6">
                      <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-2">Our Story</h2>
                      <p className="text-gray-600">{invitationData.couple_story}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border border-wedding-gold/20 rounded-lg">
                        <h3 className="font-playfair text-xl text-wedding-maroon text-center mb-3">
                          {invitationData.bride_name}
                        </h3>
                        <p className="text-gray-600 text-center">{invitationData.bride_about}</p>
                        <p className="text-sm text-gray-500 mt-4 text-center italic">
                          {invitationData.bride_parents}
                        </p>
                      </div>
                      
                      <div className="p-4 border border-wedding-gold/20 rounded-lg">
                        <h3 className="font-playfair text-xl text-wedding-maroon text-center mb-3">
                          {invitationData.groom_name}
                        </h3>
                        <p className="text-gray-600 text-center">{invitationData.groom_about}</p>
                        <p className="text-sm text-gray-500 mt-4 text-center italic">
                          {invitationData.groom_parents}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {invitationData.events && invitationData.events.length > 0 && (
                <div className="w-full py-6 bg-wedding-cream/20">
                  <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-6">
                      <h2 className="font-dancing-script text-2xl text-wedding-maroon">Wedding Events</h2>
                    </div>
                    
                    <div className="space-y-4">
                      {invitationData.events.map((event) => (
                        <div key={event.id} className="glass-card p-4 border border-wedding-gold/30">
                          <h3 className="font-playfair text-lg text-wedding-maroon">{event.event_name}</h3>
                          {event.event_date && (
                            <p className="text-gray-600">
                              <span className="font-medium">Date:</span> {new Date(event.event_date).toLocaleDateString()}
                            </p>
                          )}
                          {event.event_venue && (
                            <p className="text-gray-600">
                              <span className="font-medium">Venue:</span> {event.event_venue}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="w-full py-8 bg-floral-pattern">
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-4">Wedding Venue</h2>
                  <div className="glass-card p-6 border border-wedding-gold/30">
                    <h3 className="font-playfair text-xl text-wedding-maroon mb-2">{invitationData.wedding_venue}</h3>
                    <p className="text-gray-600 mb-4">{invitationData.wedding_address}</p>
                    
                    {invitationData.map_url && (
                      <div className="mt-4">
                        <a 
                          href={invitationData.map_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-wedding-gold/90 text-white px-4 py-2 rounded-full hover:bg-wedding-gold transition-colors"
                        >
                          <MapPin size={16} />
                          View on Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {(invitationData.rsvp_email || invitationData.rsvp_phone) && (
                <div className="w-full py-8">
                  <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-4">RSVP</h2>
                    <div className="glass-card p-6 border border-wedding-gold/30">
                      <p className="text-gray-600 mb-4">We would be honored by your presence. Please let us know if you can attend.</p>
                      
                      {invitationData.rsvp_email && (
                        <p className="text-gray-600">
                          <span className="font-medium">Email:</span> {invitationData.rsvp_email}
                        </p>
                      )}
                      
                      {invitationData.rsvp_phone && (
                        <p className="text-gray-600">
                          <span className="font-medium">Phone:</span> {invitationData.rsvp_phone}
                        </p>
                      )}
                      
                      <div className="mt-6">
                        <Button
                          onClick={handleAcceptInvitation}
                          className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                          disabled={showThankYouMessage}
                        >
                          {showThankYouMessage ? "Thanks for Accepting!" : "Accept Invitation"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          <Footer />
          
          <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} />
        </div>
      )}
    </div>
  );
};

export default CustomInvitation;
