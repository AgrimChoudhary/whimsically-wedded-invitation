
import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Users, User, UserRound, Heart } from 'lucide-react';

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
  
  const brideFamily: FamilyMember[] = [
    { 
      name: "Rajesh & Priya Sharma", 
      relation: "Parents of the Bride",
      description: "Rajesh is a successful businessman who loves cricket and traveling. Priya is a dedicated homemaker with a passion for classical music and cooking traditional dishes."
    },
    { 
      name: "Ishaan Sharma", 
      relation: "Brother of the Bride",
      description: "Ishaan is a software engineer working in Bangalore. He enjoys gaming and photography in his free time."
    },
    { 
      name: "Meera Sharma", 
      relation: "Sister of the Bride",
      description: "Meera is pursuing her Masters in Psychology. She is an avid reader and loves to paint."
    }
  ];
  
  const groomFamily: FamilyMember[] = [
    { 
      name: "Vikram & Nisha Patel", 
      relation: "Parents of the Groom",
      description: "Vikram is a retired professor who now mentors students. Nisha is a doctor specializing in pediatrics and loves gardening."
    },
    { 
      name: "Aditya Patel", 
      relation: "Brother of the Groom",
      description: "Aditya is an entrepreneur who runs a successful startup. He's passionate about fitness and hiking."
    },
    { 
      name: "Riya Patel", 
      relation: "Sister of the Groom",
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
        <div className={`glass-card p-6 transform transition-all duration-500 cursor-pointer hover:shadow-gold-glow ${
          isVisible ? side === "Bride's" ? 'animate-slide-in-left' : 'animate-slide-in-right' : 'opacity-0'
        }`}>
          <div className="text-center mb-4">
            <span className="inline-block py-1 px-3 bg-wedding-blush rounded-full text-xs text-wedding-maroon mb-2">
              {side} Family
            </span>
            <h3 className="font-playfair text-2xl text-wedding-maroon">
              {title}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-wedding-gold/10 flex items-center justify-center mb-3 border border-wedding-gold/20">
                <Users size={28} className="text-wedding-gold" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-800">{members[0].name}</p>
                <p className="text-sm text-gray-600">{members[0].relation}</p>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <span className="text-sm text-wedding-maroon inline-flex items-center gap-1">
                <Heart size={12} className="text-wedding-blush" />
                <span>Click to meet the family</span>
                <Heart size={12} className="text-wedding-blush" />
              </span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl glass-card border-wedding-gold/30">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
              {side} Family
            </span>
            <h3 className="font-playfair text-2xl text-wedding-maroon">{title}</h3>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {members.map((member, index) => (
            <div key={index} className="flex items-center gap-4 p-3 hover:bg-wedding-cream/20 rounded-lg transition-colors duration-300">
              <div className="w-16 h-16 rounded-full bg-wedding-gold/10 flex items-center justify-center border border-wedding-gold/20 flex-shrink-0">
                {index === 0 ? (
                  <Users size={28} className="text-wedding-gold" />
                ) : (
                  <UserRound size={28} className="text-wedding-gold" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{member.name}</p>
                <p className="text-sm text-gray-600 mb-1">{member.relation}</p>
                <p className="text-sm text-gray-700">{member.description}</p>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-4">
            <div className="inline-block p-2 bg-wedding-gold/5 rounded-full">
              <Star size={20} className="text-wedding-gold" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <section ref={sectionRef} className="w-full py-10 bg-floral-pattern">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            With Blessings From
          </span>
          <h2 className="font-playfair text-3xl text-wedding-maroon">Our Families</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
