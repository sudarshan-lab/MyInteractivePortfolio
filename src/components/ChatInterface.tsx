import React, { useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SuggestionChips from './SuggestionChips';
import { useChat } from '../context/ChatContext';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInterface: React.FC = () => {
  const { messages, loading } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between p-4 border-b border-dark-300/50 backdrop-blur-md bg-dark-100/95 z-10"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full shadow-lg">
            <MessageSquare size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">Hi, I'm Sudarshan! 👋</h1>
        </div>
        <div className="text-sm text-gray-400">Software Engineer</div>
      </motion.header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <MessageSquare size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Welcome to my Interactive Portfolio!</h2>
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
  );
};

export default ChatInterface;