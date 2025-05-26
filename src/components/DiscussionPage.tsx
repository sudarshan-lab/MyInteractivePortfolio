import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Lock, Send, Users, ArrowLeft, User, Mail } from 'lucide-react';
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
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

const DiscussionPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userData) {
      setTimeout(() => {
        setMessages(DUMMY_MESSAGES);
      }, 1000);
    }
  }, [userData]);

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
    setUserData({ name, email });
    setShowAuthModal(false);
  };

  const filteredMessages = messages.filter(msg => 
    !msg.isPrivate || (msg.isPrivate && isAuthenticated)
  );

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-dark-100/95 to-dark-300/95 backdrop-blur-xl z-50 flex flex-col"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 border-b border-white/10 bg-dark-200/50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-primary-400" />
          </motion.button>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Community Discussions
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10"
          >
            <User size={16} className="text-primary-400" />
            <span className="text-sm text-gray-200">{userData.name}</span>
          </motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10"
          >
            <Mail size={16} className="text-primary-400" />
            <span className="text-sm text-gray-200">{userData.email}</span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPrivateKeyModal(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
              isAuthenticated 
                ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                : "bg-white/5 hover:bg-white/10 border border-white/10"
            )}
          >
            <Lock size={16} />
            {isAuthenticated ? 'Authenticated' : 'Private Access'}
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {filteredMessages.map((msg, index) => (
            <motion.div
              key={msg.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "max-w-[80%] break-words",
                msg.email === userData.email ? "ml-auto" : "mr-auto"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-400">{msg.sender}</span>
                  <span className="text-xs text-gray-500">{msg.email}</span>
                </div>
                {msg.isPrivate && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-primary-600/20 p-1 rounded-full"
                  >
                    <Lock size={12} className="text-primary-400" />
                  </motion.div>
                )}
              </div>
              <div
                className={cn(
                  "p-4 rounded-2xl shadow-lg backdrop-blur-sm",
                  msg.email === userData.email
                    ? "bg-gradient-to-br from-primary-600/90 to-primary-700/90 text-white"
                    : msg.isPrivate
                    ? "bg-gradient-to-br from-primary-600/20 to-primary-700/20 border border-primary-500/20"
                    : "bg-white/5 border border-white/10"
                )}
              >
                <p className="text-gray-100 leading-relaxed">{msg.content}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
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
              "p-2 rounded-full transition-all duration-300",
              isPrivate 
                ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                : "bg-white/5 hover:bg-white/10 border border-white/10"
            )}
            title={isPrivate ? "Private Message" : "Public Message"}
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
            className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:hover:from-primary-600 disabled:hover:to-primary-700 rounded-full transition-all duration-300 shadow-lg"
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
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Enter Private Key
              </h3>
              <input
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 placeholder:text-gray-500"
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
  );
};

export default DiscussionPage;