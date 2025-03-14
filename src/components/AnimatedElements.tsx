
import React, { useEffect, useRef } from 'react';
import { Heart, Music } from 'lucide-react';

export const FloatingPetals: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const createPetal = () => {
      const petal = document.createElement('div');
      petal.classList.add('petal');
      
      // Random starting position across the top
      const startPosX = Math.random() * window.innerWidth;
      
      // Set petal styles
      petal.style.left = `${startPosX}px`;
      petal.style.top = '0px';
      petal.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.5})`;
      petal.style.opacity = `${0.5 + Math.random() * 0.5}`;
      
      container.appendChild(petal);
      
      // Animate the petal falling
      const animationDuration = 15 + Math.random() * 15;
      petal.style.animation = `float-petals ${animationDuration}s linear forwards`;
      
      // Remove petal after animation completes
      setTimeout(() => {
        petal.remove();
      }, animationDuration * 1000);
    };
    
    // Create petals at intervals
    const interval = setInterval(createPetal, 2000);
    
    // Initial petals
    for (let i = 0; i < 5; i++) {
      setTimeout(createPetal, i * 1000);
    }
    
    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10" aria-hidden="true" />;
};

export const Confetti: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const colors = ['#FFDEE2', '#D4AF37', '#FEF7E5', '#E6E6FA', '#800020'];
    
    const createConfetti = () => {
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random position, color, and shape
        const startPosX = Math.random() * window.innerWidth;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = Math.random() > 0.5 ? '50%' : '0%';
        
        confetti.style.left = `${startPosX}px`;
        confetti.style.top = '0px';
        confetti.style.backgroundColor = color;
        confetti.style.borderRadius = shape;
        confetti.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.5})`;
        
        container.appendChild(confetti);
        
        // Animate
        const animationDuration = 3 + Math.random() * 2;
        confetti.style.animation = `confetti ${animationDuration}s linear forwards`;
        
        // Remove after animation
        setTimeout(() => {
          confetti.remove();
        }, animationDuration * 1000);
      }
    };
    
    createConfetti();
    
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [isActive]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-20" aria-hidden="true" />;
};

interface MusicPlayerProps {
  audioSrc?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioSrc = "/wedding-music.mp3" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(audioSrc);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      onClick={togglePlay}
      className="fixed bottom-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-wedding-cream border border-wedding-gold shadow-gold-soft transition-all duration-300 hover:shadow-gold-glow"
      aria-label={isPlaying ? "Pause Music" : "Play Music"}
    >
      <Music 
        size={18} 
        className={`text-wedding-gold transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-70'}`} 
      />
    </button>
  );
};

export const FallingHearts: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    
    const createHeart = () => {
      for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.5 12.572L12 20L4.5 12.572C3.25 11.335 2.5 9.607 2.5 7.786C2.5 4.358 5.187 1.5 8.5 1.5C10.289 1.5 11.893 2.215 13 3.357C14.107 2.215 15.711 1.5 17.5 1.5C20.813 1.5 23.5 4.358 23.5 7.786C23.5 9.607 22.75 11.335 21.5 12.572H19.5Z" fill="#FFDEE2" stroke="#FFDEE2" stroke-width="1"/></svg>';
        heart.style.position = 'absolute';
        heart.style.left = `${Math.random() * window.innerWidth}px`;
        heart.style.top = '0px';
        heart.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.5})`;
        heart.style.opacity = '0.8';
        heart.style.pointerEvents = 'none';
        
        container.appendChild(heart);
        
        // Animate
        const animationDuration = 3 + Math.random() * 4;
        heart.animate(
          [
            { transform: `translateY(0) rotate(${Math.random() * 360}deg)`, opacity: 0.8 },
            { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
          ],
          {
            duration: animationDuration * 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
          }
        );
        
        // Remove after animation
        setTimeout(() => {
          heart.remove();
        }, animationDuration * 1000);
      }
    };
    
    createHeart();
    
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [isActive]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-20" aria-hidden="true" />;
};
