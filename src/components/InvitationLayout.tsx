
import React from 'react';
import InvitationHeader from './InvitationHeader';
import CoupleSection from './CoupleSection';
import EventTimeline from './EventTimeline';
import RomanticJourneySection from './RomanticJourneySection';
import FamilyDetails from './FamilyDetails';
import PhotoGrid from './PhotoGrid';
import CountdownTimer from './CountdownTimer';
import Footer from './Footer';

const InvitationLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <InvitationHeader />
      <CoupleSection />
      <EventTimeline />
      <RomanticJourneySection />
      <FamilyDetails />
      <PhotoGrid />
      <CountdownTimer />
      <Footer />
    </div>
  );
};

export default InvitationLayout;
