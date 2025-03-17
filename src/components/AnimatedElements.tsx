
import React, { useState, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

interface PetalProps {
  key: number;
  style: React.CSSProperties;
}

interface ConfettiProps {
  isActive: boolean;
}

interface FallingHeartsProps {
  isActive: boolean;
}

// Create floating petals component
export const FloatingPetals: React.FC = () => {
  const [petals, setPetals] = useState<PetalProps[]>([]);
  
  useEffect(() => {
    const createPetal = () => {
      const petal: PetalProps = {
        key: Date.now(),
        style: {
          left: `${Math.random() * 100}vw`,
          animationDuration: `${10 + Math.random() * 15}s`,
          opacity: Math.random() * 0.6 + 0.2,
          transform: `rotate(${Math.random() * 360}deg)`,
          animationDelay: `${Math.random() * 5}s`,
        },
      };
      
      setPetals(prev => [...prev, petal]);
      
      // Remove petal after animation completes
      setTimeout(() => {
        setPetals(prev => prev.filter(p => p.key !== petal.key));
      }, 25000); // Slightly longer than animation to ensure completion
    };
    
    // Create initial petals
    for (let i = 0; i < 15; i++) {
      createPetal();
    }
    
    // Add new petals periodically
    const interval = setInterval(createPetal, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.key}
          className="petal animate-float-petals"
          style={petal.style}
        />
      ))}
    </div>
  );
};

// Create music player component
export const MusicPlayer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [audio] = useState(new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"));
  
  useEffect(() => {
    // Set audio properties
    audio.loop = true;
    audio.volume = 0.3;
    
    // Play audio
    const playPromise = audio.play();
    
    // Handle play promise rejection (autoplay policies)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Audio play prevented by browser", error);
      });
    }
    
    // Hide music player after a few seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    
    return () => {
      audio.pause();
      clearTimeout(timer);
    };
  }, [audio]);
  
  useEffect(() => {
    // Show music player on hover near the bottom right
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Show when mouse is near bottom right corner
      if (e.clientX > windowWidth - 200 && e.clientY > windowHeight - 200) {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-20 transition-opacity duration-500 pointer-events-none ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center bg-wedding-gold/10 backdrop-blur-sm rounded-full py-1 px-3 border border-wedding-gold/30 shadow-gold-soft">
        <Music size={14} className="text-wedding-gold animate-pulse-soft mr-2" />
        <span className="text-xs text-wedding-gold font-dancing-script">Wedding Music Playing</span>
      </div>
    </div>
  );
};

// Create confetti component
export const Confetti: React.FC<ConfettiProps> = ({ isActive }) => {
  const [confetti, setConfetti] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  
  useEffect(() => {
    if (isActive) {
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}vw`,
          top: '0',
          backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
          width: `${Math.random() * 8 + 5}px`,
          height: `${Math.random() * 8 + 5}px`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 0.5}s`,
        },
      }));
      
      setConfetti(newConfetti);
      
      // Clear confetti after animations
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {confetti.map((item) => (
        <div
          key={item.id}
          className="confetti animate-confetti"
          style={item.style}
        />
      ))}
    </div>
  );
};

// Create falling hearts component
export const FallingHearts: React.FC<FallingHeartsProps> = ({ isActive }) => {
  const [hearts, setHearts] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  
  useEffect(() => {
    if (isActive) {
      const newHearts = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}vw`,
          top: `-${Math.random() * 20}px`,
          opacity: Math.random() * 0.7 + 0.3,
          fontSize: `${Math.random() * 20 + 10}px`,
          animationDuration: `${Math.random() * 4 + 3}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        },
      }));
      
      setHearts(newHearts);
      
      // Clear hearts after animations
      const timer = setTimeout(() => {
        setHearts([]);
      }, 7000);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-wedding-blush animate-fall-heart"
          style={heart.style}
        >
          ❤
        </div>
      ))}
    </div>
  );
};
