
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Eye, Users, Pencil, Loader2 } from 'lucide-react';
import { FloatingPetals } from '@/components/AnimatedElements';

interface InvitationData {
  id: string;
  bride_first_name: string;
  bride_last_name: string;
  groom_first_name: string;
  groom_last_name: string;
  wedding_date: string;
  created_at: string;
}

const Dashboard = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const [previewGuestId, setPreviewGuestId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInvitation = async () => {
      if (!invitationId) return;
      
      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', invitationId)
          .single();
          
        if (error) throw error;
        
        setInvitation(data);
        
        // Check if there's a default guest for preview
        const { data: guests } = await supabase
          .from('guests')
          .select('id')
          .eq('invitation_id', invitationId)
          .limit(1);
          
        if (guests && guests.length > 0) {
          setPreviewGuestId(guests[0].id);
        } else {
          // Create a default preview guest
          await createPreviewGuest();
        }
      } catch (error) {
        console.error('Error fetching invitation:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch invitation details.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvitation();
  }, [invitationId]);
  
  const createPreviewGuest = async () => {
    if (!invitationId) return;
    
    setIsCreatingGuest(true);
    
    try {
      // Generate a random 5-character ID for the guest
      const guestId = Math.random().toString(36).substring(2, 7);
      
      const { data, error } = await supabase
        .from('guests')
        .insert({
          id: guestId,
          invitation_id: invitationId,
          name: 'Preview Guest',
          mobile: '0000000000',
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setPreviewGuestId(data.id);
    } catch (error) {
      console.error('Error creating preview guest:', error);
    } finally {
      setIsCreatingGuest(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pattern-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto text-wedding-maroon mb-4" />
          <p className="text-wedding-maroon">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!invitation) {
    return (
      <div className="min-h-screen pattern-background flex items-center justify-center">
        <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-wedding-maroon mb-4">Invitation Not Found</h2>
          <p className="mb-4 text-gray-600">The invitation you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pattern-background">
      <FloatingPetals />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-playfair text-wedding-maroon mb-2">
              Wedding Dashboard
            </h1>
            <p className="text-wedding-gold font-dancing-script text-xl sm:text-2xl">
              {invitation.bride_first_name} & {invitation.groom_first_name}
            </p>
            <div className="mt-2 text-gray-600">
              {formatDate(invitation.wedding_date)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col h-full">
              <div className="bg-wedding-cream/50 p-6 rounded-lg shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-wedding-maroon mb-4 flex items-center">
                    <Eye size={20} className="mr-2" /> Preview Invitation
                  </h2>
                  <p className="text-gray-600 mb-4">
                    See how your wedding invitation will look to your guests.
                  </p>
                </div>
                <div className="space-y-4">
                  {isCreatingGuest ? (
                    <Button disabled className="w-full">
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Creating preview...
                    </Button>
                  ) : previewGuestId ? (
                    <div className="space-y-3">
                      <Button 
                        onClick={() => navigate(`/${invitationId}-${previewGuestId}`)}
                        className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                      >
                        Preview Welcome Page
                      </Button>
                      <Button 
                        onClick={() => navigate(`/invitation/${invitationId}-${previewGuestId}`)}
                        className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                      >
                        Preview Invitation Page
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={createPreviewGuest}
                      className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                    >
                      Create Preview
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col h-full">
              <div className="bg-wedding-cream/50 p-6 rounded-lg shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-wedding-maroon mb-4 flex items-center">
                    <Users size={20} className="mr-2" /> Manage Guests
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Add, edit, and manage your guest list. Track RSVPs and send invitations.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate(`/guest-management?invitationId=${invitationId}`)}
                  className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                >
                  Manage Guest List
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-wedding-cream/50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-wedding-maroon mb-4 flex items-center">
              <Pencil size={20} className="mr-2" /> Edit Invitation Details
            </h2>
            <p className="text-gray-600 mb-4">
              This feature is coming soon. Currently, you can manage your guests and preview your invitation.
            </p>
            <Button 
              disabled
              className="w-full bg-gray-300 text-gray-600 cursor-not-allowed"
            >
              Edit Details (Coming Soon)
            </Button>
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-wedding-maroon hover:text-wedding-gold hover:bg-transparent"
            >
              Return to Home Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
