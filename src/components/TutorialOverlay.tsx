import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TutorialStep {
  target: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialOverlayProps {
  currentStep: number;
  steps: TutorialStep[];
  onNext: () => void;
  onComplete: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  currentStep,
  steps,
  onNext,
  onComplete,
}) => {
  const step = steps[currentStep];
  if (!step) return null;

  const targetElement = document.querySelector(step.target);
  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const getOverlayPosition = () => {
    const overlayWidth = 300;
    const overlayHeight = 120;
    const padding = 16;
    let position = { top: 0, left: 0 };

    switch (step.position) {
      case 'top':
        position = {
          top: rect.top - overlayHeight - padding,
          left: rect.left + (rect.width / 2) - (overlayWidth / 2),
        };
        // Adjust if too close to top
        if (position.top < padding) {
          return getOverlayPosition('bottom');
        }
        break;
      case 'bottom':
        position = {
          top: rect.bottom + padding,
          left: rect.left + (rect.width / 2) - (overlayWidth / 2),
        };
        // Adjust if too close to bottom
        if (position.top + overlayHeight > viewportHeight - padding) {
          return getOverlayPosition('top');
        }
        break;
      case 'left':
        position = {
          top: rect.top + (rect.height / 2) - (overlayHeight / 2),
          left: rect.left - overlayWidth - padding,
        };
        // Adjust if too close to left
        if (position.left < padding) {
          return getOverlayPosition('right');
        }
        break;
      case 'right':
        position = {
          top: rect.top + (rect.height / 2) - (overlayHeight / 2),
          left: rect.right + padding,
        };
        // Adjust if too close to right
        if (position.left + overlayWidth > viewportWidth - padding) {
          return getOverlayPosition('left');
        }
        break;
    }

    // Ensure overlay stays within viewport bounds
    position.left = Math.max(padding, Math.min(position.left, viewportWidth - overlayWidth - padding));
    position.top = Math.max(padding, Math.min(position.top, viewportHeight - overlayHeight - padding));

    return position;
  };

  const position = getOverlayPosition();

  useEffect(() => {
    const handleResize = () => {
      // Force re-render on resize to recalculate positions
      onNext();
      onNext();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onNext]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" />
      
      <div 
        className="absolute"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
        }}
      >
        <div className="absolute inset-0 bg-primary-500/20 rounded-lg border-2 border-primary-500 animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute bg-dark-200 rounded-lg p-4 shadow-xl border border-primary-500/30 w-[300px]"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        <button
          onClick={onComplete}
          className="absolute top-2 right-2 p-1 hover:bg-white/5 rounded-full transition-colors"
        >
          <X size={16} className="text-gray-400" />
        </button>

        <p className="text-white mb-4">{step.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-primary-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={currentStep === steps.length - 1 ? onComplete : onNext}
            className="px-4 py-1 bg-primary-500 hover:bg-primary-600 rounded-full text-sm text-white transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorialOverlay;