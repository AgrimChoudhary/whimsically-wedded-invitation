import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import InvitationHeader from '@/components/InvitationHeader';
import CoupleSection from '@/components/CoupleSection';
import CountdownTimer from '@/components/CountdownTimer';
import FamilyDetails, { FamilyMember } from '@/components/FamilyDetails';
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
  const [brideFamily, setBrideFamily] = useState<FamilyMember[]>([]);
  const [groomFamily, setGroomFamily] = useState<FamilyMember[]>([]);
  
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
        
        // Process family member data
        const parseBrideFamily = () => {
          if (invitation.bride_family) {
            try {
              const familyData = JSON.parse(invitation.bride_family);
              if (Array.isArray(familyData)) {
                setBrideFamily(familyData);
              }
            } catch (e) {
              console.error('Error parsing bride family data:', e);
            }
          }
        };
        
        const parseGroomFamily = () => {
          if (invitation.groom_family) {
            try {
              const familyData = JSON.parse(invitation.groom_family);
              if (Array.isArray(familyData)) {
                setGroomFamily(familyData);
              }
            } catch (e) {
              console.error('Error parsing groom family data:', e);
            }
          }
        };
        
        parseBrideFamily();
        parseGroomFamily();
        
        // Override with our custom data
        setBrideFamily([
          { 
            name: "श्रीमती गीता देवी & बालकृष्ण जी शर्मा", 
            relation: "माता-पिता (कन्या)",
            image: invitation.bride_family && Array.isArray(JSON.parse(invitation.bride_family)) && JSON.parse(invitation.bride_family).length > 0 
              ? JSON.parse(invitation.bride_family)[0].image 
              : "https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f",
            description: ""
          }
        ]);
        
        setGroomFamily([
          { 
            name: "श्रीमती ललिता देवी & तेजराम शर्मा", 
            relation: "माता-पिता (वर)",
            image: invitation.groom_family && Array.isArray(JSON.parse(invitation.groom_family)) && JSON.parse(invitation.groom_family).length > 0 
              ? JSON.parse(invitation.groom_family)[0].image 
              : "https://images.unsplash.com/photo-1604849329114-a8c9f4e4b926",
            description: ""
          }
        ]);
        
        // Combine the data and convert gallery_images from Json to string[]
        const galleryImages = invitation.gallery_images 
          ? (Array.isArray(invitation.gallery_images) 
              ? invitation.gallery_images.map(img => String(img)) 
              : [])
          : [];
          
        // Set custom invitation data
        setInvitationData({
          ...invitation,
          bride_name: "भावना",
          groom_name: "उमाशंकर",
          wedding_date: "2025-04-29",
          wedding_time: "8:00 PM",
          wedding_venue: "कृष्णा पैलेस",
          wedding_address: "तीन बड़ के पास, करौली",
          map_url: "https://maps.app.goo.gl/yjsSHSkHgyhW54oR6",
          bride_parents: "श्रीमती गीता देवी & बालकृष्ण जी शर्मा",
          groom_parents: "श्रीमती ललिता देवी & तेजराम शर्मा",
          rsvp_phone: "8302710005",
          rsvp_email: null,
          gallery_images: galleryImages,
          events: [
            {
              id: "event-1",
              event_name: "शुभ लग्न व टीका",
              event_date: "2025-04-23",
              event_time: "4:00 PM",
              event_venue: "रॉयल पैलेस",
              event_address: "गंगापुर रोड, पेट्रोल पम्प के पास, वज़ीरपुर"
            },
            {
              id: "event-2",
              event_name: "भात",
              event_date: "2025-04-23",
              event_time: "8:00 PM",
              event_venue: "रॉयल पैलेस",
              event_address: "गंगापुर रोड, पेट्रोल पम्प के पास, वज़ीरपुर"
            },
            {
              id: "event-3",
              event_name: "प्रीतिभोज",
              event_date: "2025-04-24",
              event_time: "12:00 PM",
              event_venue: "निज निवास",
              event_address: "परिता"
            },
            {
              id: "event-4",
              event_name: "हल्दी & मेहंदी",
              event_date: "2025-04-27",
              event_time: "12:00 PM",
              event_venue: "निज निवास",
              event_address: "परिता"
            },
            {
              id: "event-5",
              event_name: "तेल",
              event_date: "2025-04-27",
              event_time: "8:00 PM",
              event_venue: "निज निवास",
              event_address: "परिता"
            },
            {
              id: "event-6",
              event_name: "चाकवास",
              event_date: "2025-04-28",
              event_time: "8:00 PM",
              event_venue: "निज निवास",
              event_address: "परिता"
            },
            {
              id: "event-7",
              event_name: "पाणिग्रहण संस्कार",
              event_date: "2025-04-29",
              event_time: "11:00 PM",
              event_venue: "कृष्णा पैलेस",
              event_address: "तीन बड़ के पास, करौली"
            }
          ]
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

  // Default wedding date - April 29, 2025
  const weddingDate = new Date('2025-04-29T20:00:00');

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
          
          <InvitationHeader 
            brideName="भावना"
            groomName="उमाशंकर"
            coupleImageUrl={invitationData?.couple_image_url || undefined}
          />
          
          <CountdownTimer 
            weddingDate={weddingDate} 
            weddingTime="8:00 PM"
          />
          
          {invitationData && (
            <>
              <div className="w-full py-6">
                <div className="max-w-4xl mx-auto px-4">
                  <div className="glass-card p-6 border border-wedding-gold/30">
                    <div className="text-center mb-6">
                      <h2 className="font-kruti text-2xl text-wedding-maroon mb-2">हमारी कहानी</h2>
                      <p className="text-gray-600">{invitationData.couple_story}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border border-wedding-gold/20 rounded-lg">
                        <h3 className="font-kruti text-xl text-wedding-maroon text-center mb-3">
                          भावना
                        </h3>
                        <p className="text-gray-600 text-center">{invitationData.bride_about}</p>
                        <p className="text-sm text-gray-500 mt-4 text-center italic font-kruti">
                          माता-पिता: {invitationData.bride_parents}
                        </p>
                      </div>
                      
                      <div className="p-4 border border-wedding-gold/20 rounded-lg">
                        <h3 className="font-kruti text-xl text-wedding-maroon text-center mb-3">
                          उमाशंकर
                        </h3>
                        <p className="text-gray-600 text-center">{invitationData.groom_about}</p>
                        <p className="text-sm text-gray-500 mt-4 text-center italic font-kruti">
                          माता-पिता: {invitationData.groom_parents}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <FamilyDetails 
                brideFamily={{
                  title: "कन्या पक्ष",
                  members: brideFamily
                }}
                groomFamily={{
                  title: "वर पक्ष",
                  members: groomFamily
                }}
              />
              
              <EventTimeline />
              
              <div className="w-full py-8 bg-floral-pattern">
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <h2 className="font-kruti text-2xl text-wedding-maroon mb-4">विवाह स्थल</h2>
                  <div className="glass-card p-6 border border-wedding-gold/30">
                    <h3 className="font-kruti text-xl text-wedding-maroon mb-2">{invitationData.wedding_venue}</h3>
                    <p className="text-gray-600 mb-4 font-kruti">{invitationData.wedding_address}</p>
                    
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
              
              {invitationData.rsvp_phone && (
                <div className="w-full py-8">
                  <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="font-kruti text-2xl text-wedding-maroon mb-4">आर एस वी पी</h2>
                    <div className="glass-card p-6 border border-wedding-gold/30">
                      <p className="text-gray-600 mb-4 font-kruti">आपकी उपस्थिति हमारे लिए सम्मान की बात होगी। कृपया हमें बताएं कि क्या आप आ सकते हैं।</p>
                      
                      {invitationData.rsvp_phone && (
                        <div className="text-gray-600">
                          <span className="font-medium">भवेश कौशिक (वर के भाई):</span>{" "}
                          <a href={`tel:+91${invitationData.rsvp_phone}`} className="text-wedding-maroon hover:underline">
                            +91 {invitationData.rsvp_phone}
                          </a>
                        </div>
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
                      
                      {showThankYouMessage && (
                        <div className="mt-4">
                          <p className="text-wedding-maroon font-kruti">निमंत्रण स्वीकार करने के लिए धन्यवाद!</p>
                          <p className="text-gray-600 text-sm">हम आपके साथ अपना विशेष दिन मनाने के लिए तत्पर हैं!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <PhotoGrid />
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
