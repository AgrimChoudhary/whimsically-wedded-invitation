
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGuestContext } from "@/context/GuestContext";
import WelcomeSection from "@/components/WelcomeSection";
import MainContent from "@/components/MainContent";

const Index = () => {
  const { guestId } = useParams();
  const [showWelcome, setShowWelcome] = useState(true);
  const { guestName, setGuestName } = useGuestContext();

  useEffect(() => {
    console.log('Index component mounted, guestId:', guestId);
    
    if (guestId) {
      console.log('Guest ID found in URL, setting guest name and skipping welcome');
      setGuestName(guestId);
      setShowWelcome(false);
    } else if (guestName) {
      console.log('Guest name already exists, skipping welcome');
      setShowWelcome(false);
    }
  }, [guestId, guestName, setGuestName]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeSection />;
  }

  return <MainContent />;
};

export default Index;
