import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Lock, Send, Users, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/cn';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isPrivate: boolean;
}

const DUMMY_MESSAGES: Message[] = [
  {
    id: '1',
    content: "Hey everyone! What's your favorite programming language?",
    sender: "Alice",
    timestamp: new Date('2024-03-10T10:00:00'),
    isPrivate: false
  },
  {
    id: '2',
    content: "I'm working on a React project, anyone interested in collaborating?",
    sender: "Bob",
    timestamp: new Date('2024-03-10T11:30:00'),
    isPrivate: false
  },
  {
    id: '3',
    content: "Private message about the project details.",
    sender: "Charlie",
    timestamp: new Date('2024-03-10T12:15:00'),
    isPrivate: true
  }
];

const PRIVATE_KEY_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // This is a hash of 'password'

const DiscussionPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMessages(DUMMY_MESSAGES);
    }, 1000);
  }, []);

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
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Math.random().toString(),
      content: newMessage,
      sender: 'You',
      timestamp: new Date(),
      isPrivate: isPrivate
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const filteredMessages = messages.filter(msg => 
    !msg.isPrivate || (msg.isPrivate && isAuthenticated)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-dark-100/95 backdrop-blur-md z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-dark-300">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-300 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold">Discussions</h2>
        </div>
        <button
          onClick={() => setShowPrivateKeyModal(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
            isAuthenticated 
              ? "bg-primary-600/20 text-primary-400"
              : "bg-dark-300 hover:bg-dark-400"
          )}
        >
          <Lock size={16} />
          {isAuthenticated ? 'Authenticated' : 'Private Access'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-lg",
              msg.isPrivate 
                ? "bg-primary-600/20 border border-primary-500/20" 
                : "bg-dark-300/50 border border-dark-400/20"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{msg.sender}</span>
              {msg.isPrivate && <Lock size={14} className="text-primary-400" />}
              <span className="text-sm text-gray-400">
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-200">{msg.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-dark-300 bg-dark-200">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={cn(
              "p-2 rounded-full transition-colors",
              isPrivate 
                ? "bg-primary-600/20 text-primary-400" 
                : "bg-dark-300 hover:bg-dark-400"
            )}
          >
            {isPrivate ? <Lock size={20} /> : <Users size={20} />}
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-dark-300/50 border border-dark-400/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 rounded-full transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showPrivateKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-200 p-6 rounded-lg w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">Enter Private Key</h3>
              <input
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter private key..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPrivateKeyModal(false)}
                  className="px-4 py-2 bg-dark-300 hover:bg-dark-400 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrivateKeySubmit}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DiscussionPage;