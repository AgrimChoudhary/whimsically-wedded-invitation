
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MultiPagePreviewProps {
  templateId: string;
  templateName: string;
  onSelect?: () => void;
}

const MultiPagePreview = ({ templateId, templateName, onSelect }: MultiPagePreviewProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Default preview images for the wedding template
  const pages = [
    {
      title: "Welcome Page",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop",
      description: "Elegant welcome screen with guest name animation"
    },
    {
      title: "Invitation Page", 
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=600&fit=crop",
      description: "Complete invitation with countdown, details, and RSVP"
    }
  ];

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <div className="relative">
      <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden rounded-lg">
        <img 
          src={pages[currentPage].image}
          alt={`${templateName} - ${pages[currentPage].title}`}
          className="w-full h-full object-cover"
        />
        
        {/* Page navigation */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-between px-2 opacity-0 hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg"
            onClick={prevPage}
          >
            <ChevronLeft size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg"
            onClick={nextPage}
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Page indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {pages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>

        {/* Page title overlay */}
        <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {pages[currentPage].title}
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-600">{pages[currentPage].description}</p>
        <p className="text-xs text-gray-500 mt-1">Page {currentPage + 1} of {pages.length}</p>
      </div>
    </div>
  );
};

export default MultiPagePreview;
