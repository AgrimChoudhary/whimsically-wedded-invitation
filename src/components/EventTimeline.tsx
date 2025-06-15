
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
                  <div className="glass-card p-6 rounded-lg shadow-gold-soft border border-wedding-gold/20 hover:shadow-gold-glow transition-all duration-300">
                    <h3 className="font-playfair text-xl font-semibold text-wedding-maroon mb-3">
                      {event.name}
                    </h3>
                    
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        {index % 2 === 0 ? (
                          <>
                            <span className="text-sm">{event.date}</span>
                            <Calendar size={14} className="text-wedding-gold" />
                          </>
                        ) : (
                          <>
                            <Calendar size={14} className="text-wedding-gold" />
                            <span className="text-sm">{event.date}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {index % 2 === 0 ? (
                          <>
                            <span className="text-sm">{event.time}</span>
                            <Clock size={14} className="text-wedding-gold" />
                          </>
                        ) : (
                          <>
                            <Clock size={14} className="text-wedding-gold" />
                            <span className="text-sm">{event.time}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {index % 2 === 0 ? (
                          <>
                            <span className="text-sm">{event.venue}</span>
                            <MapPin size={14} className="text-wedding-gold" />
                          </>
                        ) : (
                          <>
                            <MapPin size={14} className="text-wedding-gold" />
                            <span className="text-sm">{event.venue}</span>
                          </>
                        )}
                      </div>
                      
                      {event.address && (
                        <p className="text-xs text-gray-500 mt-2">
                          {event.address}
                        </p>
                      )}
                    </div>
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
