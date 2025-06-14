
import React, { useRef, useState, useEffect } from 'react';
import { Calendar, Music, Heart, MapPin, ExternalLink, Crown, Sparkles, Clock, Users } from 'lucide-react';
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
  gradient: string;
  description: string;
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
      description: "A beautiful ceremony where intricate henna patterns will adorn the bride's hands, symbolizing love and prosperity.",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <Heart size={16} className="text-white" fill="currentColor" />,
      color: "from-rose-400 to-pink-500",
      gradient: "bg-gradient-to-br from-rose-50/90 to-pink-50/90 border-rose-200/50"
    },
    {
      name: "Sangeet Ceremony",
      date: "14th May 2025",
      time: "7:00 PM",
      venue: "Suryagarh Palace",
      description: "An evening filled with music, dance, and celebration as families come together in joyous harmony.",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <Music size={16} className="text-white" />,
      color: "from-amber-400 to-yellow-500",
      gradient: "bg-gradient-to-br from-amber-50/90 to-yellow-50/90 border-amber-200/50"
    },
    {
      name: "Wedding Ceremony",
      date: "15th May 2025",
      time: "8:00 PM",
      venue: "Suryagarh Palace",
      description: "The sacred union where two hearts become one, witnessed by loved ones under the divine blessings.",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <Crown size={16} className="text-white" />,
      color: "from-purple-400 to-violet-500",
      gradient: "bg-gradient-to-br from-purple-50/90 to-violet-50/90 border-purple-200/50"
    },
    {
      name: "Reception",
      date: "16th May 2025",
      time: "7:00 PM",
      venue: "Suryagarh Palace",
      description: "A grand celebration feast where we toast to new beginnings and create lasting memories together.",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <Sparkles size={16} className="text-white" />,
      color: "from-emerald-400 to-teal-500",
      gradient: "bg-gradient-to-br from-emerald-50/90 to-teal-50/90 border-emerald-200/50"
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
      { threshold: 0.3 }
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
    <section className="w-full py-16 bg-gradient-to-br from-wedding-cream/40 via-white/60 to-wedding-blush/20 relative overflow-hidden">
      {/* Elegant background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-wedding-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-wedding-maroon/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-wedding-gold/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-wedding-maroon/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <Crown size={24} className="text-wedding-gold animate-pulse" />
            <span className="inline-block py-2 px-6 bg-gradient-to-r from-wedding-gold/10 to-wedding-maroon/10 rounded-full text-sm font-medium text-wedding-gold border border-wedding-gold/20 tracking-wider uppercase">
              Celebration Timeline
            </span>
            <Crown size={24} className="text-wedding-gold animate-pulse" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
          
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-wedding-maroon mb-4 leading-tight">
            Our Sacred Journey
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg mb-6">
            Join us as we celebrate these precious moments that will mark the beginning of our eternal bond
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-wedding-gold/60 to-wedding-gold"></div>
            <div className="relative">
              <Sparkles size={16} className="text-wedding-gold animate-pulse" />
              <div className="absolute inset-0 bg-wedding-gold/20 rounded-full animate-ping"></div>
            </div>
            <div className="h-[2px] w-24 bg-gradient-to-l from-transparent via-wedding-gold/60 to-wedding-gold"></div>
          </div>
        </div>
        
        {/* Enhanced Timeline */}
        <div className="relative">
          {/* Elegant central timeline */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-wedding-gold/30 via-wedding-gold/60 to-wedding-gold/30 transform -translate-x-1/2 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-wedding-gold/20 via-wedding-gold/40 to-wedding-gold/20 blur-sm"></div>
          </div>
          
          <div className="space-y-12 lg:space-y-16">
            {events.map((event, index) => (
              <div 
                key={index}
                ref={el => eventRefs.current[index] = el}
                className={`relative flex flex-col lg:flex-row ${
                  index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                } items-center lg:items-start gap-6 lg:gap-12 ${
                  visibleEvents.includes(index) 
                    ? 'opacity-100 transform translate-y-0 transition-all duration-1000' 
                    : 'opacity-0 transform translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => handleEventHover(index)}
                onMouseLeave={handleEventLeave}
                onTouchStart={() => handleEventHover(index)}
                onTouchEnd={handleEventLeave}
              >
                {/* Enhanced Timeline Node */}
                <div className="hidden lg:flex absolute left-1/2 w-14 h-14 transform -translate-x-1/2 items-center justify-center z-20">
                  <div className={`w-full h-full bg-gradient-to-br ${event.color} rounded-full shadow-lg border-4 border-white transition-all duration-500 ${
                    activeEvent === index ? 'scale-125 shadow-2xl' : ''
                  } flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    {event.icon}
                    {activeEvent === index && (
                      <div className="absolute inset-0 border-2 border-white/50 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Event Card */}
                <div 
                  className={`modern-event-card lg:w-5/12 w-full transition-all duration-500 ${
                    activeEvent === index ? 'modern-event-active' : ''
                  } ${event.gradient}`}
                >
                  <div className="p-6 lg:p-8">
                    {/* Mobile Icon */}
                    <div className="lg:hidden flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${event.color} rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                        activeEvent === index ? 'scale-110' : ''
                      }`}>
                        {event.icon}
                      </div>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-wedding-gold/30 to-transparent"></div>
                    </div>
                    
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-playfair text-xl lg:text-2xl text-wedding-maroon leading-tight">
                        {event.name}
                        {activeEvent === index && <Sparkles size={16} className="inline ml-2 text-wedding-gold animate-pulse" />}
                      </h3>
                    </div>
                    
                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar size={16} className="text-wedding-gold flex-shrink-0" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock size={16} className="text-wedding-gold flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin size={16} className="text-wedding-gold flex-shrink-0" />
                        <span className="font-medium">{event.venue}</span>
                      </div>
                    </div>
                    
                    {/* Event Description */}
                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-6 italic">
                      {event.description}
                    </p>
                    
                    {/* Map Button */}
                    {event.mapLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-9 px-4 bg-wedding-gold/5 hover:bg-wedding-gold/15 border-wedding-gold/30 hover:border-wedding-gold/50 text-wedding-maroon transition-all duration-300 group"
                      >
                        <a 
                          href={event.mapLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <MapPin size={14} className="group-hover:scale-110 transition-transform duration-300" />
                          <span>View Location</span>
                          <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Spacer for alignment */}
                <div className="hidden lg:block lg:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style>{`
        .modern-event-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,249,239,0.9) 100%);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 20px;
          box-shadow: 
            0 8px 32px rgba(139,69,19,0.08), 
            0 2px 8px rgba(212,175,55,0.1),
            inset 0 1px 0 rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          transform-origin: center;
        }

        .modern-event-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.08), transparent);
          transition: left 0.8s ease;
        }

        .modern-event-card:hover::before {
          left: 100%;
        }

        .modern-event-active {
          border-color: rgba(212,175,55,0.4);
          box-shadow: 
            0 16px 48px rgba(139,69,19,0.15), 
            0 8px 24px rgba(212,175,55,0.2), 
            0 0 32px rgba(212,175,55,0.1),
            inset 0 1px 0 rgba(255,255,255,0.9);
          transform: scale(1.02) translateY(-4px);
        }

        .modern-event-active::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 2px;
          background: linear-gradient(45deg, 
            rgba(212,175,55,0.4) 0%, 
            rgba(139,69,19,0.3) 25%,
            rgba(212,175,55,0.5) 50%,
            rgba(139,69,19,0.3) 75%,
            rgba(212,175,55,0.4) 100%
          );
          background-size: 300% 300%;
          animation: luxury-border-flow 3s ease infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
        }

        @keyframes luxury-border-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @media (max-width: 1024px) {
          .modern-event-card {
            border-radius: 16px;
          }
          
          .modern-event-active {
            transform: scale(1.01) translateY(-2px);
          }
        }
      `}</style>
    </section>
  );
};

export default EventTimeline;
