import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, X, MessageSquare } from 'lucide-react';
import { cn } from '../utils/cn';

interface UserAuthModalProps {
  onClose: () => void;
  onSubmit: (name: string, email: string) => void;
}

const UserAuthModal: React.FC<UserAuthModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    onSubmit(name, email);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-lg w-full max-w-md relative overflow-hidden border border-white/10 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-primary-700/10" />
        
       

        <div className="p-6 relative">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-4"
          >
            <MessageSquare size={24} className="text-white" />
          </motion.div>
          <motion.div className="absolute top-2 right-2 cursor-pointer">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors group cursor-pointer relative"
          >
            <X size={20} className="text-gray-400" />
          </motion.button>
        </motion.div>

          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
          >
            Join the Discussion
          </motion.h2>
          
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mb-6"
          >
            Connect with the me and share your thoughts & suggestions
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-lg",
                    "pl-10 pr-4 py-2",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                    "placeholder:text-gray-500 text-gray-200"
                  )}
                  placeholder="Enter your name"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-lg",
                    "pl-10 pr-4 py-2",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                    "placeholder:text-gray-500 text-gray-200"
                  )}
                  placeholder="Enter your email"
                />
              </div>
            </motion.div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-lg transition-all duration-300 shadow-lg font-medium"
            >
              Start Discussing
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserAuthModal;