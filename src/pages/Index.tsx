
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FloatingPetals } from '@/components/AnimatedElements';
import { Sparkles, Calendar, Heart, User } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full pattern-background">
      <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
        <FloatingPetals />
        
        <header className="w-full py-4 px-6 flex justify-between z-10">
          <div className="flex items-center">
            <Heart size={24} className="text-wedding-maroon mr-2" />
            <span className="font-dancing-script text-2xl text-wedding-maroon">Forever</span>
          </div>
          <nav>
            <Button 
              variant="ghost" 
              className="text-wedding-maroon hover:bg-wedding-gold/10"
              onClick={() => navigate('/profile')}
            >
              <User size={18} className="mr-2" />
              My Profile
            </Button>
          </nav>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-dancing-script text-5xl md:text-7xl text-wedding-maroon mb-6">
              Digital Wedding Invitations
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Create beautiful digital wedding invitations to share your special day with loved ones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/customize')}
                className="bg-wedding-gold hover:bg-wedding-deep-gold text-white px-8 py-6 rounded-full"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your Invitation
              </Button>
              
              <Button 
                variant="outline" 
                className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-gold/10 px-8 py-6 rounded-full"
                onClick={() => navigate('/profile')}
              >
                <Calendar className="mr-2 h-5 w-5" />
                View Templates
              </Button>
            </div>
          </div>
        </main>
        
        <footer className="w-full py-5 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Digital Wedding Invitations</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
