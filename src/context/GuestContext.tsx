
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface GuestContextType {
  guestName: string;
  setGuestName: (name: string) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guestName, setGuestName] = useState<string>('');

  return (
    <GuestContext.Provider value={{ guestName, setGuestName }}>
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
