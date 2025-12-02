import React from 'react';
import { GlitchText } from './GlitchText';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-20 max-w-2xl mx-auto text-center">
      
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 tracking-tighter">
          FOCUS <span className="text-cyber-green">MASTERY</span>
        </h1>
        <div className="h-1 w-24 bg-cyber-green mx-auto mb-6"></div>
        <h2 className="text-xl text-cyber-cyan font-mono tracking-widest uppercase">
          Train Your Brain Like A Pro
        </h2>
      </div>

      {/* Educational Context */}
      <div className="bg-gray-900/80 border border-gray-700 p-8 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-sm mb-8 text-left">
        <p className="text-gray-300 text-lg mb-6 leading-relaxed">
          Focus is a superpower. In this game, we test if you can study without checking your phone.
        </p>
        
        <div className="space-y-4 font-mono text-sm md:text-base text-gray-400">
          <div className="flex items-start gap-3">
            <span className="text-cyber-green font-bold">01 //</span>
            <p><strong>The Coach:</strong> You will chat with the Game Master. Follow the instructions to clear 4 Levels.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-cyber-green font-bold">02 //</span>
            <p><strong>The Distractions:</strong> Fake WhatsApp messages and Ads will pop up. <span className="text-white">Ignore them</span> or click 'X'. If you click the message, you lose health!</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-cyber-green font-bold">03 //</span>
            <p><strong>The Boss Fight:</strong> The final level will test your memory. Be ready.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <button 
        onClick={onStart}
        className="group relative px-8 py-4 bg-cyber-green text-black font-display font-bold text-xl tracking-widest hover:bg-white transition-all duration-200 clip-path-polygon"
      >
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyber-green transform scale-105 opacity-0 group-hover:opacity-100 transition-all"></div>
        START GAME
      </button>

      <div className="mt-8 text-xs text-gray-600 font-mono">
        DURATION: 15 MINS • ADAPTIVE DIFFICULTY
      </div>
    </div>
  );
};