import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';

interface ChatbotWelcomeBannerProps {
  onOpenChat: () => void;
  position?: 'bottom-right' | 'bottom-left';
}

const STORAGE_KEY = 'chatbot-banner-dismissed';
const DELAY_MS = 4000; // 4 seconds delay for returning visitors

export function ChatbotWelcomeBanner({ onOpenChat, position = 'bottom-right' }: ChatbotWelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const storageValue = localStorage.getItem(STORAGE_KEY);
    const wasDismissed = storageValue === 'dismissed';
    
    if (wasDismissed) {
      setHasCheckedStorage(true);
      return;
    }

    // Check if this is first visit (no storage entry at all)
    const isFirstVisit = storageValue === null;
    
    if (isFirstVisit) {
      // First visit: show immediately
      setHasCheckedStorage(true);
      setIsVisible(true);
      // Mark that we've shown it (but not dismissed)
      localStorage.setItem(STORAGE_KEY, 'shown');
    } else if (storageValue === 'shown') {
      // Returning visitor (was shown before but not dismissed): show after delay
      setHasCheckedStorage(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, DELAY_MS);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'dismissed');
  };

  const handleClick = () => {
    onOpenChat();
    handleDismiss();
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-24 right-4 md:bottom-28 md:right-6' 
    : 'bottom-24 left-4 md:bottom-28 md:left-6';

  if (!hasCheckedStorage || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed ${positionClasses} z-[9998] w-[calc(100vw-2rem)] md:w-[320px]`}
        >
          <div 
            className="relative p-4 rounded-lg shadow-lg border-2 cursor-pointer group"
            style={{ 
              backgroundColor: '#F3ECE3',
              borderColor: '#C8A19C'
            }}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }}
            aria-label="Open chat - Have questions? Chat with us!"
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-primary/20 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>

            {/* Content */}
            <div className="flex items-center gap-3 pr-6">
              <div className="flex-shrink-0">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#C8A19C' }}
                >
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Have questions?
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Chat with us!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
