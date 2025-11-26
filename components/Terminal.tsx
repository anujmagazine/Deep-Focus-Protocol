import React, { useEffect, useRef } from 'react';
import { Message, Sender } from '../types';

interface TerminalProps {
  messages: Message[];
  isTyping: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ messages, isTyping }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 font-mono text-sm md:text-base relative z-10 pb-32">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[85%] md:max-w-[70%] p-4 border-l-2 relative
            ${msg.sender === Sender.USER 
              ? 'border-cyber-cyan bg-gray-900/50 text-cyber-cyan' 
              : msg.sender === Sender.SYSTEM 
                ? 'border-cyber-red bg-red-900/10 text-cyber-red italic'
                : 'border-cyber-green bg-green-900/10 text-cyber-green shadow-[0_0_10px_rgba(0,255,65,0.1)]'
            }`}
          >
            {/* Header for message */}
            <div className="text-[10px] uppercase opacity-50 mb-1 tracking-wider flex justify-between">
              <span>{msg.sender === Sender.OPERATOR ? 'OPERATOR_LINK' : msg.sender === Sender.USER ? 'RUNNER_NODE' : 'SYSTEM_ROOT'}</span>
              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}</span>
            </div>
            
            {/* Message Body */}
            <div className="whitespace-pre-wrap leading-relaxed">
              {msg.text}
            </div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <div className="p-4 border-l-2 border-cyber-green bg-green-900/10 text-cyber-green">
            <span className="animate-pulse">PROCESSING DATA PACKET...</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};