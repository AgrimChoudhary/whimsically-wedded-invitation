import React from 'react';
import { Heart } from 'lucide-react';

interface InvitationHeaderProps {
  groomName: string;
  brideName: string;
}

const InvitationHeader: React.FC<InvitationHeaderProps> = ({ groomName, brideName }) => {
  return (
    <header className="relative text-center py-10 md:py-16 bg-cover bg-center bg-no-repeat bg-blend-overlay bg-black/30" style={{ backgroundImage: "url('/lovable-uploads/7f492c44-762e-4c64-86d8-d52fc38e8e39.jpg')" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10"></div>
      <div className="relative z-10 container mx-auto px-4">
        <p className="font-great-vibes text-2xl md:text-3xl text-wedding-gold drop-shadow-md mb-2 md:mb-3">
          Together with their families
        </p>
        <h1 className="font-playfair-display text-4xl md:text-6xl text-white font-bold tracking-tight leading-tight name-highlight">
          {brideName}
          <span className="block text-3xl md:text-4xl font-great-vibes text-wedding-gold my-2 md:my-3">&</span>
          {groomName}
        </h1>
        <div className="w-20 h-px bg-wedding-gold/50 mx-auto my-4 md:my-6"></div>
        <p className="font-great-vibes text-xl md:text-2xl text-wedding-gold drop-shadow-md mb-1">
          Joyfully invite you to celebrate their wedding
        </p>
        <div className="flex justify-center items-center mt-3 md:mt-4">
          <Heart className="w-5 h-5 md:w-6 md:h-6 text-wedding-gold animate-pulse-slow" />
        </div>
      </div>
    </header>
  );
};

export default InvitationHeader;
