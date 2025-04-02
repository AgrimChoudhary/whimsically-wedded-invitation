
import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Star, Users, User, UserRound, Heart, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FamilyMember {
  name: string;
  relation: string;
  image?: string;
  description?: string;
}

interface FamilyDetailProps {
  side: string;
  title: string;
  members: FamilyMember[];
}

const FamilyDetails: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const brideFamily: FamilyMember[] = [
    { 
      name: "Rajesh & Priya Sharma", 
      relation: "Parents of the Bride",
      image: "https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f",
      description: "Rajesh is a successful businessman who loves cricket and traveling. Priya is a dedicated homemaker with a passion for classical music and cooking traditional dishes."
    },
    { 
      name: "Ishaan Sharma", 
      relation: "Brother of the Bride",
      image: "https://images.unsplash.com/photo-1507081323647-4d250478b919",
      description: "Ishaan is a software engineer working in Bangalore. He enjoys gaming and photography in his free time."
    },
    { 
      name: "Meera Sharma", 
      relation: "Sister of the Bride",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      description: "Meera is pursuing her Masters in Psychology. She is an avid reader and loves to paint."
    }
  ];
  
  const groomFamily: FamilyMember[] = [
    { 
      name: "Vikram & Nisha Patel", 
      relation: "Parents of the Groom",
      image: "https://images.unsplash.com/photo-1604849329114-a8c9f4e4b926",
      description: "Vikram is a retired professor who now mentors students. Nisha is a doctor specializing in pediatrics and loves gardening."
    },
    { 
      name: "Aditya Patel", 
      relation: "Brother of the Groom",
      image: "https://images.unsplash.com/photo-1502307100811-6bdc0981a85b",
      description: "Aditya is an entrepreneur who runs a successful startup. He's passionate about fitness and hiking."
    },
    { 
      name: "Riya Patel", 
      relation: "Sister of the Groom",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
      description: "Riya is an architect with a love for sustainable design. She enjoys playing the violin and experimenting with fusion cooking."
    }
  ];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const FamilyCard: React.FC<FamilyDetailProps> = ({ side, title, members }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`glass-card p-4 sm:p-6 transform transition-all duration-500 cursor-pointer hover:shadow-gold-glow ${
          isVisible ? side === "Bride's" ? 'animate-slide-in-left' : 'animate-slide-in-right' : 'opacity-0'
        }`}>
          <div className="text-center mb-3">
            <span className="inline-block py-1 px-2 bg-wedding-blush rounded-full text-xs text-wedding-maroon mb-1">
              {side} Family
            </span>
            <h3 className="font-playfair text-xl sm:text-2xl text-wedding-maroon">
              {title}
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-wedding-gold/10 flex items-center justify-center mb-2 border border-wedding-gold/20">
                <Users size={24} className="text-wedding-gold" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-800 text-sm sm:text-base">{members[0].name}</p>
                <p className="text-xs sm:text-sm text-gray-600">{members[0].relation}</p>
              </div>
            </div>
            
            <div className="text-center mt-2">
              <span className="text-xs sm:text-sm text-wedding-maroon inline-flex items-center gap-1">
                <Heart size={12} className="text-wedding-blush" />
                <span>Meet the family</span>
                <Heart size={12} className="text-wedding-blush" />
              </span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl glass-card border-wedding-gold/30">
        <DialogHeader className="relative">
          <DialogTitle className="text-center pt-2">
            <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
              {side} Family
            </span>
            <h3 className="font-playfair text-xl sm:text-2xl text-wedding-maroon">{title}</h3>
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 p-1 rounded-full bg-wedding-cream/80 hover:bg-wedding-cream transition-colors duration-300">
            <X size={18} className="text-wedding-maroon" />
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto">
          {members.map((member, index) => (
            <div key={index} className="flex items-center gap-3 p-2 hover:bg-wedding-cream/20 rounded-lg transition-colors duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border border-wedding-gold/20">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-wedding-gold/10 flex items-center justify-center">
                    {index === 0 ? (
                      <Users size={24} className="text-wedding-gold" />
                    ) : (
                      <UserRound size={24} className="text-wedding-gold" />
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm sm:text-base">{member.name}</p>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{member.relation}</p>
                <p className="text-xs text-gray-700">{member.description}</p>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-2">
            <div className="inline-block p-2 bg-wedding-gold/5 rounded-full">
              <Star size={18} className="text-wedding-gold" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <section ref={sectionRef} className="w-full py-8 bg-floral-pattern">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-10">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            With Blessings From
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl text-wedding-maroon">Our Families</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <FamilyCard 
            side="Bride's" 
            title="Sharma Family" 
            members={brideFamily} 
          />
          <FamilyCard 
            side="Groom's" 
            title="Patel Family" 
            members={groomFamily} 
          />
        </div>
      </div>
    </section>
  );
};

export default FamilyDetails;
