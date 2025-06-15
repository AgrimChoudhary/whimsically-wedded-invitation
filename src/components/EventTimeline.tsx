
import React from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';

const EventTimeline = () => {
  const { weddingData } = useWedding();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-wedding-cream via-white to-wedding-blush/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-wedding-gold/5 rounded-full blur-3xl animate-floating"></div>
        <div className="absolute bottom-20 right-16 w-40 h-40 bg-wedding-blush/10 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-wedding-gold/8 rounded-full blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="relative inline-block mb-6">
            <h2 className="font-great-vibes text-5xl md:text-7xl text-wedding-maroon mb-4 relative z-10">
              Celebration Timeline
            </h2>
            <div className="absolute inset-0 font-great-vibes text-5xl md:text-7xl text-wedding-gold/20 blur-sm transform translate-x-1 translate-y-1">
              Celebration Timeline
            </div>
          </div>
          
          <div className="relative mb-6">
            <div className="w-32 h-[3px] bg-gradient-to-r from-transparent via-wedding-gold to-transparent mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-wedding-gold rounded-full shadow-lg"></div>
          </div>
          
          <p className="text-gray-600 max-w-2xl mx-auto font-playfair text-lg leading-relaxed">
            Join us as we celebrate our love through multiple beautiful ceremonies
          </p>
        </div>

        <div className="relative">
          {/* Enhanced timeline line with gradient and glow */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-wedding-gold via-wedding-blush to-wedding-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"></div>
          
          <div className="space-y-16">
            {weddingData.events.map((event, index) => (
              <div 
                key={event.id} 
                className={`relative flex items-center group ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Enhanced timeline dot with pulse animation */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-wedding-gold to-wedding-deep-gold rounded-full border-4 border-white shadow-lg z-10 group-hover:scale-125 transition-all duration-500">
                  <div className="absolute inset-0 bg-wedding-gold rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-white rounded-full opacity-30"></div>
                </div>
                
                {/* Enhanced event card with luxury design */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'} animate-fade-in-up`}>
                  <div className="relative luxury-event-card p-8 rounded-2xl transition-all duration-700 group cursor-pointer transform hover:scale-105 hover:-translate-y-2">
                    {/* Multiple layer backgrounds for depth */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/90 via-white/95 to-wedding-cream/80 backdrop-blur-xl shadow-xl"></div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-blush/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Luxury border with animated gradient */}
                    <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-wedding-gold via-wedding-blush to-wedding-gold opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                      <div className="w-full h-full rounded-2xl bg-white/90"></div>
                    </div>
                    
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-700"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="font-great-vibes text-3xl font-semibold text-wedding-maroon mb-4 group-hover:text-wedding-gold transition-colors duration-500 tracking-wide">
                        {event.name}
                      </h3>
                      
                      <div className="space-y-3 text-gray-600">
                        <div className={`flex items-center gap-3 group-hover:text-wedding-maroon transition-colors duration-300 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          {index % 2 === 0 ? (
                            <>
                              <span className="text-base font-playfair font-medium tracking-wide">{event.date}</span>
                              <div className="p-2 rounded-full bg-wedding-gold/10 group-hover:bg-wedding-gold/20 transition-colors duration-300">
                                <Calendar size={16} className="text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="p-2 rounded-full bg-wedding-gold/10 group-hover:bg-wedding-gold/20 transition-colors duration-300">
                                <Calendar size={16} className="text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <span className="text-base font-playfair font-medium tracking-wide">{event.date}</span>
                            </>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-3 group-hover:text-wedding-maroon transition-colors duration-300 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          {index % 2 === 0 ? (
                            <>
                              <span className="text-base font-playfair font-medium tracking-wide">{event.time}</span>
                              <div className="p-2 rounded-full bg-wedding-gold/10 group-hover:bg-wedding-gold/20 transition-colors duration-300">
                                <Clock size={16} className="text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="p-2 rounded-full bg-wedding-gold/10 group-hover:bg-wedding-gold/20 transition-colors duration-300">
                                <Clock size={16} className="text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <span className="text-base font-playfair font-medium tracking-wide">{event.time}</span>
                            </>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-3 group-hover:text-wedding-maroon transition-colors duration-300 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          {index % 2 === 0 ? (
                            <>
                              <span className="text-base font-playfair font-medium tracking-wide">{event.venue}</span>
                              <div className="p-2 rounded-full bg-wedding-gold/10 group-hover:bg-wedding-gold/20 transition-colors duration-300">
                                <MapPin size={16} className="text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="p-2 rounded-full bg-wedding-gold/10 group-hover:bg-wedding-gold/20 transition-colors duration-300">
                                <MapPin size={16} className="text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <span className="text-base font-playfair font-medium tracking-wide">{event.venue}</span>
                            </>
                          )}
                        </div>
                        
                        {event.address && (
                          <p className="text-sm text-gray-500 mt-3 group-hover:text-gray-600 transition-colors duration-300 font-poppins italic">
                            {event.address}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced corner decorations with animation */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-wedding-gold/40 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-tl-lg"></div>
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-wedding-gold/40 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-wedding-gold/40 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-wedding-gold/40 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-br-lg"></div>
                    
                    {/* Sparkle effects */}
                    <div className="absolute top-6 right-6 w-1 h-1 bg-wedding-gold rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
                    <div className="absolute bottom-8 left-8 w-1 h-1 bg-wedding-blush rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700" style={{ animationDelay: '0.2s' }}></div>
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
