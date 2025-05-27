import React, { useEffect, useState } from 'react';
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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const step = steps[currentStep];
  if (!step) return null;

  const calculatePosition = () => {
    const targetElement = document.querySelector(step.target);
    if (!targetElement) return null;

    const rect = targetElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const overlayWidth = viewportWidth < 640 ? Math.min(280, viewportWidth - 32) : 300;
    const overlayHeight = 120;
    const padding = 16;

    let newPosition = { top: 0, left: 0 };

    const calculateForPosition = (pos: 'top' | 'bottom' | 'left' | 'right') => {
      switch (pos) {
        case 'top':
          return {
            top: rect.top - overlayHeight - padding,
            left: Math.min(
              Math.max(padding, rect.left + (rect.width / 2) - (overlayWidth / 2)),
              viewportWidth - overlayWidth - padding
            ),
          };
        case 'bottom':
          return {
            top: rect.bottom + padding,
            left: Math.min(
              Math.max(padding, rect.left + (rect.width / 2) - (overlayWidth / 2)),
              viewportWidth - overlayWidth - padding
            ),
          };
        case 'left':
          return {
            top: Math.min(
              Math.max(padding, rect.top + (rect.height / 2) - (overlayHeight / 2)),
              viewportHeight - overlayHeight - padding
            ),
            left: rect.left - overlayWidth - padding,
          };
        case 'right':
          return {
            top: Math.min(
              Math.max(padding, rect.top + (rect.height / 2) - (overlayHeight / 2)),
              viewportHeight - overlayHeight - padding
            ),
            left: rect.right + padding,
          };
      }
    };

    // Try original position first
    newPosition = calculateForPosition(step.position);

    // Check if overlay would be cut off and adjust if necessary
    if (step.position === 'top' && newPosition.top < padding) {
      newPosition = calculateForPosition('bottom');
    } else if (step.position === 'bottom' && newPosition.top + overlayHeight > viewportHeight - padding) {
      newPosition = calculateForPosition('top');
    } else if (step.position === 'left' && newPosition.left < padding) {
      newPosition = calculateForPosition('right');
    } else if (step.position === 'right' && newPosition.left + overlayWidth > viewportWidth - padding) {
      newPosition = calculateForPosition('left');
    }

    // Final boundary check
    newPosition.left = Math.max(padding, Math.min(newPosition.left, viewportWidth - overlayWidth - padding));
    newPosition.top = Math.max(padding, Math.min(newPosition.top, viewportHeight - overlayHeight - padding));

    return newPosition;
  };

  useEffect(() => {
    const updatePosition = () => {
      const newPosition = calculatePosition();
      if (newPosition) {
        setPosition(newPosition);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, step.position]);

  const targetElement = document.querySelector(step.target);
  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();

  return (
    <div className="fixed inset-0 z-50 touch-none">
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
        className="absolute bg-dark-200 rounded-lg p-4 shadow-xl border border-primary-500/30 w-[280px] sm:w-[300px]"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
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
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-full text-sm text-white transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorialOverlay;