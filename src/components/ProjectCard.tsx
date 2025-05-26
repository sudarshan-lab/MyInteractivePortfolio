import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { useChat } from '../context/ChatContext';

interface ProjectCardProps {
  name: string;
  period: string;
  description: string[];
  technologies: string;
  demoUrl?: string;
  githubUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  period,
  description,
  technologies,
  demoUrl,
  githubUrl
}) => {
  const { sendMessage } = useChat();

  const handleClick = () => {
    sendMessage(`Tell me more about the ${name} project`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className="bg-dark-300/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 cursor-pointer group transition-all hover:border-primary-500/50 hover:bg-dark-300/70"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors flex items-center gap-2">
          {name}
          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <span className="text-sm text-gray-400">{period}</span>
      </div>
      
      <div className="space-y-2 mb-3">
        {description.map((desc, index) => (
          <p key={index} className="text-gray-300 text-sm">{desc}</p>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {technologies.split(', ').map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-primary-600/20 rounded-full text-xs text-primary-400"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex gap-3">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1 text-sm",
              "text-primary-400 hover:text-primary-300 transition-colors"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
            Demo
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1 text-sm",
              "text-primary-400 hover:text-primary-300 transition-colors"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={14} />
            Code
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;