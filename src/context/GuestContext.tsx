import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GuestContextType {
  guestName: string;
  setGuestName: (name: string) => void;
  guestId: string | null;
  isLoading: boolean;
  guestStatus: string | null;
  hasAccepted: boolean;
  updateGuestStatus: (status: 'viewed' | 'accepted' | 'declined') => Promise<void>;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guestName, setGuestName] = useState<string>('');
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestStatus, setGuestStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  
  useEffect(() => {
    const fetchGuestInfo = async () => {
      setIsLoading(true);
      
      // Extract guestId from path
      // The format can be either /:guestId or /invitation/:guestId
      const pathParts = location.pathname.split('/').filter(Boolean);
      let currentGuestId: string | null = null;
      
      if (pathParts.length === 1 && pathParts[0] !== 'invitation' && pathParts[0] !== 'guest-management') {
        // Format: /:guestId
        currentGuestId = pathParts[0];
      } else if (pathParts.length === 2 && pathParts[0] === 'invitation') {
        // Format: /invitation/:guestId
        currentGuestId = pathParts[1];
      }
      
      if (currentGuestId) {
        try {
          const { data, error } = await supabase
            .from('guests')
            .select('name, status')
            .eq('id', currentGuestId)
            .single();
          
          if (error) {
            console.error('Error fetching guest:', error);
            setGuestName('');
            setGuestStatus(null);
          } else if (data) {
            setGuestName(data.name);
            setGuestId(currentGuestId);
            setGuestStatus(data.status);
            
            // Update status to 'viewed' when the guest opens the invitation
            if ((location.pathname.includes('invitation') || !location.pathname.includes('guest-management')) && data.status !== 'accepted' && data.status !== 'declined') {
              updateGuestStatus('viewed');
            }
          }
        } catch (error) {
          console.error('Error in guest fetch:', error);
          setGuestName('');
          setGuestStatus(null);
        }
      }
      
      setIsLoading(false);
    };
    
    fetchGuestInfo();
  }, [location.pathname]);

  const updateGuestStatus = async (status: 'viewed' | 'accepted' | 'declined') => {
    if (!guestId) return;
    
    try {
      const { error } = await supabase
        .from('guests')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', guestId);
      
      if (error) {
        console.error(`Error updating guest status to ${status}:`, error);
      } else {
        setGuestStatus(status);
      }
    } catch (error) {
      console.error(`Error updating guest status to ${status}:`, error);
    }
  };

  return (
    <GuestContext.Provider value={{ 
      guestName, 
      setGuestName, 
      guestId, 
      isLoading, 
      guestStatus,
      hasAccepted: guestStatus === 'accepted',
      updateGuestStatus 
    }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = (): GuestContextType => {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};
