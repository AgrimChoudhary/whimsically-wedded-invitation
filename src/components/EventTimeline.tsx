
import React, { useRef, useState, useEffect } from 'react';
import { Calendar, Music, Heart, MapPin, ExternalLink, Crown, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface Event {
  name: string;
  date: string;
  time: string;
  venue: string;
  mapLink?: string;
  icon: React.ReactNode;
  color: string;
}

const EventTimeline: React.FC = () => {
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();
  
  const events: Event[] = [
    {
      name: "Mehendi Ceremony",
      date: "14th May 2025",
      time: "11:00 AM",
      venue: "Suryagarh Palace",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <div className="p-1.5 rounded-full bg-gradient-to-br from-red-100 to-red-200 text-red-600 shadow-sm"><Heart size={14} /></div>,
      color: "bg-gradient-to-br from-red-50/80 to-red-100/60 border-red-200/60"
    },
    {
      name: "Sangeet Ceremony",
      date: "14th May 2025",
      time: "7:00 PM",
      venue: "Suryagarh Palace",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <div className="p-1.5 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"/>
                <path d="M19.5 9c0 3.5-3.5 6.5-7.5 11-4-4.5-7.5-7.5-7.5-11a7.5 7.5 0 1 1 15 0z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>,
      color: "bg-gradient-to-br from-yellow-50/80 to-yellow-100/60 border-yellow-200/60"
    },
    {
      name: "Wedding Ceremony",
      date: "15th May 2025",
      time: "8:00 PM",
      venue: "Suryagarh Palace",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <div className="p-1.5 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 shadow-sm">
              <Crown size={14} />
            </div>,
      color: "bg-gradient-to-br from-purple-50/80 to-purple-100/60 border-purple-200/60"
    },
    {
      name: "Reception",
      date: "16th May 2025",
      time: "7:00 PM",
      venue: "Suryagarh Palace",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <div className="p-1.5 rounded-full bg-gradient-to-br from-green-100 to-green-200 text-green-600 shadow-sm">
              <Sparkles size={14} />
            </div>,
      color: "bg-gradient-to-br from-green-50/80 to-green-100/60 border-green-200/60"
    },
  ];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = eventRefs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && index !== -1 && !visibleEvents.includes(index)) {
            setVisibleEvents(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    eventRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [visibleEvents]);

  const handleEventHover = (index: number) => {
    setActiveEvent(index);
  };

  const handleEventLeave = () => {
    setActiveEvent(null);
  };

  return (
    <section className="w-full py-12 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/5 to-wedding-cream/60 relative overflow-hidden">
      {/* Royal background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/3 via-transparent to-wedding-maroon/3"></div>
      <div className="absolute top-16 left-16 w-2 h-2 bg-wedding-gold/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-3 h-3 bg-wedding-maroon/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown size={20} className="text-wedding-gold animate-pulse" />
            <span className="inline-block py-1.5 px-4 bg-gradient-to-r from-wedding-gold/10 to-wedding-maroon/10 rounded-full text-sm font-medium text-wedding-gold border border-wedding-gold/20 tracking-wide">
              Join Us For
            </span>
            <Crown size={20} className="text-wedding-gold animate-pulse" />
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl text-wedding-maroon mb-3">Royal Wedding Ceremonies</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed mb-4">
            Celebrate these royal moments with us as we begin our eternal journey together
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-wedding-gold/50 to-wedding-gold"></div>
            <Sparkles size={12} className="text-wedding-gold animate-pulse" />
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-wedding-gold/50 to-wedding-gold"></div>
          </div>
        </div>
        
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-wedding-gold/20 via-wedding-gold/40 to-wedding-gold/20 transform -translate-x-1/2 shadow-sm"></div>
          
          <div className="space-y-6">
            {events.map((event, index) => (
              <div 
                key={index}
                ref={el => eventRefs.current[index] = el}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } items-center md:items-start gap-4 md:gap-6 ${
                  visibleEvents.includes(index) 
                    ? 'opacity-100 transform translate-y-0 transition-all duration-700' 
                    : 'opacity-0 transform translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => handleEventHover(index)}
                onMouseLeave={handleEventLeave}
                onTouchStart={() => handleEventHover(index)}
                onTouchEnd={handleEventLeave}
              >
                <div className="hidden md:flex absolute left-1/2 w-10 h-10 bg-gradient-to-br from-wedding-gold to-wedding-gold/80 rounded-full transform -translate-x-1/2 items-center justify-center z-10 transition-all duration-300 shadow-lg border-2 border-white">
                  <div className={`w-4 h-4 bg-wedding-cream rounded-full transition-all duration-300 ${activeEvent === index ? 'scale-75' : 'scale-100'} shadow-inner`}></div>
                  {activeEvent === index && (
                    <div className="absolute inset-0 bg-wedding-gold/30 rounded-full animate-ping"></div>
                  )}
                </div>
                
                <div 
                  className={`luxury-event-card border md:w-5/12 w-full p-4 sm:p-5 transition-all duration-400 ${
                    activeEvent === index ? 'luxury-event-active' : ''
                  } ${event.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 transition-all duration-300 ${activeEvent === index ? 'transform scale-110' : ''}`}>
                      {event.icon}
                    </div>
                    <div className="w-full">
                      <h3 className="font-playfair text-lg sm:text-xl text-wedding-maroon mb-2 flex items-center gap-2">
                        {event.name}
                        {activeEvent === index && <Sparkles size={14} className="text-wedding-gold animate-pulse" />}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                          <Calendar size={14} className="mr-2 text-wedding-gold" />
                          <span className="font-medium">{event.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm pl-6">{event.time}</p>
                        {event.venue && <p className="text-gray-700 font-medium text-sm pl-6">{event.venue}</p>}
                        
                        {event.mapLink && (
                          <div className="pl-6 pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-7 px-3 text-xs bg-wedding-gold/5 hover:bg-wedding-gold/15 border-wedding-gold/30 hover:border-wedding-gold/50 text-wedding-maroon transition-all duration-300"
                            >
                              <a 
                                href={event.mapLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <MapPin size={12} />
                                <span>View Map</span>
                                <ExternalLink size={10} />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom styles for luxury effects */}
      <style>{`
        .luxury-event-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(254,249,239,0.8) 100%);
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(139,69,19,0.08), 0 1px 3px rgba(212,175,55,0.1);
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }

        .luxury-event-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.1), transparent);
          transition: left 0.6s ease;
        }

        .luxury-event-card:hover::before {
          left: 100%;
        }

        .luxury-event-active {
          border-color: rgba(212,175,55,0.5);
          box-shadow: 0 8px 40px rgba(139,69,19,0.12), 0 4px 20px rgba(212,175,55,0.2), 0 0 20px rgba(212,175,55,0.1);
          transform: scale(1.02);
        }

        .luxury-event-active::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          padding: 1px;
          background: linear-gradient(45deg, 
            rgba(212,175,55,0.3) 0%, 
            rgba(139,69,19,0.2) 25%,
            rgba(212,175,55,0.4) 50%,
            rgba(139,69,19,0.2) 75%,
            rgba(212,175,55,0.3) 100%
          );
          background-size: 200% 200%;
          animation: luxury-border-glow 2s ease infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
        }

        @keyframes luxury-border-glow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default EventTimeline;
