
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface GuestContextType {
  guestName: string;
  setGuestName: (name: string) => void;
  clearGuestName: () => void;
}

const GuestContext = createContext<GuestContextType>({
  guestName: '',
  setGuestName: () => {},
  clearGuestName: () => {},
});

interface GuestProviderProps {
  children: ReactNode;
}

export function GuestProvider({ children }: GuestProviderProps) {
  const [guestName, setGuestName] = useState('');
  const [searchParams] = useSearchParams();

  // Check for guest parameter in URL when the component mounts
  useEffect(() => {
    const guestParam = searchParams.get('guest');
    if (guestParam) {
      setGuestName(decodeURIComponent(guestParam));
    }
  }, [searchParams]);

  const clearGuestName = () => {
    setGuestName('');
  };

  return (
    <GuestContext.Provider
      value={{
        guestName,
        setGuestName,
        clearGuestName,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export const useGuest = () => useContext(GuestContext);

export default GuestContext;
