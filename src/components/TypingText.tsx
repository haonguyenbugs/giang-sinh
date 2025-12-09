import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypingText = ({ 
  text, 
  delay = 0, 
  speed = 100, 
  className = '',
  onComplete 
}: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timer);
    } else {
      onComplete?.();
      const cursorTimer = setTimeout(() => {
        setShowCursor(false);
      }, 2000);
      return () => clearTimeout(cursorTimer);
    }
  }, [displayedText, text, speed, isTyping, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && isTyping && (
        <span className="typing-cursor" />
      )}
    </span>
  );
};

export default TypingText;
