
import React from 'react';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';

interface FooterProps {
  venueAddress?: string;
  venueMapUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  brideFirstName?: string;
  groomFirstName?: string;
  weddingDate?: Date;
}

const Footer: React.FC<FooterProps> = ({ 
  venueAddress = "789 Blessing Avenue, New Delhi",
  venueMapUrl = "https://goo.gl/maps/Ghi12345Jkl",
  contactPhone = "+91 98765 43210",
  contactEmail = "ananya.arjun@example.com",
  brideFirstName = "Ananya",
  groomFirstName = "Arjun",
  weddingDate = new Date('2025-04-10')
}) => {
  
  // Format wedding date
  const formattedDate = weddingDate ? weddingDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'April 10, 2025';
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-wedding-cream/30 backdrop-blur-sm border-t border-wedding-gold/20 py-8 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="space-y-3">
            <h3 className="font-playfair text-wedding-maroon text-lg mb-3">Venue</h3>
            <a 
              href={venueMapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center sm:justify-start text-gray-600 hover:text-wedding-maroon transition-colors group"
            >
              <MapPin size={18} className="mr-2 text-wedding-gold/70 group-hover:text-wedding-gold transition-colors" />
              <span className="underline-grow">{venueAddress}</span>
            </a>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-playfair text-wedding-maroon text-lg mb-3">Contact</h3>
            {contactPhone && (
              <a 
                href={`tel:${contactPhone.replace(/\s+/g, '')}`} 
                className="flex items-center justify-center sm:justify-start text-gray-600 hover:text-wedding-maroon transition-colors group"
              >
                <Phone size={18} className="mr-2 text-wedding-gold/70 group-hover:text-wedding-gold transition-colors" />
                <span className="underline-grow">{contactPhone}</span>
              </a>
            )}
            {contactEmail && (
              <a 
                href={`mailto:${contactEmail}`} 
                className="flex items-center justify-center sm:justify-start text-gray-600 hover:text-wedding-maroon transition-colors group"
              >
                <Mail size={18} className="mr-2 text-wedding-gold/70 group-hover:text-wedding-gold transition-colors" />
                <span className="underline-grow">{contactEmail}</span>
              </a>
            )}
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1 space-y-3">
            <h3 className="font-playfair text-wedding-maroon text-lg mb-3">Our Big Day</h3>
            <p className="flex items-center justify-center sm:justify-start text-gray-600">
              <Heart size={18} className="mr-2 text-wedding-blush" fill="#FFDEE2" />
              <span>{brideFirstName} & {groomFirstName} | {formattedDate}</span>
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-wedding-gold/10 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} {brideFirstName} & {groomFirstName}'s Wedding. All rights reserved.
          </p>
          <p className="text-wedding-gold/60 text-xs mt-2 font-dancing-script">
            "Two souls with but a single thought, two hearts that beat as one."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
