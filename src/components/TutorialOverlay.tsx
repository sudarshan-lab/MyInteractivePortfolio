import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon?: React.ReactNode;
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-200 rounded-lg p-6 max-w-sm w-full border border-white/10 shadow-xl"
          >
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