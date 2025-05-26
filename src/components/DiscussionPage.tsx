import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Send, Users, ArrowLeft, Eye, EyeOff, X, MessageSquare } from 'lucide-react';
import { cn } from '../utils/cn';
import UserAuthModal from './UserAuthModal';
import axios from 'axios';
import { API_BASE_URL } from '../utils'; 
import Notification from './Notification';

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

const PRIVATE_KEY_HASH = import.meta.env.VITE_HASH;

const messageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

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
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      axios.get(API_BASE_URL+'/api/messages')
      .then(res => {
        setMessages(res.data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      })
      .catch(err => {
        console.error('Failed to fetch messages:', err);
      });
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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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
      setNotification({
        type: 'success',
        message: 'Successfully authenticated for private access'
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Invalid private key'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userData) return;
  
    const newMsg = {
      content: newMessage,
      sender: userData.name,
      email: userData.email,
      isPrivate: isPrivate
    };
  
    try {
      const res = await axios.post(API_BASE_URL+'/api/messages', newMsg);
      setMessages(prev => [...prev, {
        ...res.data,
        timestamp: new Date(res.data.timestamp)
      }]);
      setNewMessage('');

      if (isPrivate) {
        setNotification({
          type: 'success',
          message: 'Private message sent successfully'
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Failed to send message'
      });
    }
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
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between p-3 sm:p-4 border-b border-white/10 bg-dark-200/50 backdrop-blur-xl z-10"
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/5 rounded-full transition-colors group relative"
            >
              <ArrowLeft size={18} className="text-primary-400" />
            </motion.button>
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Discussions
            </h2>
          </div>

          <div className="flex items-center gap-1 sm:gap-3 mt-1 sm:mt-0">
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPrivateMessages(!showPrivateMessages)}
                className="p-1 sm:p-2 hover:bg-white/5 rounded-full transition-colors group relative"
              >
                {showPrivateMessages ? (
                  <Eye size={15} className="text-primary-400" />
                ) : (
                  <EyeOff size={15} className="text-gray-400" />
                )}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPrivateKeyModal(true)}
              className={cn(
                "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full transition-all duration-300 group relative text-xs sm:text-base",
                isAuthenticated
                  ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                  : "bg-white/5 hover:bg-white/10 border border-white/10"
              )}
            >
              <Lock size={12} />
              {isAuthenticated ? 'Authenticated' : 'Private Access'}
            </motion.button>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <MessageSquare size={36} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                No messages yet!
              </h2>
              <p className="text-gray-400 max-w-md mb-3">
                Be the first to start the conversation. Your message could inspire others!
              </p>
            </motion.div>
          ) : (
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
          )}
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
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none h-10 max-h-32 placeholder:text-gray-500"
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

        <AnimatePresence>
          {notification && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default DiscussionPage;