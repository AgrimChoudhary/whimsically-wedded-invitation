
import React, { useState } from 'react';
import FamilyMemberCard from './FamilyMemberCard';
import { ChevronDown, Heart, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

interface FamilyMember {
  name: string;
  relation: string;
  image?: string;
  description?: string;
}

interface FamilyData {
  title: string;
  members: FamilyMember[];
}

interface FamilyDetailsProps {
  groomFamily: FamilyData;
  brideFamily: FamilyData;
}

const FamilyDetails: React.FC<FamilyDetailsProps> = ({ groomFamily, brideFamily }) => {
  const [selectedFamily, setSelectedFamily] = useState<FamilyData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShowFamily = (family: FamilyData) => {
    setSelectedFamily(family);
    setIsDialogOpen(true);
  };

  return (
    <section className="w-full py-16 bg-wedding-cream/10">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-dancing-script text-3xl sm:text-4xl text-wedding-maroon mb-3">Our Families</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Meet the wonderful families who raised us and are joining in our celebration
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <div className="w-2 h-2 rounded-full bg-wedding-gold/40 animate-pulse"></div>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Groom's Family Card */}
          <motion.div 
            className="relative rounded-xl overflow-hidden glass-card cursor-pointer group"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleShowFamily(groomFamily)}
          >
            <div className="p-6">
              <FamilyMemberCard
                title={groomFamily.title}
                description={`Tap to meet ${groomFamily.members.length > 1 ? 'the members' : 'a member'} of the groom's family`}
                imageUrl={groomFamily.members[0]?.image || "/placeholder.svg"}
              />
              <div className="mt-4 flex items-center justify-center">
                <Badge variant="outline" className="bg-wedding-gold/10 text-wedding-maroon border-wedding-gold/20 group-hover:bg-wedding-gold/20 transition-colors">
                  <Users size={14} className="mr-1" /> View Family Details
                </Badge>
              </div>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <ChevronDown size={20} className="text-wedding-gold/60 animate-bounce" />
              </div>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 border-2 border-wedding-gold/0 rounded-xl group-hover:border-wedding-gold/20 pointer-events-none transition-all duration-300"></div>
          </motion.div>

          {/* Bride's Family Card */}
          <motion.div 
            className="relative rounded-xl overflow-hidden glass-card cursor-pointer group"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleShowFamily(brideFamily)}
          >
            <div className="p-6">
              <FamilyMemberCard
                title={brideFamily.title}
                description={`Tap to meet ${brideFamily.members.length > 1 ? 'the members' : 'a member'} of the bride's family`}
                imageUrl={brideFamily.members[0]?.image || "/placeholder.svg"}
              />
              <div className="mt-4 flex items-center justify-center">
                <Badge variant="outline" className="bg-wedding-gold/10 text-wedding-maroon border-wedding-gold/20 group-hover:bg-wedding-gold/20 transition-colors">
                  <Users size={14} className="mr-1" /> View Family Details
                </Badge>
              </div>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <ChevronDown size={20} className="text-wedding-gold/60 animate-bounce" />
              </div>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 border-2 border-wedding-gold/0 rounded-xl group-hover:border-wedding-gold/20 pointer-events-none transition-all duration-300"></div>
          </motion.div>
        </div>

        {/* Family Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-wedding-gold/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-dancing-script text-wedding-maroon flex items-center justify-center gap-2">
                <Heart size={16} className="text-wedding-gold" /> {selectedFamily?.title} <Heart size={16} className="text-wedding-gold" />
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                With love and blessings for our special day
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-6 mt-4 max-h-[60vh] overflow-y-auto pr-1">
              {selectedFamily?.members.map((member, index) => (
                <div key={index} className="bg-white/80 rounded-lg shadow-sm p-4 border border-wedding-gold/10">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-wedding-gold/20">
                      <AspectRatio ratio={1} className="bg-wedding-cream/50">
                        <img 
                          src={member.image || "/placeholder.svg"} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-playfair text-lg text-wedding-maroon">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.relation}</p>
                      {member.description && (
                        <p className="text-xs text-gray-500 mt-2">{member.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default FamilyDetails;
