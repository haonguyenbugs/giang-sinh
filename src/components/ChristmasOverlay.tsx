import { useState, useEffect } from 'react';
import TypingText from './TypingText';

interface ChristmasOverlayProps {
  showSubtitle: boolean;
}

const ChristmasOverlay = ({ showSubtitle }: ChristmasOverlayProps) => {
  const [visibleText, setVisibleText] = useState(true);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    if (!showSubtitle) return;

    
    const fadeTimer = setTimeout(() => {
      setVisibleText(false);
    }, 6000);

    
    const typingTimer = setTimeout(() => {
      setShowTyping(true);
    }, 6800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(typingTimer);
    };
  }, [showSubtitle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col items-center">
      <div className="mt-12 md:mt-20 text-center"></div>

      <div className="absolute bottom-8 md:bottom-12 text-center">

        
        {visibleText && (
          <p
            className={`
              text-muted-foreground text-sm md:text-base opacity-0 animate-fade-in-up
              transition-opacity duration-800
            `}
            style={{ animationDelay: '5s', animationFillMode: 'forwards' }}
          >
            For Pham Thanh Trucccc
          </p>
        )}

        
        {showTyping && (
          <TypingText 
            text="Bạn, giáng sinh vui vẻ và có dáng xinh nhá:P"
            speed={70}
            className="text-muted-foreground text-sm md:text-base"
          />
        )}
      </div>
    </div>
  );
};

export default ChristmasOverlay;
