
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { MapPin, Phone } from 'lucide-react';
import { useAudio } from "@/context/AudioContext";
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  const { isPlaying, toggleMusic } = useAudio();
  
  return (
    <footer className="w-full py-8 mt-auto border-t border-wedding-gold/10 bg-wedding-cream/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Venue Section */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-2 text-wedding-gold">
              <MapPin size={20} className="mr-2" />
              <h3 className="text-lg md:text-xl font-medium text-wedding-maroon">Venue</h3>
            </div>
            <p className="text-base font-medium text-gray-700">Krishna Palace</p>
            <p className="text-sm text-gray-600 mb-2">Near Teen Bad, Karauli</p>
            <a 
              href="https://maps.app.goo.gl/jU8zkCVQ98jZfSe97" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-wedding-gold hover:text-wedding-deep-gold transition-colors flex items-center"
            >
              View on Map
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
          
          {/* Contact Section */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-2 text-wedding-gold">
              <Phone size={20} className="mr-2" />
              <h3 className="text-lg md:text-xl font-medium text-wedding-maroon">Contact</h3>
            </div>
            <p className="text-base font-medium text-gray-700">Bhavesh Kaushik (Groom's Brother)</p>
            <a 
              href="tel:+918302710005" 
              className="text-wedding-gold hover:text-wedding-deep-gold transition-colors"
            >
              +91 8302 710 005
            </a>
          </div>
        </div>
        
        <div className="border-t border-wedding-gold/10 pt-6 mt-6">
          {/* Utsavy Promotion */}
          <div className="flex flex-col items-center text-center mb-4">
            <p className="text-lg font-dancing-script text-wedding-maroon mb-1">
              Made with <span className="text-red-500">❤</span> by UTSAVY
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Want a beautiful digital invitation like this for your special day?
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <span className="text-wedding-maroon">Contact: Agrim Choudhary</span>
              <a 
                href="tel:+919549461861" 
                className="text-wedding-gold hover:text-wedding-deep-gold transition-colors"
              >
                +91 9549 461 861
              </a>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 font-dancing-script text-lg">
              With love, Umashankar &amp; Bhavana | May 15, 2025
            </p>
          </div>
        </div>
      </div>
      
      {/* Sound toggle button in fixed position */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button 
          onClick={toggleMusic}
          variant="outline"
          size="icon"
          className="rounded-full bg-wedding-cream/80 backdrop-blur-sm border-wedding-gold/30 hover:bg-wedding-cream shadow-gold-soft"
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          {isPlaying ? (
            <Volume2 size={18} className="text-wedding-maroon" />
          ) : (
            <VolumeX size={18} className="text-wedding-maroon" />
          )}
        </Button>
      </div>
      
      {/* Add padding at the bottom for mobile to account for fixed navigation */}
      {isMobile && <div className="h-16"></div>}
    </footer>
  );
};

export default Footer;
