
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GuestData {
  id: string;
  name: string;
  mobile: string;
  hasViewed: boolean;
}

interface GuestContextType {
  guestData: GuestData | null;
  setGuestData: (data: GuestData | null) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guestData, setGuestData] = useState<GuestData | null>(null);

  return (
    <GuestContext.Provider value={{ guestData, setGuestData }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};
