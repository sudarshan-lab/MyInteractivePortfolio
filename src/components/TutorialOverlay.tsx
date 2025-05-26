import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon?: React.ReactNode;
  targetElement?: string;
  position?: 'top' | 'bottom';
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onNextStep: () => void;
  onSkip: () => void;
  steps: TutorialStep[];
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  isOpen,
  onClose,
  currentStep,
  onNextStep,
  onSkip,
  steps
}) => {
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState('bottom');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (!step.targetElement) {
        setTooltipPosition({
          top: '50%',
          left: '50%'
        });
        setArrowPosition('none');
        return;
      }

      const element = document.querySelector(step.targetElement);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipHeight = 200; // Approximate height of tooltip
      const tooltipWidth = isMobile ? viewportWidth - 40 : 300; // Full width on mobile minus padding
      
      let top, left;
      let newArrowPosition;

      if (isMobile) {
        // Mobile positioning
        if (rect.top > viewportHeight / 2) {
          // If element is in bottom half, show tooltip above
          top = Math.max(20, rect.top - tooltipHeight - 20);
          newArrowPosition = 'bottom';
        } else {
          // If element is in top half, show tooltip below
          top = Math.min(viewportHeight - tooltipHeight - 20, rect.bottom + 20);
          newArrowPosition = 'top';
        }
        left = 20; // 20px padding from edges
      } else {
        // Desktop positioning
        if (step.position === 'top') {
          top = rect.top - tooltipHeight - 20;
          newArrowPosition = 'bottom';
        } else {
          top = rect.bottom + 20;
          newArrowPosition = 'top';
        }

        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);

        // Keep tooltip within viewport bounds
        if (left < 20) left = 20;
        if (left + tooltipWidth > viewportWidth - 20) {
          left = viewportWidth - tooltipWidth - 20;
        }

        // Ensure tooltip is not too close to top or bottom of viewport
        if (top < 20) top = 20;
        if (top + tooltipHeight > viewportHeight - 20) {
          top = viewportHeight - tooltipHeight - 20;
        }
      }

      setTooltipPosition({ top, left });
      setArrowPosition(newArrowPosition);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step, currentStep, isMobile]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              position: 'absolute',
              top: typeof tooltipPosition.top === 'number' ? `${tooltipPosition.top}px` : tooltipPosition.top,
              left: typeof tooltipPosition.left === 'number' ? `${tooltipPosition.left}px` : tooltipPosition.left,
              transform: arrowPosition === 'none' ? 'translate(-50%, -50%)' : 'none',
              width: isMobile ? 'calc(100% - 40px)' : '300px'
            }}
            className="bg-dark-200 rounded-lg p-6 border border-white/10 shadow-xl"
          >
            {/* Arrow */}
            {arrowPosition !== 'none' && !isMobile && (
              <div
                className={`absolute w-4 h-4 bg-dark-200 transform rotate-45 ${
                  arrowPosition === 'top' ? '-top-2' : '-bottom-2'
                } left-1/2 -translate-x-1/2 border border-white/10`}
              />
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  {step.icon || <Sparkles size={16} className="text-white" />}
                </div>
                <h3 className="text-lg font-semibold text-white">Quick Tour</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">{step.title}</h4>
                <p className="text-gray-400">{step.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={onSkip}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Skip tutorial
                </button>
                <button
                  onClick={isLastStep ? onClose : onNextStep}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-lg text-white transition-colors shadow-lg"
                >
                  {isLastStep ? 'Get Started' : 'Next'}
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 mt-4">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-primary-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialOverlay;