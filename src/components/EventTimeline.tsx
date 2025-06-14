
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';

const EventTimeline: React.FC = () => {
  const { weddingData } = useWedding();

  return (
    <section className="w-full py-16 bg-gradient-to-br from-wedding-cream/50 via-white to-wedding-blush/30">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-dancing-script text-3xl sm:text-4xl text-wedding-maroon mb-4">
            Wedding Timeline
          </h2>
          <p className="text-gray-600">Join us for these special celebrations</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-wedding-gold/30"></div>
          
          <div className="space-y-8">
            {weddingData.events.map((event, index) => (
              <div key={event.id} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="glass-card p-6 hover:shadow-lg transition-shadow duration-300">
                    <h3 className="font-playfair text-xl text-wedding-maroon mb-2">
                      {event.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-wedding-gold" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-wedding-gold" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-wedding-gold" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-gray-700 text-sm mt-3 italic">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="relative z-10">
                  <div className="w-4 h-4 bg-wedding-gold rounded-full border-4 border-white shadow-md"></div>
                </div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventTimeline;
