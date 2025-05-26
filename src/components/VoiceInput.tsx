import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');

  useEffect(() => {
    // Check if the browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
          
        if (event.results[0].isFinal) {
          onTranscript(transcript);
          setIsListening(false);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          setPermissionState('denied');
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);

      // Check for existing microphone permission
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'microphone' as PermissionName })
          .then((result) => {
            setPermissionState(result.state);
            
            // Listen for permission changes
            result.onchange = () => {
              setPermissionState(result.state);
            };
          })
          .catch(() => {
            // If we can't query permissions, assume we need to prompt
            setPermissionState('prompt');
          });
      }
    }
  }, [onTranscript]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setPermissionState('granted');
      return true;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      setPermissionState('denied');
      return false;
    }
  };

  const toggleListening = async () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
    } else {
      // If we need permission, request it first
      if (permissionState === 'prompt') {
        const granted = await requestMicrophonePermission();
        if (!granted) return;
      } else if (permissionState === 'denied') {
        alert('Please enable microphone access in your browser settings to use voice input.');
        return;
      }
      
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  if (!recognition) {
    return null;
  }

  return (
    <div className="hidden sm:block">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleListening}
        className={cn(
          "p-2 mb-3 rounded-full transition-colors relative group",
          isListening 
            ? "bg-red-500/20 text-red-500" 
            : "bg-dark-300/50 text-gray-400 hover:text-primary-500"
        )}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        
        {/* Tooltip */}
        {permissionState === 'denied' && (
          <div className="
            absolute bottom-full 
            left-1 sm:left-1/2 sm:-translate-x-1/2 
            mb-2 px-3 py-1 
            bg-dark-300 text-white text-xs rounded-md 
            opacity-0 group-hover:opacity-100 
            transition-opacity 
            w-[calc(100vw-2rem)] sm:w-auto max-w-sm 
            text-center z-50
          ">
            Microphone access denied. Check browser settings.
          </div>
        )}
      </motion.button>
    </div>
  );
  
};

export default VoiceInput;