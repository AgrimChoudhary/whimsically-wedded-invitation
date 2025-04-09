
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GuestContextType {
  guestName: string;
  setGuestName: (name: string) => void;
}

const GuestContext = createContext<GuestContextType>({
  guestName: '',
  setGuestName: () => {},
});

interface GuestProviderProps {
  children: ReactNode;
}

export function GuestProvider({ children }: GuestProviderProps) {
  const [guestName, setGuestName] = useState('');

  return (
    <GuestContext.Provider
      value={{
        guestName,
        setGuestName,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export const useGuest = () => useContext(GuestContext);

export default GuestContext;
