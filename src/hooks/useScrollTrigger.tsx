
import { useState, useEffect, useRef } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollTrigger = (options: UseScrollTriggerOptions = {}) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger when element is in the middle of the viewport
        if (entry.isIntersecting && entry.intersectionRatio >= (options.threshold || 0.5)) {
          setIsTriggered(true);
        }
      },
      {
        threshold: options.threshold || 0.5,
        rootMargin: options.rootMargin || '-25% 0px -25% 0px', // Middle section of viewport
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin]);

  return { isTriggered, elementRef };
};
