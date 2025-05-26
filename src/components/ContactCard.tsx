import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, Phone, Linkedin, Github } from 'lucide-react';
import { cn } from '../utils/cn';

interface ContactCardProps {
  type: 'schedule' | 'contact';
  onClick?: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ type }) => {
  const handleClick = () => {
    if (type === 'schedule') {
      window.open('https://calendly.com/ksudarshan1803', '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className={cn(
        "bg-dark-300/50 backdrop-blur-sm rounded-lg p-6 border border-white/10 group transition-all h-full",
        type === 'schedule' && "cursor-pointer hover:border-primary-500/50 hover:bg-dark-300/70"
      )}
    >
      <div className="flex mr-10 items-center gap-3 mb-4">
  <div className="flex items-center justify-center mt-5 w-10 h-10 bg-primary-600/20 rounded-full">
    {type === 'schedule' ? (
      <Calendar size={20}  className="text-primary-400" />
    ) : (
      <Mail size={20}  className="text-primary-400" />
    )}
  </div>
  <h3 className="text-base font-semibold text-white leading-none relative top-[1px]">
    {type === 'schedule' ? 'Schedule a Meeting' : 'Contact Details'}
  </h3>
</div>




      {type === 'schedule' ? (
        <p className="text-gray-300 text-sm mb-3">
          Book a time slot that works best for you to discuss potential opportunities or collaborations.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-300">
            <Mail size={16} className="text-primary-400 shrink-0" />
            <a href="mailto:ksudarshan1803@gmail.com" className="hover:text-primary-400 transition-colors truncate">
              ksudarshan1803@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Phone size={16} className="text-primary-400 shrink-0" />
            <a href="tel:+15183649665" className="hover:text-primary-400 transition-colors">
              +1 (518) 364-9665
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Linkedin size={16} className="text-primary-400 shrink-0" />
            <a href="https://linkedin.com/in/sudarshan-kammu" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors truncate">
              linkedin.com/in/sudarshan-kammu
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Github size={16} className="text-primary-400 shrink-0" />
            <a href="https://github.com/sudarshan-lab" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors truncate">
              github.com/sudarshan-lab
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ContactCard;