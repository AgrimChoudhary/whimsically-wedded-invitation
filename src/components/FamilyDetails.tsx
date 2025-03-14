
import React, { useRef, useEffect, useState } from 'react';

interface FamilyMember {
  name: string;
  relation: string;
  image?: string;
}

const FamilyDetails: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const brideFamily: FamilyMember[] = [
    { name: "Rajesh & Priya Sharma", relation: "Parents of the Bride" },
    { name: "Ishaan Sharma", relation: "Brother of the Bride" },
    { name: "Meera Sharma", relation: "Sister of the Bride" }
  ];
  
  const groomFamily: FamilyMember[] = [
    { name: "Vikram & Nisha Patel", relation: "Parents of the Groom" },
    { name: "Aditya Patel", relation: "Brother of the Groom" },
    { name: "Riya Patel", relation: "Sister of the Groom" }
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

  const renderFamilyCard = (family: FamilyMember[], side: string, animation: string) => (
    <div className={`glass-card p-6 ${isVisible ? animation : 'opacity-0'}`}>
      <div className="text-center mb-4">
        <span className="inline-block py-1 px-3 bg-wedding-blush rounded-full text-xs text-wedding-maroon mb-2">
          {side} Family
        </span>
        <h3 className="font-playfair text-2xl text-wedding-maroon">
          {side === "Bride's" ? "Sharma Family" : "Patel Family"}
        </h3>
      </div>
      <div className="space-y-4">
        {family.map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-wedding-gold/20 flex items-center justify-center mb-2">
              <span className="text-wedding-gold text-xl font-playfair">{member.name.charAt(0)}</span>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-800">{member.name}</p>
              <p className="text-sm text-gray-600">{member.relation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="w-full py-12 bg-floral-pattern">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            With Blessings From
          </span>
          <h2 className="font-playfair text-3xl text-wedding-maroon">Our Families</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderFamilyCard(brideFamily, "Bride's", 'animate-slide-in-left')}
          {renderFamilyCard(groomFamily, "Groom's", 'animate-slide-in-right')}
        </div>
      </div>
    </section>
  );
};

export default FamilyDetails;
