import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';

export type NotificationType = 'success' | 'error';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={cn(
        "fixed bottom-4 right-4 max-w-sm w-full p-4 rounded-lg shadow-lg z-50 flex items-center gap-3",
        type === 'success' ? "bg-green-600/20 border border-green-500/30" : "bg-red-600/20 border border-red-500/30"
      )}
    >
      {type === 'success' ? (
        <CheckCircle className="text-green-500\" size={20} />
      ) : (
        <AlertCircle className="text-red-500" size={20} />
      )}
      <p className={cn(
        "flex-1 text-sm",
        type === 'success' ? "text-green-400" : "text-red-400"
      )}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={cn(
          "p-1 rounded-full transition-colors",
          type === 'success' 
            ? "hover:bg-green-500/20 text-green-400" 
            : "hover:bg-red-500/20 text-red-400"
        )}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Notification;