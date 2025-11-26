import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, as = 'p', className = '' }) => {
  const Tag = as;
  
  return (
    <Tag className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -ml-0.5 translate-x-[2px] text-cyber-red opacity-0 group-hover:opacity-70 animate-pulse hidden group-hover:block mix-blend-screen">
        {text}
      </span>
      <span className="absolute top-0 left-0 -ml-0.5 -translate-x-[2px] text-cyber-cyan opacity-0 group-hover:opacity-70 animate-pulse delay-75 hidden group-hover:block mix-blend-screen">
        {text}
      </span>
    </Tag>
  );
};