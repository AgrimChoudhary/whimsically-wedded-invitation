
import React, { useEffect, useRef, useState } from 'react';
import { Heart, Music, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const FloatingPetals: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
      
      // Randomize petal colors slightly
      const hue = Math.random() > 0.7 ? 343 : 27; // Sometimes gold, mostly pink
      petal.style.backgroundImage = `radial-gradient(circle at 30% 30%, 
        hsl(${hue}, ${70 + Math.random() * 30}%, ${80 + Math.random() * 15}%) 0%, 
        hsl(${hue}, ${60 + Math.random() * 20}%, ${70 + Math.random() * 10}%) 100%)`;
      
      container.appendChild(petal);
      
      // Animate the petal falling
      const animationDuration = 15 + Math.random() * 15;
      petal.style.animation = `float-petals ${animationDuration}s linear forwards`;
      
      // Remove petal after animation completes
      setTimeout(() => {
        petal.remove();
      }, animationDuration * 1000);
    };
    
    // Create petals at intervals - less on mobile
    const interval = setInterval(createPetal, isMobile ? 3000 : 2000);
    
    // Initial petals - fewer on mobile
    for (let i = 0; i < (isMobile ? 3 : 5); i++) {
      setTimeout(createPetal, i * 1000);
    }
    
    return () => clearInterval(interval);
  }, [isMobile]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10" aria-hidden="true" />;
};

export const Confetti: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const colors = ['#FFDEE2', '#D4AF37', '#FEF7E5', '#E6E6FA', '#800020'];
    
    const createConfetti = () => {
      const particleCount = isMobile ? 30 : 50;
      
      for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random position, color, and shape
        const startPosX = Math.random() * window.innerWidth;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = Math.random() > 0.7 ? '50%' : (Math.random() > 0.5 ? '0%' : '25%');
        
        confetti.style.left = `${startPosX}px`;
        confetti.style.top = '0px';
        confetti.style.backgroundColor = color;
        confetti.style.borderRadius = shape;
        confetti.style.width = `${5 + Math.random() * 7}px`;
        confetti.style.height = `${5 + Math.random() * 7}px`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.5})`;
        
        container.appendChild(confetti);
        
        // More varied animation
        const animationDuration = 3 + Math.random() * 2;
        const swayAmount = 100 + Math.random() * 100;
        
        confetti.animate(
          [
            { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) translateX(${Math.random() > 0.5 ? swayAmount : -swayAmount}px) rotate(${720 + Math.random() * 720}deg)`, opacity: 0 }
          ],
          {
            duration: animationDuration * 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
            fill: 'forwards'
          }
        );
        
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
  }, [isActive, isMobile]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-20" aria-hidden="true" />;
};

interface MusicPlayerProps {
  audioSrc?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioSrc = "/wedding-music.mp3" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(audioSrc);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
        isPlaying 
          ? 'bg-wedding-gold/80 text-white shadow-gold-glow' 
          : 'bg-wedding-cream/80 text-wedding-gold shadow-gold-soft'
      } backdrop-blur-sm border border-wedding-gold/30`}
      aria-label={isPlaying ? "Pause Music" : "Play Music"}
    >
      <Music 
        size={18} 
        className={`transition-all duration-300 ${
          isPlaying ? 'scale-110' : 'scale-100'
        } ${isHovered ? 'animate-pulse-soft' : ''}`} 
      />
      {isPlaying && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-wedding-blush animate-pulse"></span>
      )}
    </button>
  );
};

export const FallingHearts: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const colors = ['#FFDEE2', '#FF9EAA', '#FF6B81', '#FF4766'];
    
    const createHeart = () => {
      const heartCount = isMobile ? 10 : 15;
      
      for (let i = 0; i < heartCount; i++) {
        // Create SVG heart with random colors
        const heart = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        heart.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5 12.572L12 20L4.5 12.572C3.25 11.335 2.5 9.607 2.5 7.786C2.5 4.358 5.187 1.5 8.5 1.5C10.289 1.5 11.893 2.215 13 3.357C14.107 2.215 15.711 1.5 17.5 1.5C20.813 1.5 23.5 4.358 23.5 7.786C23.5 9.607 22.75 11.335 21.5 12.572H19.5Z" fill="${color}" stroke="${color}" stroke-width="1"/>
        </svg>`;
        
        heart.style.position = 'absolute';
        heart.style.left = `${Math.random() * window.innerWidth}px`;
        heart.style.top = '0px';
        heart.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 1})`;
        heart.style.opacity = '0.9';
        heart.style.pointerEvents = 'none';
        heart.style.filter = 'drop-shadow(0 0 2px rgba(255,255,255,0.5))';
        
        container.appendChild(heart);
        
        // Add some stars occasionally
        if (Math.random() > 0.7) {
          const star = document.createElement('div');
          star.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#D4AF37" stroke="#D4AF37" stroke-width="1"/>
          </svg>`;
          
          star.style.position = 'absolute';
          star.style.left = `${Math.random() * window.innerWidth}px`;
          star.style.top = '0px';
          star.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.3 + Math.random() * 0.5})`;
          star.style.opacity = '0.7';
          star.style.pointerEvents = 'none';
          
          container.appendChild(star);
          
          // Animate star
          const starAnimationDuration = 2 + Math.random() * 3;
          star.animate(
            [
              { transform: `translateY(0) rotate(${Math.random() * 360}deg)`, opacity: 0.7 },
              { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ],
            {
              duration: starAnimationDuration * 1000,
              easing: 'ease-in-out',
              fill: 'forwards'
            }
          );
          
          // Remove after animation
          setTimeout(() => {
            star.remove();
          }, starAnimationDuration * 1000);
        }
        
        // Animate heart with more varied paths
        const animationDuration = 3 + Math.random() * 4;
        const swayAmount = 50 + Math.random() * 100;
        
        heart.animate(
          [
            { transform: `translateY(0) translateX(0) rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 1})`, opacity: 0.9 },
            { transform: `translateY(${window.innerHeight * 0.3}px) translateX(${Math.random() > 0.5 ? swayAmount/2 : -swayAmount/2}px) rotate(${Math.random() * 540}deg) scale(${0.7 + Math.random() * 0.6})`, opacity: 0.95 },
            { transform: `translateY(${window.innerHeight}px) translateX(${Math.random() > 0.5 ? swayAmount : -swayAmount}px) rotate(${Math.random() * 720}deg) scale(${0.3 + Math.random() * 0.3})`, opacity: 0 }
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
  }, [isActive, isMobile]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-20" aria-hidden="true" />;
};

// Twinkling stars background effect
export const TwinklingStars: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Create stars
    const createStars = () => {
      const starCount = isMobile ? 15 : 30;
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        
        // Random position and size
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const size = 1 + Math.random() * 3;
        
        star.style.position = 'absolute';
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.borderRadius = '50%';
        star.style.backgroundColor = Math.random() > 0.8 ? '#D4AF37' : '#FFFFFF';
        star.style.opacity = `${0.4 + Math.random() * 0.6}`;
        
        // Add twinkling animation with random delays
        const animationDuration = 2 + Math.random() * 3;
        const animationDelay = Math.random() * 5;
        
        star.style.animation = `twinkle ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
        
        container.appendChild(star);
      }
    };
    
    createStars();
    
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [isMobile]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-5" aria-hidden="true" />;
};
