import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <ChatProvider>
        <AnimatePresence>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <ChatInterface />
          )}
        </AnimatePresence>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;