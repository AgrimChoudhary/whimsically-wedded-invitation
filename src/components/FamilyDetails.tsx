
import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Star, Users, User, UserRound, Heart, X, ChevronRight, PlusCircle, Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

export interface FamilyMember {
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

interface FamilyDetailsProps {
  brideFamily?: {
    title?: string;
    members?: FamilyMember[];
  };
  groomFamily?: {
    title?: string;
    members?: FamilyMember[];
  };
}

const FamilyDetails: React.FC<FamilyDetailsProps> = ({ 
  brideFamily = {
    title: "Bride's Family",
    members: []
  }, 
  groomFamily = {
    title: "Groom's Family",
    members: []
  }
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pulseHint, setPulseHint] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Default bride family members if none provided
  const defaultBrideFamily: FamilyMember[] = [
    { 
      name: "Mr. Mangilal Sharma & Mrs. Lohri Devi", 
      relation: "Parents (Bride)",
      image: "https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f",
      description: ""
    }
  ];
  
  // Default groom family members if none provided
  const defaultGroomFamily: FamilyMember[] = [
    { 
      name: "Mrs. Lalita Devi & Mr. Tejram Sharma", 
      relation: "Parents (Groom)",
      image: "https://images.unsplash.com/photo-1604849329114-a8c9f4e4b926",
      description: ""
    }
  ];
  
  // Use provided family members or fallback to defaults
  const brideFamilyMembers = brideFamily.members && brideFamily.members.length > 0 
    ? brideFamily.members 
    : defaultBrideFamily;
    
  const groomFamilyMembers = groomFamily.members && groomFamily.members.length > 0
    ? groomFamily.members
    : defaultGroomFamily;
  
  // Auto hide pulse effect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPulseHint(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (side: string) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay: side === "Groom's" ? 0.2 : 0.4,
        ease: "easeOut"
      }
    }),
    hover: { 
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  const FamilyCard: React.FC<FamilyDetailProps> = ({ side, title, members }) => (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div 
          className="glass-card p-4 sm:p-6 cursor-pointer relative overflow-hidden rounded-lg border border-wedding-gold/20"
          variants={cardVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          whileHover="hover"
          whileTap="tap"
          custom={side}
        >
          <div className="text-center mb-3">
            <span className="inline-block py-1 px-2 bg-wedding-blush rounded-full text-xs text-wedding-maroon mb-1">
              {side} Family
            </span>
            <h3 className="font-kruti text-xl sm:text-2xl text-wedding-maroon">
              {title}
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-wedding-gold/10 flex items-center justify-center mb-2 border border-wedding-gold/20">
                <Users size={24} className="text-wedding-gold" />
              </div>
              <div className="text-center">
                <p className="font-medium font-kruti text-gray-800 text-sm sm:text-base">
                  {members.length > 0 ? members[0].name : "Family Members"}
                </p>
                <p className="font-kruti text-xs sm:text-sm text-gray-600">
                  {members.length > 0 ? members[0].relation : ""}
                </p>
              </div>
            </div>
            
            {/* Interactive button with animation to show it's clickable */}
            <div className="text-center mt-4 relative">
              <div className={`inline-flex items-center gap-1 bg-wedding-blush/70 py-1 px-3 rounded-full cursor-pointer text-wedding-maroon text-sm font-medium transition-all hover:bg-wedding-blush/90 ${pulseHint ? 'animate-pulse' : ''}`}>
                <Info size={14} className="text-wedding-maroon" />
                <span>View Family Details</span>
                <ChevronRight size={14} className="text-wedding-maroon" />
              </div>
              {pulseHint && (
                <div className="absolute -right-2 -top-2 w-4 h-4 bg-wedding-gold rounded-full animate-ping opacity-75"></div>
              )}
            </div>
          </div>
          
          {/* Visual indicator that it's clickable */}
          <div className="absolute bottom-2 right-2 opacity-70">
            <PlusCircle size={16} className="text-wedding-gold" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-wedding-gold/30"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-wedding-gold/30"></div>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl glass-card border-wedding-gold/30">
        <DialogHeader className="relative">
          <DialogTitle className="text-center pt-2">
            <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
              {side} Family
            </span>
            <h3 className="font-kruti text-xl sm:text-2xl text-wedding-maroon">{title}</h3>
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
                <p className="font-medium font-kruti text-gray-800 text-sm sm:text-base">{member.name}</p>
                <p className="font-kruti text-xs sm:text-sm text-gray-600 mb-1">{member.relation}</p>
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
          
          {/* Added hint about clicking to see more details */}
          <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
            <Info size={12} /> 
            Click on cards to view more family members
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <FamilyCard 
            side="Groom's" 
            title={groomFamily.title || "Groom's Family"} 
            members={groomFamilyMembers} 
          />
          <FamilyCard 
            side="Bride's" 
            title={brideFamily.title || "Bride's Family"} 
            members={brideFamilyMembers} 
          />
        </div>
      </div>
    </section>
  );
};

export default FamilyDetails;
