
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';

const PhotoGrid: React.FC = () => {
  const { weddingData } = useWedding();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const openModal = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <section className="w-full py-16 bg-white">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-dancing-script text-3xl sm:text-4xl text-wedding-maroon mb-4">
            Our Memories
          </h2>
          <p className="text-gray-600">Capturing the beautiful moments of our journey</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {weddingData.photoGallery.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => openModal(photo.url)}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <h3 className="font-medium text-sm mb-1">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-xs opacity-90">{photo.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedPhoto}
              alt="Wedding Photo"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoGrid;
