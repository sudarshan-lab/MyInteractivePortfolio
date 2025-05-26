import React from 'react';
import { MessageType } from '../types/chat';
import { User, Bot, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../context/ChatContext';
import ProjectCard from './ProjectCard';
import ContactCard from './ContactCard';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { updateMessageFeedback } = useChat();
  const isUser = message.role === 'user';
  
  const handleFeedback = (feedback: 'helpful' | 'not_helpful') => {
    updateMessageFeedback(message.id, feedback);
  };

  const renderContent = () => {
    if (isUser) {
      return <p>{message.content}</p>;
    }

    if (message.isStreaming) {
      return (
        <div className="markdown prose prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
          <TypingIndicator />
        </div>
      );
    }

    // Handle contact options
    if (message.content === 'SHOW_CONTACT_OPTIONS') {
      return (
        <div className="space-y-6">
          <div className="markdown prose prose-invert">
            <p className="text-gray-300 mb-2">I'd love to connect with you! Here are a few ways we can get in touch:</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Schedule a Meeting</h3>
                <p className="text-gray-300 mb-4">
                  I use Calendly to make scheduling meetings easy and convenient. You can choose a time that works best for you, 
                  and we can discuss potential opportunities, collaborations, or any questions you might have about my experience 
                  and projects. The meeting link will be sent to your email automatically.
                </p>
                <ContactCard type="schedule" />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Direct Contact</h3>
                <p className="text-gray-300 mb-4">
                  If you prefer to reach out directly, you can find all my contact information below. Feel free to email, call, 
                  or connect with me on LinkedIn or GitHub.
                </p>
                <ContactCard type="contact" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Split content by project blocks while preserving text order
    const segments = message.content.split(/(```project[\s\S]*?```)/);
    
    return (
      <div className="space-y-4">
        {segments.map((segment, index) => {
          if (segment.startsWith('```project')) {
            try {
              const jsonContent = segment.replace('```project', '').replace('```', '');
              const projectData = JSON.parse(jsonContent);
              return <ProjectCard key={index} {...projectData} />;
            } catch (e) {
              console.error('Failed to parse project data:', e);
              return null;
            }
          } else if (segment.trim()) {
            return (
              <div key={index} className="markdown prose prose-invert">
                <ReactMarkdown>{segment.trim()}</ReactMarkdown>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center flex-shrink-0 mt-1"
        >
          <Bot size={18} className="text-white" />
        </motion.div>
      )}
      
      <div className="flex flex-col gap-2 max-w-[80%]">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "chat-bubble",
            isUser ? "chat-bubble-user" : "chat-bubble-ai"
          )}
        >
          {renderContent()}
        </motion.div>

        {!isUser && !message.isStreaming && message.content !== 'SHOW_CONTACT_OPTIONS' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 ml-2"
          >
            <button
              onClick={() => handleFeedback('helpful')}
              className={cn(
                "p-1 rounded-full transition-colors",
                message.feedback === 'helpful' ? "text-green-500" : "text-gray-400 hover:text-green-500"
              )}
            >
              <ThumbsUp size={14} />
            </button>
            <button
              onClick={() => handleFeedback('not_helpful')}
              className={cn(
                "p-1 rounded-full transition-colors",
                message.feedback === 'not_helpful' ? "text-red-500" : "text-gray-400 hover:text-red-500"
              )}
            >
              <ThumbsDown size={14} />
            </button>
          </motion.div>
        )}
      </div>
      
      {isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 mt-1"
        >
          <User size={18} className="text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Message;