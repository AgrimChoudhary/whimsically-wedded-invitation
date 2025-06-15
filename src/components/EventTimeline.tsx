
import React from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';

const EventTimeline = () => {
  const { weddingData } = useWedding();

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-wedding-cream via-white to-wedding-cream">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-great-vibes text-4xl md:text-5xl text-wedding-maroon mb-4">
            Celebration Timeline
          </h2>
          <div className="w-24 h-[2px] bg-wedding-gold mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us as we celebrate our love through multiple beautiful ceremonies
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-wedding-gold via-wedding-blush to-wedding-gold"></div>
          
          <div className="space-y-12">
            {weddingData.events.map((event, index) => (
              <div key={event.id} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-wedding-gold rounded-full border-4 border-white shadow-lg z-10"></div>
                
                {/* Event card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="relative luxury-frame p-6 rounded-lg shadow-gold-soft hover:shadow-gold-glow transition-all duration-500 group cursor-pointer">
                    {/* Luxury border effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-wedding-gold/20 via-transparent to-wedding-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Inner glow effect */}
                    <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-white/50 to-white/80 backdrop-blur-sm"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="font-playfair text-xl font-semibold text-wedding-maroon mb-3 group-hover:text-wedding-gold transition-colors duration-300">
                        {event.name}
                      </h3>
                      
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2 group-hover:text-wedding-maroon transition-colors duration-300">
                          {index % 2 === 0 ? (
                            <>
                              <span className="text-sm">{event.date}</span>
                              <Calendar size={14} className="text-wedding-gold group-hover:animate-pulse" />
                            </>
                          ) : (
                            <>
                              <Calendar size={14} className="text-wedding-gold group-hover:animate-pulse" />
                              <span className="text-sm">{event.date}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 group-hover:text-wedding-maroon transition-colors duration-300">
                          {index % 2 === 0 ? (
                            <>
                              <span className="text-sm">{event.time}</span>
                              <Clock size={14} className="text-wedding-gold group-hover:animate-pulse" />
                            </>
                          ) : (
                            <>
                              <Clock size={14} className="text-wedding-gold group-hover:animate-pulse" />
                              <span className="text-sm">{event.time}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 group-hover:text-wedding-maroon transition-colors duration-300">
                          {index % 2 === 0 ? (
                            <>
                              <span className="text-sm">{event.venue}</span>
                              <MapPin size={14} className="text-wedding-gold group-hover:animate-pulse" />
                            </>
                          ) : (
                            <>
                              <MapPin size={14} className="text-wedding-gold group-hover:animate-pulse" />
                              <span className="text-sm">{event.venue}</span>
                            </>
                          )}
                        </div>
                        
                        {event.address && (
                          <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-600 transition-colors duration-300">
                            {event.address}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-wedding-gold/30 group-hover:border-wedding-gold transition-colors duration-300"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-wedding-gold/30 group-hover:border-wedding-gold transition-colors duration-300"></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-wedding-gold/30 group-hover:border-wedding-gold transition-colors duration-300"></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-wedding-gold/30 group-hover:border-wedding-gold transition-colors duration-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventTimeline;
