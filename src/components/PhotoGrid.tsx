
import React, { useState } from 'react';
import { X, Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoGalleryItem } from '@/types/wedding';

interface PhotoGridProps {
  title: string;
  photos: PhotoGalleryItem[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ title, photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoGalleryItem | null>(null);

  return (
    <>
      <section className="py-16 px-4 bg-gradient-to-br from-wedding-blush/10 via-white to-wedding-cream/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-great-vibes text-4xl md:text-5xl text-wedding-maroon mb-4">
              {title}
            </h2>
            <div className="w-24 h-[2px] bg-wedding-gold mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Beautiful moments captured during our journey of love
            </p>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No photos available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer aspect-square"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white">
                      <Heart size={24} className="mx-auto mb-2" />
                      <p className="text-sm font-medium px-2">{photo.title}</p>
                    </div>
                  </div>
                  
                  {/* Photo number */}
                  <div className="absolute top-2 left-2 bg-wedding-gold/80 text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:text-wedding-gold z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </Button>
            
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold mb-2">
                {selectedPhoto.title}
              </h3>
              <p className="text-white/80 text-sm mb-4">
                {selectedPhoto.description}
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedPhoto.url;
                    link.download = selectedPhoto.title;
                    link.click();
                  }}
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGrid;
