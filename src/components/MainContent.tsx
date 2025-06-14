
import React from 'react';
import InvitationHeader from './InvitationHeader';
import CoupleSection from './CoupleSection';
import EventTimeline from './EventTimeline';
import RomanticJourneySection from './RomanticJourneySection';
import FamilyDetails from './FamilyDetails';
import PhotoGrid from './PhotoGrid';
import CountdownTimer from './CountdownTimer';
import Footer from './Footer';

const MainContent: React.FC = () => {
  const groomFamily = {
    title: "Groom's Family",
    members: [
      {
        name: "Mr. & Mrs. Groom Parents",
        relation: "Parents",
        image: "/placeholder.svg"
      }
    ]
  };

  const brideFamily = {
    title: "Bride's Family", 
    members: [
      {
        name: "Mr. & Mrs. Bride Parents",
        relation: "Parents",
        image: "/placeholder.svg"
      }
    ]
  };

  return (
    <>
      <InvitationHeader />
      <CoupleSection />
      <EventTimeline />
      <RomanticJourneySection />
      <FamilyDetails groomFamily={groomFamily} brideFamily={brideFamily} />
      <PhotoGrid />
      <CountdownTimer />
      <Footer />
    </>
  );
};

export default MainContent;
