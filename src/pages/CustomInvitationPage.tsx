
import React from 'react';
import WeddingInvitationForm from '@/components/WeddingInvitationForm';

const CustomInvitationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-serif text-wedding-maroon text-center mb-8">
          Create Your Wedding Invitation
        </h1>
        <WeddingInvitationForm />
      </div>
    </div>
  );
};

export default CustomInvitationPage;
