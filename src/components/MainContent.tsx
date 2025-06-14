
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
  return (
    <>
      <InvitationHeader />
      <CoupleSection />
      <EventTimeline />
      <RomanticJourneySection />
      <FamilyDetails />
      <PhotoGrid />
      <CountdownTimer />
      <Footer />
    </>
  );
};

export default MainContent;
