
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useGuest } from '@/context/GuestContext';
import { FloatingPetals } from '@/components/AnimatedElements';
import InvitationHeader from '@/components/InvitationHeader';
import CoupleSection from '@/components/CoupleSection';
import CountdownTimer from '@/components/CountdownTimer';
import EventTimeline from '@/components/EventTimeline';
import FamilyDetails from '@/components/FamilyDetails';
import PhotoGrid from '@/components/PhotoGrid';
import RSVPModal from '@/components/RSVPModal';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, MapPin, Phone } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';

const Invitation: React.FC = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const { guestData, setGuestData } = useGuest();
  const { weddingData } = useWedding();
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuestData = async () => {
      if (guestId) {
        setIsLoading(true);
        try {
          const { data: guest, error } = await supabase
            .from('guests')
            .select('*')
            .eq('id', guestId)
            .single();

          if (error) {
            console.error('Error fetching guest:', error);
          } else if (guest) {
            setGuestData({
              id: guest.id,
              name: guest.name,
              mobile: guest.mobile || '',
              hasViewed: guest.status === 'viewed' || guest.status === 'accepted' || guest.status === 'declined'
            });

            if (guest.status !== 'viewed' && guest.status !== 'accepted' && guest.status !== 'declined') {
              await supabase
                .from('guests')
                .update({ status: 'viewed' })
                .eq('id', guestId);
            }
          }
        } catch (error) {
          console.error('Error in fetchGuestData:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchGuestData();
  }, [guestId, setGuestData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-cream via-wedding-blush/20 to-wedding-cream">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-wedding-maroon font-dancing-script text-xl">Loading your invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-background overflow-hidden">
      <FloatingPetals />
      
      <div className="relative z-10">
        <InvitationHeader />
        <CoupleSection />
        
        <section className="w-full py-8 bg-gradient-to-r from-wedding-cream/30 via-white/40 to-wedding-cream/30">
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-maroon mb-2">
                दिल से दिल तक
              </h2>
              <p className="text-sm text-gray-600">From Heart to Heart</p>
            </div>
            
            <div className="glass-card text-center p-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light">
                {weddingData.customMessage || `We are delighted to invite you to celebrate the union of ${weddingData.couple.groomFirstName} and ${weddingData.couple.brideFirstName}. Your presence would make our special day complete as we begin this beautiful journey together with the blessings of our families and friends.`}
              </p>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => setIsRSVPOpen(true)}
                  className="bg-wedding-gold hover:bg-wedding-deep-gold text-white px-8 py-3 rounded-full shadow-gold-soft hover:shadow-gold-glow transition-all duration-300"
                >
                  <Heart size={18} className="mr-2" />
                  RSVP Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        <CountdownTimer />
        <EventTimeline />
        <FamilyDetails />
        <PhotoGrid />
        
        <section className="w-full py-12 bg-gradient-to-br from-wedding-cream via-wedding-blush/10 to-wedding-cream">
          <div className="w-full max-w-4xl mx-auto px-4 text-center">
            <div className="glass-card p-8">
              <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-maroon mb-6">
                Wedding Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Calendar size={24} className="text-wedding-gold" />
                  </div>
                  <h3 className="font-playfair text-lg text-wedding-maroon mb-2">Date & Time</h3>
                  <p className="text-gray-600">
                    {weddingData.mainWedding.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-600">{weddingData.mainWedding.time}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <MapPin size={24} className="text-wedding-gold" />
                  </div>
                  <h3 className="font-playfair text-lg text-wedding-maroon mb-2">Venue</h3>
                  <p className="text-gray-600">{weddingData.mainWedding.venue.name}</p>
                  <p className="text-gray-600 text-sm">{weddingData.mainWedding.venue.address}</p>
                  {weddingData.mainWedding.venue.mapLink && (
                    <a 
                      href={weddingData.mainWedding.venue.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-wedding-gold hover:text-wedding-deep-gold text-sm mt-2 inline-block"
                    >
                      View on Map
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      
      <RSVPModal 
        isOpen={isRSVPOpen} 
        onClose={() => setIsRSVPOpen(false)} 
      />
    </div>
  );
};

export default Invitation;
