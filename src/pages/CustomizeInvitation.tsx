
import React from 'react';
import CustomizeInvitationForm from '@/components/CustomizeInvitationForm';
import { FloatingPetals } from '@/components/AnimatedElements';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomizeInvitation = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen pattern-background py-8 sm:py-12">
      <FloatingPetals />
      <div className="container mx-auto px-4 relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Home</span>
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-great-vibes text-wedding-maroon mb-2">
            Create Your Invitation
          </h1>
          <p className="text-wedding-gold font-dancing-script text-xl">
            Fill in your details to create a beautiful wedding invitation
          </p>
        </div>
        
        <CustomizeInvitationForm />
        
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>Create a stunning digital invitation for your special day</p>
          <p className="mt-1">Powered by Utsavy</p>
        </div>
      </div>
    </div>
  );
};

export default CustomizeInvitation;
