import React from 'react';
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

  const getOverlayPosition = () => {
    const padding = 8;
    switch (step.position) {
      case 'top':
        return {
          top: rect.top - 80,
          left: rect.left + (rect.width / 2) - 150,
        };
      case 'bottom':
        return {
          top: rect.bottom + padding,
          left: rect.left + (rect.width / 2) - 150,
        };
      case 'left':
        return {
          top: rect.top + (rect.height / 2) - 40,
          left: rect.left - 320,
        };
      case 'right':
        return {
          top: rect.top + (rect.height / 2) - 40,
          left: rect.right + padding,
        };
    }
  };

  const position = getOverlayPosition();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute pointer-events-auto bg-dark-200 rounded-lg p-4 shadow-xl border border-primary-500/30 w-[300px]"
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