
import React from 'react';
import { Helmet } from 'react-helmet';
import WeddingInvitationForm from '@/components/WeddingInvitationForm';

const CustomizeForm = () => {
  return (
    <div className="min-h-screen bg-wedding-cream/50 pattern-background py-6 md:py-12">
      <Helmet>
        <title>Create Your Wedding Invitation</title>
      </Helmet>

      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h1 className="font-great-vibes text-4xl sm:text-5xl text-wedding-maroon mb-4">
            Create Your Invitation
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Design a beautiful digital wedding invitation by filling out the form below.
            Customize all aspects of your invitation and share it with your loved ones.
          </p>
        </div>
        
        <WeddingInvitationForm />
      </div>
    </div>
  );
};

export default CustomizeForm;
