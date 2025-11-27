import React from 'react';
import { TerminalState, ScoreState } from '../types';

interface HUDProps {
  stats: TerminalState;
  score: ScoreState;
}

export const HUD: React.FC<HUDProps> = ({ stats, score }) => {
  return (
    <div className="border-b border-cyber-green-dim bg-cyber-black p-3 md:p-4 flex flex-wrap justify-between items-center text-xs md:text-sm font-mono uppercase tracking-widest sticky top-0 z-30 bg-opacity-95 backdrop-blur-md">
      
      {/* Health / Signal */}
      <div className="flex flex-col w-1/3 md:w-auto mb-2 md:mb-0">
        <span className="text-gray-500 mb-1 text-[10px]">Signal Integrity</span>
        <div className="w-24 md:w-32 h-3 bg-gray-900 border border-gray-700 relative overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${score.health < 30 ? 'bg-red-500 animate-pulse' : 'bg-cyber-green'}`}
            style={{ width: `${score.health}%` }}
          />
        </div>
      </div>

      {/* Score & Streak */}
      <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto order-3 md:order-2 justify-center md:justify-start mt-2 md:mt-0">
        <div className="flex flex-col items-center">
            <span className="text-gray-500 text-[10px]">XP SCORE</span>
            <span className="text-xl font-bold text-white">{score.score.toString().padStart(5, '0')}</span>
        </div>
        
        <div className="flex flex-col items-center">
            <span className="text-gray-500 text-[10px]">STREAK</span>
            <div className="flex items-center gap-1">
                <span className={`text-xl font-bold ${score.streak > 1 ? 'text-orange-400' : 'text-gray-600'}`}>
                    x{score.streak}
                </span>
                {score.streak > 2 && <span className="text-orange-500 animate-bounce">🔥</span>}
            </div>
        </div>
      </div>

      {/* Security Level */}
      <div className="text-right w-1/3 md:w-auto md:order-3 mb-2 md:mb-0">
         <span className="text-gray-500 block mb-1 text-[10px]">Threat Level</span>
         <span className={`font-bold ${
           stats.securityAlertLevel === 'CRITICAL' ? 'text-cyber-red animate-pulse-fast' : 
           stats.securityAlertLevel === 'HIGH' ? 'text-orange-500' : 
           'text-cyber-green'
         }`}>
           [{stats.securityAlertLevel}]
         </span>
      </div>
    </div>
  );
};