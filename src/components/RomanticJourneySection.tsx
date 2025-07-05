
import React from 'react';
import { Heart, MapPin, Calendar, Star } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';

const RomanticJourneySection: React.FC = () => {
  const { weddingData } = useWedding();

  // Determine which person and city to show first based on groomFirst flag
  const firstPersonName = weddingData.groomFirst ? weddingData.couple.groomFirstName : weddingData.couple.brideFirstName;
  const secondPersonName = weddingData.groomFirst ? weddingData.couple.brideFirstName : weddingData.couple.groomFirstName;
  const firstPersonCity = weddingData.groomFirst ? weddingData.couple.groomCity : weddingData.couple.brideCity;
  const secondPersonCity = weddingData.groomFirst ? weddingData.couple.brideCity : weddingData.couple.groomCity;

  const journeySteps = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Two Cities",
      description: `${firstPersonName} from ${firstPersonCity || 'his city'}, ${secondPersonName} from ${secondPersonCity || 'her city'}`,
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "One Love",
      description: "Hearts connected across the distance, finding each other through destiny",
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Shared Dreams",
      description: "Building a beautiful future together, one dream at a time",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Forever Together",
      description: "Today we celebrate the beginning of our eternal journey",
      color: "from-wedding-gold to-wedding-deep-gold"
    }
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-br from-wedding-blush/10 via-white to-wedding-cream/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-16 left-8 w-20 h-20 bg-wedding-gold/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-12 w-32 h-32 bg-wedding-blush/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-wedding-cream/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-dancing-script text-3xl sm:text-4xl text-wedding-maroon mb-4">Our Love Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Every love story is beautiful, but ours is our favorite. Here's how our hearts found their way to each other.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <Heart size={12} className="text-wedding-gold animate-pulse" fill="currentColor" />
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="relative">
          {/* Connection line - vertical for mobile, horizontal for desktop */}
          <div className="absolute md:hidden left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-wedding-gold via-wedding-blush to-wedding-gold"></div>
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-wedding-gold via-wedding-blush to-wedding-gold transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {journeySteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Timeline node */}
                <div className="absolute md:relative left-0 md:left-auto top-6 md:top-auto transform md:transform-none -translate-x-1/2 md:translate-x-0 w-16 h-16 md:mx-auto mb-4 flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center text-white relative z-10`}>
                    {step.icon}
                  </div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-white/30 to-transparent animate-pulse"></div>
                </div>

                {/* Content card */}
                <div className="ml-20 md:ml-0 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-wedding-gold/20 hover:border-wedding-gold/40 transition-all duration-300 hover:shadow-xl">
                  <h3 className="font-playfair text-lg text-wedding-maroon mb-2 text-center md:text-left">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-center md:text-left">
                    {step.description}
                  </p>
                </div>

                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-wedding-gold rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <blockquote className="text-lg italic text-wedding-maroon font-playfair mb-4">
              "{weddingData.couple.coupleStory || "Our love story began with friendship and grew into something beautiful that we want to celebrate with all of you."}"
            </blockquote>
            <div className="flex items-center justify-center gap-2 text-wedding-gold">
              <Heart size={16} fill="currentColor" />
              <span className="font-dancing-script text-xl">
                {firstPersonName} & {secondPersonName}
              </span>
              <Heart size={16} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RomanticJourneySection;
