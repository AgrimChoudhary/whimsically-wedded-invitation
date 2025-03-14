
import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 bg-wedding-cream">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="glass-card p-6 border-t-2 border-wedding-gold/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <MapPin size={18} className="text-wedding-gold mr-2" />
                <h3 className="font-playfair text-lg text-wedding-maroon">Venue</h3>
              </div>
              <p className="mt-2 text-gray-700">Divine Gardens</p>
              <p className="text-sm text-gray-600 mb-2">789 Blessing Avenue, Wedding City</p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-wedding-gold underline-grow"
              >
                View on Map <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Phone size={18} className="text-wedding-gold mr-2" />
                <h3 className="font-playfair text-lg text-wedding-maroon">Contact</h3>
              </div>
              <p className="mt-2 text-gray-700">For any inquiries</p>
              <a 
                href="tel:+919876543210" 
                className="text-sm text-wedding-gold underline-grow"
              >
                +91 9876 543 210
              </a>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Mail size={18} className="text-wedding-gold mr-2" />
                <h3 className="font-playfair text-lg text-wedding-maroon">Email</h3>
              </div>
              <p className="mt-2 text-gray-700">Send your wishes</p>
              <a 
                href="mailto:ananya.arjun@wedding.com" 
                className="text-sm text-wedding-gold underline-grow"
              >
                ananya.arjun@wedding.com
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-wedding-gold/20 text-center">
            <p className="text-sm text-gray-600">
              With love, Ananya & Arjun | February 14, 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
