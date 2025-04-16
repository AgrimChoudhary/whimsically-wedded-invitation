
import React, { useRef, useState, useEffect } from 'react';
import { Calendar, Music, Heart, PartyPopper, MapPin, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Event {
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
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
      name: "शुभ लग्न व टीका",
      date: "23rd April 2025",
      time: "4:00 PM",
      venue: "रॉयल पैलेस",
      address: "गंगापुर रोड, पेट्रोल पम्प के पास, वज़ीरपुर",
      mapLink: "https://maps.app.goo.gl/vnvgKXrfw6wBgrZk8",
      icon: <div className="p-2 rounded-full bg-red-100 text-red-600"><Heart size={18} /></div>,
      color: "bg-red-50 border-red-200"
    },
    {
      name: "भात",
      date: "23rd April 2025",
      time: "8:00 PM",
      venue: "रॉयल पैलेस",
      address: "गंगापुर रोड, पेट्रोल पम्प के पास, वज़ीरपुर",
      mapLink: "https://maps.app.goo.gl/vnvgKXrfw6wBgrZk8",
      icon: <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"/>
                <path d="M19.5 9c0 3.5-3.5 6.5-7.5 11-4-4.5-7.5-7.5-7.5-11a7.5 7.5 0 1 1 15 0z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>,
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      name: "प्रीतिभोज",
      date: "24th April 2025",
      time: "12:00 PM",
      venue: "निज निवास",
      address: "परिता",
      icon: <div className="p-2 rounded-full bg-green-100 text-green-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6v6l4 2"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>,
      color: "bg-green-50 border-green-200"
    },
    {
      name: "हल्दी & मेहंदी",
      date: "27th April 2025",
      time: "12:00 PM",
      venue: "निज निवास",
      address: "परिता",
      icon: <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="currentColor" />
              </svg>
            </div>,
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      name: "तेल",
      date: "27th April 2025",
      time: "8:00 PM",
      venue: "निज निवास",
      address: "परिता",
      icon: <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/>
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
              </svg>
            </div>,
      color: "bg-blue-50 border-blue-200"
    },
    {
      name: "चाकवास",
      date: "28th April 2025",
      time: "8:00 PM",
      venue: "निज निवास",
      address: "परिता",
      icon: <div className="p-2 rounded-full bg-purple-100 text-purple-600"><Music size={18} /></div>,
      color: "bg-purple-50 border-purple-200"
    }
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
    <section className="w-full py-10 bg-wedding-cream bg-opacity-40">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            Join Us For
          </span>
          <h2 className="font-kruti text-2xl sm:text-3xl text-wedding-maroon">विवाह समारोह</h2>
        </div>
        
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-wedding-gold/10 via-wedding-gold/30 to-wedding-gold/10 transform -translate-x-1/2"></div>
          
          <div className="space-y-6 sm:space-y-8">
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
                <div className="hidden md:flex absolute left-1/2 w-8 h-8 bg-wedding-gold/80 rounded-full transform -translate-x-1/2 items-center justify-center z-10 transition-all duration-300 shadow-gold-soft">
                  <div className={`w-4 h-4 bg-wedding-cream rounded-full transition-all duration-300 ${activeEvent === index ? 'scale-75' : 'scale-100'}`}></div>
                </div>
                
                <div 
                  className={`glass-card border md:w-5/12 p-4 sm:p-5 transition-all duration-300 ${
                    activeEvent === index ? 'shadow-gold-glow border-wedding-gold/40 transform scale-105' : 'shadow-gold-soft hover:shadow-gold-glow hover:scale-[1.01]'
                  } ${event.color}`}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`transition-all duration-300 ${activeEvent === index ? 'transform scale-110' : ''}`}>
                      {event.icon}
                    </div>
                    <div>
                      <h3 className="font-kruti text-lg sm:text-xl text-wedding-maroon">{event.name}</h3>
                      <div className="mt-1 sm:mt-2 space-y-1 text-xs sm:text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={14} className="mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <p className="text-gray-600 pl-5">{event.time}</p>
                        <p className="text-gray-700 font-medium pl-5 mb-1">{event.venue}</p>
                        
                        {event.mapLink ? (
                          <a 
                            href={event.mapLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 pl-5 mt-2"
                          >
                            <MapPin size={14} className="mr-1" />
                            <span className="text-xs sm:text-sm underline-grow">{event.address}</span>
                            <ExternalLink size={12} className="ml-1" />
                          </a>
                        ) : (
                          <p className="flex items-center text-gray-600 pl-5 mt-2">
                            <MapPin size={14} className="mr-1" />
                            <span className="text-xs sm:text-sm">{event.address}</span>
                          </p>
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
    </section>
  );
};

export default EventTimeline;
