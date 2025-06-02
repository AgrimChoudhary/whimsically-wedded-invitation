
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { FloatingPetals } from '@/components/AnimatedElements';
import ManageEvents from '@/components/ManageEvents';

const ManageEventsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pattern-background">
      <FloatingPetals />
      
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/guest-management')}
            className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Guest Management
          </Button>
        </div>
        
        <div className="glass-card p-6">
          <ManageEvents />
        </div>
      </div>
    </div>
  );
};

export default ManageEventsPage;
