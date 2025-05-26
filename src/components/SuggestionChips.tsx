import React from 'react';
import { useChat } from '../context/ChatContext';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

interface SuggestionChipsProps {
  large?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ large = false }) => {
  const { sendMessage } = useChat();
  
  const suggestions = [
    "Tell me about yourself",
    "Education",
    "Technical skills & projects",
    "Your resume",
    "Connect with me"
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-2"
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendMessage(suggestion)}
          className={cn(
            "chip relative overflow-hidden",
            large 
              ? "bg-gradient-to-r from-primary-600/20 to-primary-700/20 hover:from-primary-600/30 hover:to-primary-700/30 text-white px-4 py-2 text-base" 
              : "bg-gradient-to-r from-dark-300/50 to-dark-400/50 hover:from-dark-300/70 hover:to-dark-400/70 text-gray-200",
            "backdrop-blur-sm border border-white/10"
          )}
        >
          {suggestion}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-[-200%] animate-shimmer" />
        </motion.button>
      ))}
    </motion.div>
  );
};

export default SuggestionChips;