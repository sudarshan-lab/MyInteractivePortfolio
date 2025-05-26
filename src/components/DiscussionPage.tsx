import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Lock, Send, Users, ArrowLeft, User, Mail, Eye, EyeOff, X } from 'lucide-react';
import { cn } from '../utils/cn';
import UserAuthModal from './UserAuthModal';

interface Message {
  id: string;
  content: string;
  sender: string;
  email: string;
  timestamp: Date;
  isPrivate: boolean;
}

interface UserData {
  name: string;
  email: string;
}

const DUMMY_MESSAGES: Message[] = [
  {
    id: '1',
    content: "Hey everyone! What's your favorite programming language?",
    sender: "Alice",
    email: "alice@example.com",
    timestamp: new Date('2024-03-10T10:00:00'),
    isPrivate: false
  },
  {
    id: '2',
    content: "I'm working on a React project, anyone interested in collaborating?",
    sender: "Bob",
    email: "bob@example.com",
    timestamp: new Date('2024-03-10T11:30:00'),
    isPrivate: false
  },
  {
    id: '3',
    content: "Private message about the project details.",
    sender: "Charlie",
    email: "charlie@example.com",
    timestamp: new Date('2024-03-10T12:15:00'),
    isPrivate: true
  }
];

const PRIVATE_KEY_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';

const messageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const Tooltip: React.FC<{ content: string }> = ({ content }) => (
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-300 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
    {content}
  </div>
);

const DiscussionPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuthModal, setShowAuthModal] = useState(!localStorage.getItem('userData'));
  const [showPrivateMessages, setShowPrivateMessages] = useState(() => {
    return localStorage.getItem('showPrivateMessages') !== 'false';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      setMessages(DUMMY_MESSAGES);
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('showPrivateMessages', showPrivateMessages.toString());
  }, [showPrivateMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const hashString = async (str: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handlePrivateKeySubmit = async () => {
    const hashedKey = await hashString(privateKey);
    if (hashedKey === PRIVATE_KEY_HASH) {
      setIsAuthenticated(true);
      setShowPrivateKeyModal(false);
    } else {
      alert('Invalid private key');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !userData) return;

    const newMsg: Message = {
      id: Math.random().toString(),
      content: newMessage,
      sender: userData.name,
      email: userData.email,
      timestamp: new Date(),
      isPrivate: isPrivate
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUserAuth = (name: string, email: string) => {
    const newUserData = { name, email };
    setUserData(newUserData);
    localStorage.setItem('userData', JSON.stringify(newUserData));
    setShowAuthModal(false);
  };

  const filteredMessages = messages.filter(msg => 
    !msg.isPrivate || (msg.isPrivate && isAuthenticated && showPrivateMessages)
  );

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!userData) {
    return (
      <AnimatePresence>
        {showAuthModal && (
          <UserAuthModal
            onClose={onClose}
            onSubmit={handleUserAuth}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-dark-100/95 to-dark-300/95 backdrop-blur-xl z-50 flex flex-col"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-dark-200/50 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/5 rounded-full transition-colors group relative"
            >
              <ArrowLeft size={16} className="text-primary-400 sm:hidden" />
              <ArrowLeft size={20} className="text-primary-400 hidden sm:block" />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full">
                <MessageSquare size={14} className="text-white sm:hidden" />
                <MessageSquare size={18} className="text-white hidden sm:block" />
              </div>
              <h2 className="text-base sm:text-xl font-semibold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Community
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPrivateMessages(!showPrivateMessages)}
                className="group relative p-1.5 sm:p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                {showPrivateMessages ? (
                  <Eye size={16} className="text-primary-400 sm:hidden" />
                  <Eye size={20} className="text-primary-400 hidden sm:block" />
                ) : (
                  <EyeOff size={16} className="text-gray-400 sm:hidden" />
                  <EyeOff size={20} className="text-gray-400 hidden sm:block" />
                )}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPrivateKeyModal(true)}
              className={cn(
                "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 group relative",
                isAuthenticated 
                  ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                  : "bg-white/5 hover:bg-white/10 border border-white/10"
              )}
            >
              <Lock size={14} className="sm:hidden" />
              <Lock size={16} className="hidden sm:block" />
              <span className="text-sm">
                {isAuthenticated ? 'Auth' : 'Private'}
              </span>
            </motion.button>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence initial={false}>
            {filteredMessages.map((msg, index) => {
              const showDate = index === 0 || 
                formatDate(msg.timestamp) !== formatDate(filteredMessages[index - 1].timestamp);

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-center my-4"
                    >
                      <span className="text-xs text-gray-400 bg-dark-200/50 px-3 py-1 rounded-full">
                        {formatDate(msg.timestamp)}
                      </span>
                    </motion.div>
                  )}
                  <motion.div
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="group relative pl-12 pr-4 py-1 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <div className="absolute left-4 top-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-medium">
                        {msg.sender[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-white group relative">
                        {msg.sender}
                        <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-dark-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {msg.email}
                        </div>
                      </span>
                      <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                      {msg.isPrivate && (
                        <div className="group relative">
                          <Lock size={12} className="text-primary-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-200 mt-1">{msg.content}</p>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 border-t border-white/10 bg-dark-200/50 backdrop-blur-xl"
        >
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPrivate(!isPrivate)}
              className={cn(
                "p-2 rounded-full transition-all duration-300 group relative",
                isPrivate 
                  ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                  : "bg-white/5 hover:bg-white/10 border border-white/10"
              )}
            >
              {isPrivate ? <Lock size={20} /> : <Users size={20} />}
            </motion.button>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none h-10 max-h-32 placeholder:text-gray-500"
              style={{ height: 'auto' }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:hover:from-primary-600 disabled:hover:to-primary-700 rounded-full transition-all duration-300 shadow-lg group relative"
            >
              <Send size={20} className="text-white" />
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showPrivateKeyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-dark-200 p-6 rounded-lg w-full max-w-md border border-white/10 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                    Enter Private Key
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPrivateKeyModal(false)}
                    className="p-1 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </motion.button>
                </div>
                <input
                  type="password"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-lg",
                    "px-4 py-2 mb-4",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                    "placeholder:text-gray-500 text-gray-200"
                  )}
                  placeholder="Enter private key..."
                />
                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPrivateKeyModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrivateKeySubmit}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-lg transition-colors shadow-lg"
                  >
                    Submit
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default DiscussionPage;