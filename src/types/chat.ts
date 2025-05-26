export interface MessageType {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
  feedback?: 'helpful' | 'not_helpful';
}

export interface ChatContextType {
  messages: MessageType[];
  loading: boolean;
  sendMessage: (message: string) => void;
  updateMessageFeedback: (messageId: string, feedback: 'helpful' | 'not_helpful') => void;
  chatMemory: ChatMemory;
}

export interface ChatMemory {
  recentTopics: string[];
  lastProjectDiscussed?: string;
  lastSkillDiscussed?: string;
}