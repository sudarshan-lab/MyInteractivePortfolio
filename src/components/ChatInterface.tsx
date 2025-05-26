import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SuggestionChips from './SuggestionChips';
import { useChat } from '../context/ChatContext';
import { MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DiscussionPage from './DiscussionPage';

const ChatInterface: React.FC = () => {
  const { messages, loading } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [showDiscussions, setShowDiscussions] = useState(false);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRefresh = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-b border-dark-300/50 backdrop-blur-md bg-dark-100/95 z-10"
        >
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleRefresh}>
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full shadow-lg">
              <MessageSquare size={16} className="text-white sm:hidden" />
              <MessageSquare size={20} className="text-white hidden sm:block" />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-white flex items-center">
              Hi, I'm Sudarshan!
              <span
                className="inline-block transform scale-[0.75] sm:scale-100 ml-1"
                role="img"
                aria-label="wave"
              >
                👋
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="text-sm text-gray-400 cursor-pointer hover:text-primary-400 transition-colors flex items-center gap-2 bg-dark-200/50 px-3 py-1.5 rounded-full"
              onClick={() => setShowDiscussions(true)}
            >
              <MessageSquare size={14} className="sm:hidden" />
              <MessageSquare size={16} className="hidden sm:block" />
              <span className="hidden sm:inline">Software Engineer</span>
              <span className="sm:hidden">Discuss</span>
            </button>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-16 sm:mt-20">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <MessageSquare size={24} className="text-white sm:hidden" />
                <MessageSquare size={32} className="text-white hidden sm:block" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Welcome to my Interactive Portfolio!</h2>
              <p className="text-gray-400 max-w-md mb-8">
                I'd love to tell you about my experience in software engineering, my projects, and skills.
                Feel free to ask me anything or try one of the suggestions below!
              </p>
              <SuggestionChips large />
            </motion.div>
          ) : (
            <>
              <MessageList />
              <div ref={endOfMessagesRef} />
            </>
          )}
        </div>

        <div className="border-t border-dark-300/50 p-4 bg-dark-200/80 backdrop-blur-sm">
          {messages.length > 0 && !loading && (
            <div className="mb-3">
              <SuggestionChips />
            </div>
          )}
          <MessageInput />
        </div>
      </div>

      <AnimatePresence>
        {showDiscussions && (
          <DiscussionPage onClose={() => setShowDiscussions(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatInterface;