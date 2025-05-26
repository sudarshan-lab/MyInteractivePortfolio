import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, X } from 'lucide-react';
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-dark-200 rounded-lg w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-2 right-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-300 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Discussions</h2>
          <p className="text-gray-400 mb-6">Please enter your details to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "w-full bg-dark-300 border border-dark-400 rounded-lg",
                    "pl-10 pr-4 py-2",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500",
                    "placeholder:text-gray-500"
                  )}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full bg-dark-300 border border-dark-400 rounded-lg",
                    "pl-10 pr-4 py-2",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500",
                    "placeholder:text-gray-500"
                  )}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserAuthModal;