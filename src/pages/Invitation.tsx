
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGuestContext } from "@/context/GuestContext";
import InvitationLayout from "@/components/InvitationLayout";

const Invitation = () => {
  const { guestId } = useParams();
  const { setGuestName } = useGuestContext();

  useEffect(() => {
    console.log('Invitation page mounted, guestId:', guestId);
    
    if (guestId) {
      console.log('Setting guest name from URL parameter:', guestId);
      setGuestName(guestId);
    }
  }, [guestId, setGuestName]);

  return <InvitationLayout />;
};

export default Invitation;
