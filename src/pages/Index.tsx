import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useGuest } from '@/context/GuestContext';
import { useWedding } from '@/context/WeddingContext';
import WelcomeForm from '@/components/WelcomeForm';
import { FloatingPetals } from '@/components/AnimatedElements';
import { Heart, Calendar, MapPin, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const { guestData, setGuestData } = useGuest();
  const { weddingData } = useWedding();
  const navigate = useNavigate();
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
          <p className="text-wedding-maroon font-dancing-script text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-background relative overflow-hidden">
      <FloatingPetals />
      
      {/* Admin Navigation */}
      {!guestId && (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/customization')}
            className="bg-white/90 border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
          >
            <Settings size={16} className="mr-1" />
            Customize
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/guest-management')}
            className="bg-white/90 border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
          >
            <Users size={16} className="mr-1" />
            Guests
          </Button>
        </div>
      )}
      
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          {guestData ? (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="relative">
                  <h1 className="font-great-vibes text-4xl sm:text-5xl text-wedding-maroon leading-tight">
                    {weddingData.couple.groomFirstName}
                    <span className="block text-3xl sm:text-4xl text-wedding-gold font-dancing-script mt-2">
                      &
                    </span>
                    {weddingData.couple.brideFirstName}
                  </h1>
                  <div className="absolute -top-3 -right-3 w-6 h-6">
                    <Heart size={24} className="text-wedding-gold/60 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="font-dancing-script text-xl text-wedding-maroon">
                    Welcome, {guestData.name}!
                  </h2>
                  <p className="text-sm text-gray-600">
                    You're invited to our wedding celebration
                  </p>
                </div>
              </div>

              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-wedding-maroon">
                  <Calendar size={18} className="text-wedding-gold" />
                  <span className="font-playfair">
                    {weddingData.mainWedding.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-wedding-maroon">
                  <MapPin size={18} className="text-wedding-gold" />
                  <span className="font-playfair text-sm">
                    {weddingData.mainWedding.venue.name}
                  </span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/invitation')}
                className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white py-3 rounded-full shadow-gold-soft hover:shadow-gold-glow transition-all duration-300"
              >
                <Heart size={18} className="mr-2" />
                View Full Invitation
              </Button>
            </div>
          ) : (
            <WelcomeForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
