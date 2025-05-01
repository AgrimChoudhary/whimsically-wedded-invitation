
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface GuestContextType {
  guestName: string;
  setGuestName: (name: string) => void;
  isLoading: boolean;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guestName, setGuestName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  
  useEffect(() => {
    const fetchGuestInfo = async () => {
      setIsLoading(true);
      
      // Extract guestId from path
      // The format can be either /:guestId or /invitation/:guestId
      const pathParts = location.pathname.split('/').filter(Boolean);
      let guestId: string | null = null;
      
      if (pathParts.length === 1 && pathParts[0] !== 'invitation' && pathParts[0] !== 'guest-management') {
        // Format: /:guestId
        guestId = pathParts[0];
      } else if (pathParts.length === 2 && pathParts[0] === 'invitation') {
        // Format: /invitation/:guestId
        guestId = pathParts[1];
      }
      
      if (guestId) {
        try {
          const { data, error } = await supabase
            .from('guests')
            .select('name')
            .eq('id', guestId)
            .single();
          
          if (error) {
            console.error('Error fetching guest:', error);
            setGuestName('');
          } else if (data) {
            setGuestName(data.name);
          }
        } catch (error) {
          console.error('Error in guest fetch:', error);
          setGuestName('');
        }
      }
      
      setIsLoading(false);
    };
    
    fetchGuestInfo();
  }, [location.pathname]);

  return (
    <GuestContext.Provider value={{ guestName, setGuestName, isLoading }}>
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
