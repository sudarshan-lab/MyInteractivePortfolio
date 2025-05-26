import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Laptop } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const messages = [
    "Loading Portfolio",
    "Almost Done",
    "Opening"
  ];
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-100 flex flex-col items-center justify-center z-50"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg blur-xl opacity-50" />
          <div className="relative bg-dark-200 p-6 rounded-lg border border-white/10">
            <Code size={32} className="text-primary-400" />
          </div>
        </motion.div>
        
        <motion.div
          animate={{
            y: [-4, 4, -4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-12 top-0"
        >
          <div className="bg-dark-200 p-4 rounded-lg border border-white/10">
            <Terminal size={24} className="text-primary-400" />
          </div>
        </motion.div>
        
        <motion.div
          animate={{
            y: [4, -4, 4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-12 top-0"
        >
          <div className="bg-dark-200 p-4 rounded-lg border border-white/10">
            <Laptop size={24} className="text-primary-400" />
          </div>
        </motion.div>
      </div>
      
      <div className="mt-8 text-center">
        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-semibold text-white"
        >
          {messages[currentMessageIndex]}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-1 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-primary-400"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;