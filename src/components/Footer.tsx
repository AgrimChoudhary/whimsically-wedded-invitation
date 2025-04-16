
import React from 'react';
import { MapPin, Phone, ExternalLink } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 bg-wedding-cream">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="glass-card p-6 border-t-2 border-wedding-gold/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <MapPin size={18} className="text-wedding-gold mr-2" />
                <h3 className="font-kruti text-lg text-wedding-maroon">विवाह स्थल</h3>
              </div>
              <p className="mt-2 text-gray-700 font-kruti">कृष्णा पैलेस</p>
              <p className="text-sm text-gray-600 mb-2 font-kruti">तीन बड़ के पास, करौली</p>
              <a 
                href="https://maps.app.goo.gl/yjsSHSkHgyhW54oR6" 
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
                <h3 className="font-kruti text-lg text-wedding-maroon">संपर्क</h3>
              </div>
              <p className="mt-2 text-gray-700">भावेश (वर के भाई)</p>
              <a 
                href="tel:+918302710005" 
                className="text-sm text-wedding-gold underline-grow"
              >
                +91 8302 710 005
              </a>
            </div>
          </div>
          
          <Separator className="my-6 bg-wedding-gold/20" />
          
          <div className="text-center">
            <h4 className="font-great-vibes text-xl text-wedding-maroon mb-1">Made with ❤️ by UTSAVY</h4>
            <p className="text-sm text-gray-600">
              Want a beautiful digital invitation like this for your special day?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <p className="text-sm font-medium text-gray-700">Contact: Agrim Choudhary</p>
              <a 
                href="tel:+919549461861" 
                className="text-sm text-wedding-gold underline-grow ml-1"
              >
                +91 9549 461 861
              </a>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-wedding-gold/20 text-center">
            <p className="text-xs text-gray-500">
              With love, उमाशंकर & भावना | April 29, 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
