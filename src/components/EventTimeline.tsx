
import React, { useRef, useState, useEffect } from 'react';
import { Calendar, Music, Heart, PartyPopper, MapPin, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Event {
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapLink: string;
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
      name: "Mehndi Ceremony",
      date: "12th February 2025",
      time: "10:00 AM - 3:00 PM",
      venue: "Sharma Residence",
      address: "123 Lotus Lane, New Delhi",
      mapLink: "https://goo.gl/maps/Kt12345Abc",
      icon: <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="currentColor" />
              </svg>
            </div>,
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      name: "Sangeet Night",
      date: "13th February 2025",
      time: "6:00 PM - 11:00 PM",
      venue: "Grand Pavilion",
      address: "456 Harmony Road, New Delhi",
      mapLink: "https://goo.gl/maps/Xyz67890Def",
      icon: <div className="p-2 rounded-full bg-purple-100 text-purple-600"><Music size={18} /></div>,
      color: "bg-purple-50 border-purple-200"
    },
    {
      name: "Wedding Ceremony",
      date: "14th February 2025",
      time: "11:00 AM - 3:00 PM",
      venue: "Divine Gardens",
      address: "789 Blessing Avenue, New Delhi",
      mapLink: "https://goo.gl/maps/Ghi12345Jkl",
      icon: <div className="p-2 rounded-full bg-red-100 text-red-600"><Heart size={18} /></div>,
      color: "bg-red-50 border-red-200"
    },
    {
      name: "Reception",
      date: "14th February 2025",
      time: "7:00 PM - 12:00 AM",
      venue: "Royal Banquet Hall",
      address: "101 Celebration Street, New Delhi",
      mapLink: "https://goo.gl/maps/Mno56789Pqr",
      icon: <div className="p-2 rounded-full bg-blue-100 text-blue-600"><PartyPopper size={18} /></div>,
      color: "bg-blue-50 border-blue-200"
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
    <section className="w-full py-12 bg-wedding-cream bg-opacity-40">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            Join Us For
          </span>
          <h2 className="font-playfair text-3xl text-wedding-maroon">Wedding Events</h2>
        </div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-wedding-gold/10 via-wedding-gold/30 to-wedding-gold/10 transform -translate-x-1/2"></div>
          
          <div className="space-y-8">
            {events.map((event, index) => (
              <div 
                key={index}
                ref={el => eventRefs.current[index] = el}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } items-center md:items-start gap-6 ${
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
                {/* Timeline dot - visible on md+ screens */}
                <div className="hidden md:flex absolute left-1/2 w-8 h-8 bg-wedding-gold/80 rounded-full transform -translate-x-1/2 items-center justify-center z-10 transition-all duration-300 shadow-gold-soft">
                  <div className={`w-4 h-4 bg-wedding-cream rounded-full transition-all duration-300 ${activeEvent === index ? 'scale-75' : 'scale-100'}`}></div>
                </div>
                
                {/* Event card */}
                <div 
                  className={`glass-card border md:w-5/12 p-5 transition-all duration-300 hover:shadow-gold-glow ${
                    activeEvent === index ? 'shadow-gold-glow border-wedding-gold/40 transform scale-105 md:scale-[1.03]' : 'shadow-gold-soft'
                  } ${event.color}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`transition-all duration-300 ${activeEvent === index ? 'transform scale-110' : ''}`}>
                      {event.icon}
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl text-wedding-maroon">{event.name}</h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={14} className="mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <p className="text-gray-600 pl-5">{event.time}</p>
                        <p className="text-gray-700 font-medium pl-5 mb-1">{event.venue}</p>
                        
                        <a 
                          href={event.mapLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 pl-5 mt-2"
                        >
                          <MapPin size={14} className="mr-1" />
                          <span className="text-sm underline-grow">{event.address}</span>
                          <ExternalLink size={12} className="ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Empty space for alignment on opposite side */}
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
