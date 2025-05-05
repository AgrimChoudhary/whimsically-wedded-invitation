import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { MapPin, Phone, Heart } from 'lucide-react';
import { useAudio } from "@/context/AudioContext";
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  const { isPlaying, toggleMusic } = useAudio();
  
  return (
    <footer className="w-full py-10 mt-auto bg-gradient-to-b from-wedding-cream/10 to-wedding-cream/40 backdrop-blur-sm border-t border-wedding-gold/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
      <div className="absolute -left-4 top-10 opacity-10 rotate-12">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="#D4AF37" />
        </svg>
      </div>
      <div className="absolute -right-4 top-20 opacity-10 -rotate-12">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="#D4AF37" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Venue Card */}
          <div className="glass-card hover:shadow-gold-soft transition-all duration-300 transform hover:scale-[1.02] overflow-hidden rounded-xl">
            <div className="p-5 relative">
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-wedding-gold/30 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-wedding-gold/30 rounded-bl-xl"></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-wedding-cream/50 flex items-center justify-center mb-3 border border-wedding-gold/30 shadow-gold-soft">
                  <MapPin size={24} className="text-wedding-maroon" />
                </div>
                <h3 className="text-xl font-playfair text-wedding-maroon mb-2">Venue</h3>
                <p className="text-base font-medium text-gray-700 mb-1">Suryagarh Palace</p>
                <p className="text-sm text-gray-600 mb-3">near Kahala Phata, Sam Road, Jaisalmer, Rajasthan</p>
                
                <a 
                  href="https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-wedding-gold/10 hover:bg-wedding-gold/20 text-wedding-maroon border border-wedding-gold/30 transition-all duration-300 text-sm font-medium"
                >
                  View on Map
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Card */}
          <div className="glass-card hover:shadow-gold-soft transition-all duration-300 transform hover:scale-[1.02] overflow-hidden rounded-xl">
            <div className="p-5 relative">
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-wedding-gold/30 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-wedding-gold/30 rounded-bl-xl"></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-wedding-cream/50 flex items-center justify-center mb-3 border border-wedding-gold/30 shadow-gold-soft">
                  <Phone size={24} className="text-wedding-maroon" />
                </div>
                <h3 className="text-xl font-playfair text-wedding-maroon mb-2">Contact</h3>
                <p className="text-base font-medium text-gray-700 mb-1">Sidharth Malhotra</p>
                <p className="text-sm text-gray-600 mb-3">Groom</p>
                
                <a 
                  href="tel:+919876543210" 
                  className="inline-flex items-center px-4 py-2 rounded-full bg-wedding-gold/10 hover:bg-wedding-gold/20 text-wedding-maroon border border-wedding-gold/30 transition-all duration-300 text-sm font-medium"
                >
                  <Phone size={14} className="mr-1" />
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>
          
          {/* Utsavy Promotion Card */}
          <div className="glass-card hover:shadow-gold-soft transition-all duration-300 transform hover:scale-[1.02] overflow-hidden rounded-xl md:col-span-2 lg:col-span-1">
            <div className="p-5 relative">
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-wedding-gold/30 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-wedding-gold/30 rounded-bl-xl"></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-wedding-cream/50 flex items-center justify-center mb-3 border border-wedding-gold/30 shadow-gold-soft">
                  <Heart size={24} className="text-wedding-maroon" fill="#FFDEE2" />
                </div>
                <h3 className="text-xl font-playfair text-wedding-maroon mb-2">UTSAVY</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Want a beautiful digital invitation like this for your special day?
                </p>
                
                <div className="flex flex-col items-center">
                  <p className="text-base font-medium text-gray-700 mb-1">Agrim Choudhary</p>
                  <a 
                    href="tel:+919549461861" 
                    className="inline-flex items-center px-4 py-2 rounded-full bg-wedding-gold/10 hover:bg-wedding-gold/20 text-wedding-maroon border border-wedding-gold/30 transition-all duration-300 text-sm font-medium"
                  >
                    <Phone size={14} className="mr-1" />
                    +91 9549 461 861
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center relative">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent mb-6"></div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <div className="w-2 h-2 rounded-full bg-wedding-gold/40 animate-pulse"></div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
          
          <p className="text-lg font-dancing-script text-wedding-maroon mb-1">
            Made with <span className="text-red-500">❤</span> by UTSAVY
          </p>
          
          <p className="text-sm text-gray-500 font-dancing-script text-lg mt-2">
            With love, Umashankar &amp; Bhavana | May 15, 2025
          </p>
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
