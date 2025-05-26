import React from 'react';
import Message from './Message';
import { useChat } from '../context/ChatContext';

const MessageList: React.FC = () => {
  const { messages } = useChat();

  return (
    <div className="space-y-4 pb-2">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;