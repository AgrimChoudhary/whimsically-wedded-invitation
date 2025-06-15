
import React from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';
import { useIsMobile } from '@/hooks/use-mobile';

const EventTimeline = () => {
  const { weddingData } = useWedding();
  const isMobile = useIsMobile();

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-wedding-cream via-white to-wedding-blush/20 relative overflow-hidden">
      {/* Background decorative elements - responsive */}
      <div className="absolute inset-0">
        <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-wedding-gold/5 rounded-full blur-2xl sm:blur-3xl animate-floating"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-8 sm:right-16 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-wedding-blush/10 rounded-full blur-2xl sm:blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 sm:w-20 lg:w-24 h-12 sm:h-20 lg:h-24 bg-wedding-gold/8 rounded-full blur-xl sm:blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced mobile-first header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <div className="relative inline-block mb-4 sm:mb-6">
            <h2 className="font-great-vibes text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-wedding-maroon mb-2 sm:mb-4 relative z-10 leading-tight">
              Celebration Timeline
            </h2>
            <div className="absolute inset-0 font-great-vibes text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-wedding-gold/20 blur-sm transform translate-x-0.5 sm:translate-x-1 translate-y-0.5 sm:translate-y-1">
              Celebration Timeline
            </div>
          </div>
          
          <div className="relative mb-4 sm:mb-6">
            <div className="w-20 sm:w-24 lg:w-32 h-[2px] sm:h-[3px] bg-gradient-to-r from-transparent via-wedding-gold to-transparent mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 bg-wedding-gold rounded-full shadow-lg"></div>
          </div>
          
          <p className="text-gray-600 max-w-xl lg:max-w-2xl mx-auto font-playfair text-sm sm:text-base lg:text-lg leading-relaxed px-4">
            Join us as we celebrate our love through multiple beautiful ceremonies
          </p>
        </div>

        <div className="relative">
          {/* Mobile-optimized timeline */}
          {isMobile ? (
            // Mobile Layout - Single column with left-aligned cards
            <div className="space-y-8">
              {weddingData.events.map((event, index) => (
                <div key={event.id} className="relative flex items-start group animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  {/* Mobile timeline dot */}
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-wedding-gold to-wedding-deep-gold rounded-full border-3 border-white shadow-lg z-10 group-hover:scale-125 transition-all duration-500 mt-2">
                    <div className="absolute inset-0 bg-wedding-gold rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-1.5 bg-white rounded-full opacity-30"></div>
                  </div>
                  
                  {/* Mobile connecting line */}
                  {index < weddingData.events.length - 1 && (
                    <div className="absolute left-3 top-8 w-px h-20 bg-gradient-to-b from-wedding-gold via-wedding-blush to-wedding-gold/50"></div>
                  )}
                  
                  {/* Mobile event card */}
                  <div className="ml-6 flex-1">
                    <div className="luxury-mobile-card p-4 rounded-xl transition-all duration-700 group cursor-pointer transform hover:scale-102 hover:-translate-y-1">
                      {/* Mobile card backgrounds */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/95 via-white/98 to-wedding-cream/90 backdrop-blur-lg shadow-lg"></div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-wedding-gold/3 via-transparent to-wedding-blush/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Mobile luxury border */}
                      <div className="absolute inset-0 rounded-xl p-[1.5px] bg-gradient-to-br from-wedding-gold/40 via-wedding-blush/30 to-wedding-gold/40 opacity-40 group-hover:opacity-70 transition-opacity duration-500">
                        <div className="w-full h-full rounded-xl bg-white/95"></div>
                      </div>
                      
                      {/* Mobile glow effect */}
                      <div className="absolute inset-0 rounded-xl shadow-[0_0_0px_rgba(212,175,55,0)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-700"></div>
                      
                      {/* Mobile content */}
                      <div className="relative z-10">
                        <h3 className="font-great-vibes text-xl sm:text-2xl text-wedding-maroon mb-3 group-hover:text-wedding-gold transition-colors duration-500">
                          {event.name}
                        </h3>
                        
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center gap-2 group-hover:text-wedding-maroon transition-colors duration-300">
                            <div className="p-1.5 rounded-full bg-wedding-gold/10 group-hover:bg-wedding-gold/20 transition-colors duration-300">
                              <Calendar size={14} className="text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-sm font-playfair font-medium">{event.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 group-hover:text-wedding-maroon transition-colors duration-300">
                            <div className="p-1.5 rounded-full bg-wedding-gold/10 group-hover:bg-wedding-gold/20 transition-colors duration-300">
                              <Clock size={14} className="text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-sm font-playfair font-medium">{event.time}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 group-hover:text-wedding-maroon transition-colors duration-300">
                            <div className="p-1.5 rounded-full bg-wedding-gold/10 group-hover:bg-wedding-gold/20 transition-colors duration-300">
                              <MapPin size={14} className="text-wedding-gold group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-sm font-playfair font-medium">{event.venue}</span>
                          </div>
                          
                          {event.address && (
                            <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-600 transition-colors duration-300 font-poppins italic pl-6">
                              {event.address}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Mobile corner decorations */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-wedding-gold/50 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-tl-md"></div>
                      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-wedding-gold/50 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-tr-md"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-wedding-gold/50 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-bl-md"></div>
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-wedding-gold/50 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-br-md"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop Layout - Enhanced timeline with alternating cards
            <>
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-wedding-gold via-wedding-blush to-wedding-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"></div>
              
              <div className="space-y-12 lg:space-y-16">
                {weddingData.events.map((event, index) => (
                  <div 
                    key={event.id} 
                    className={`relative flex items-center group ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Desktop timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 bg-gradient-to-br from-wedding-gold to-wedding-deep-gold rounded-full border-3 sm:border-4 border-white shadow-lg z-10 group-hover:scale-125 transition-all duration-500">
                      <div className="absolute inset-0 bg-wedding-gold rounded-full animate-ping opacity-20"></div>
                      <div className="absolute inset-1.5 sm:inset-2 bg-white rounded-full opacity-30"></div>
                    </div>
                    
                    {/* Desktop event card */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8 lg:pr-12' : 'text-left pl-8 lg:pl-12'} animate-fade-in-up`}>
                      <div className="luxury-desktop-card p-6 lg:p-8 rounded-2xl transition-all duration-700 group cursor-pointer transform hover:scale-105 hover:-translate-y-2">
                        {/* Desktop card backgrounds */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/90 via-white/95 to-wedding-cream/80 backdrop-blur-xl shadow-xl"></div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-blush/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Desktop luxury border */}
                        <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-wedding-gold via-wedding-blush to-wedding-gold opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                          <div className="w-full h-full rounded-2xl bg-white/90"></div>
                        </div>
                        
                        {/* Desktop glow effect */}
                        <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-700"></div>
                        
                        {/* Desktop content */}
                        <div className="relative z-10">
                          <h3 className="font-great-vibes text-2xl lg:text-3xl font-semibold text-wedding-maroon mb-4 group-hover:text-wedding-gold transition-colors duration-500 tracking-wide">
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
                        
                        {/* Desktop corner decorations */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-wedding-gold/40 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-tl-lg"></div>
                        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-wedding-gold/40 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-tr-lg"></div>
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-wedding-gold/40 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-bl-lg"></div>
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-wedding-gold/40 group-hover:border-wedding-gold group-hover:scale-125 transition-all duration-500 rounded-br-lg"></div>
                        
                        {/* Desktop sparkle effects */}
                        <div className="absolute top-6 right-6 w-1 h-1 bg-wedding-gold rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
                        <div className="absolute bottom-8 left-8 w-1 h-1 bg-wedding-blush rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced mobile styles */}
      <style>{`
        .luxury-mobile-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(254,249,239,0.9) 100%);
          border: 1px solid rgba(212,175,55,0.25);
          box-shadow: 0 4px 20px rgba(139,69,19,0.08), 0 2px 8px rgba(212,175,55,0.12);
          backdrop-filter: blur(12px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
        }

        .luxury-mobile-card:hover {
          box-shadow: 0 8px 32px rgba(139,69,19,0.12), 0 4px 16px rgba(212,175,55,0.2);
          transform: translateY(-2px) scale(1.01);
        }

        .luxury-desktop-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(254,249,239,0.9) 100%);
          border: 1px solid rgba(212,175,55,0.2);
          box-shadow: 0 8px 32px rgba(139,69,19,0.1), 0 2px 8px rgba(212,175,55,0.15);
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
        }

        .luxury-desktop-card:hover {
          box-shadow: 0 20px 60px rgba(139,69,19,0.15), 0 8px 20px rgba(212,175,55,0.25);
          transform: translateY(-8px) scale(1.02);
        }

        @media (max-width: 640px) {
          .font-great-vibes {
            line-height: 1.2;
          }
        }
      `}</style>
    </section>
  );
};

export default EventTimeline;
