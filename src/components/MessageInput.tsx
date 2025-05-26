import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { motion } from 'framer-motion';
import VoiceInput from './VoiceInput';

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, loading } = useChat();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setInput(target.value);
    target.style.height = 'auto';
    const newHeight = Math.min(target.scrollHeight, 150);
    target.style.height = `${newHeight}px`;
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    setTimeout(() => {
      sendMessage(transcript);
      setInput('');
    }, 500);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2"
    >
      <VoiceInput onTranscript={handleVoiceTranscript} />
      
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "I'm thinking..." : "Ask me anything..."}
          className="w-full pl-4 pr-12 py-3 bg-dark-300/50 backdrop-blur-sm rounded-lg resize-none text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-70 border border-white/10"
          style={{ minHeight: '48px', maxHeight: '150px' }}
          rows={1}
          disabled={loading}
        />
        <motion.button
          type="submit"
          disabled={loading || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 bottom-0 p-2 text-white rounded-md disabled:opacity-50 h-full flex items-center justify-center"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin text-gray-400" />
          ) : (
            <Send size={20} className={input.trim() ? "text-primary-500" : "text-gray-500"} />
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default MessageInput;