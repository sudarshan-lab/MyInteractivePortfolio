import React, { createContext, useContext, useState, useCallback } from 'react';
import { MessageType, ChatContextType, ChatMemory } from '../types/chat';
import { generateResponse } from '../services/openai';
import { v4 as uuidv4 } from '../utils/uuid';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatMemory, setChatMemory] = useState<ChatMemory>({
    recentTopics: [],
    lastProjectDiscussed: undefined,
    lastSkillDiscussed: undefined,
  });

  const updateChatMemory = (message: string, isUser: boolean) => {
    const topics = new Set(chatMemory.recentTopics);
    const lowerMessage = message.toLowerCase();
    
    // Track topics
    if (lowerMessage.includes('project')) topics.add('projects');
    if (lowerMessage.includes('experience')) topics.add('experience');
    if (lowerMessage.includes('skill')) topics.add('skills');
    
    // Track specific projects
    if (isUser) {
      const projectMatch = message.match(/tell me more about the (.*?) project/i);
      if (projectMatch) {
        setChatMemory(prev => ({
          ...prev,
          lastProjectDiscussed: projectMatch[1]
        }));
      }
    }
    
    const recentTopics = Array.from(topics).slice(-5);
    setChatMemory(prev => ({
      ...prev,
      recentTopics,
    }));
  };

  const updateMessageFeedback = useCallback((messageId: string, feedback: 'helpful' | 'not_helpful') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: MessageType = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const assistantMessage: MessageType = {
      id: uuidv4(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setLoading(true);
    updateChatMemory(content, true);

    try {
      if (content.toLowerCase().includes('your') && content.toLowerCase().includes('resume')) {
        window.open('/Resume.pdf', '_blank');
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                content: "I've opened my resume in a new tab for you. Let me know if you have any questions about my experience!", 
                isStreaming: false 
              }
            : msg
        ));
      } else {
        // Convert messages to format expected by OpenAI
        const chatHistory = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        await generateResponse(content, (chunk) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }, chatHistory);

        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, isStreaming: false }
            : msg
        ));
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { 
              ...msg, 
              content: "I'm sorry, I couldn't process your request. Please try again later.",
              isStreaming: false 
            }
          : msg
      ));
    } finally {
      setLoading(false);
    }
  }, [messages, chatMemory]);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      loading, 
      sendMessage, 
      updateMessageFeedback,
      chatMemory 
    }}>
      {children}
    </ChatContext.Provider>
  );
};