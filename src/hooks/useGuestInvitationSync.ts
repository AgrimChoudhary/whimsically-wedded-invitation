
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { normalizePhoneNumber } from '@/utils/phoneUtils';

export const useGuestInvitationSync = () => {
  const { user, userPhone } = useAuth();

  useEffect(() => {
    if (!user || !userPhone) return;

    const syncGuestInvitations = async () => {
      try {
        const normalizedPhone = normalizePhoneNumber(userPhone);
        
        // Find all invitations where this user's phone number exists as a guest
        const { data: matchingGuests, error: guestError } = await supabase
          .from('guests')
          .select(`
            id,
            name,
            mobile,
            wedding_invitations (
              id,
              title,
              wedding_date,
              bride_name,
              groom_name
            )
          `)
          .eq('mobile', normalizedPhone);

        if (guestError) {
          console.error('Error fetching guest matches:', guestError);
          return;
        }

        if (!matchingGuests || matchingGuests.length === 0) {
          return;
        }

        // Insert or update user_guest_invitations for each match
        for (const guest of matchingGuests) {
          if (guest.wedding_invitations) {
            const invitation = guest.wedding_invitations as any;
            
            // Check if this invitation is already linked
            const { data: existingLink } = await supabase
              .from('user_guest_invitations')
              .select('id')
              .eq('user_id', user.id)
              .eq('invitation_id', invitation.id)
              .eq('guest_id', guest.id)
              .single();

            if (!existingLink) {
              // Create new link
              const { error: insertError } = await supabase
                .from('user_guest_invitations')
                .insert({
                  user_id: user.id,
                  invitation_id: invitation.id,
                  guest_id: guest.id,
                  guest_name: guest.name,
                  invitation_title: invitation.title || 'Wedding Invitation',
                  hosts_names: `${invitation.bride_name || 'Bride'} & ${invitation.groom_name || 'Groom'}`,
                  invitation_date: invitation.wedding_date,
                  status: 'pending'
                });

              if (insertError) {
                console.error('Error linking guest invitation:', insertError);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error syncing guest invitations:', error);
      }
    };

    // Run sync when user logs in
    syncGuestInvitations();
  }, [user, userPhone]);
};
