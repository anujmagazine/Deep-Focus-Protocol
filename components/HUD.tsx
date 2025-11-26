import React from 'react';
import { TerminalState } from '../types';

interface HUDProps {
  stats: TerminalState;
}

export const HUD: React.FC<HUDProps> = ({ stats }) => {
  return (
    <div className="border-b border-cyber-green-dim bg-cyber-black p-4 flex justify-between items-center text-xs md:text-sm font-mono uppercase tracking-widest sticky top-0 z-30 bg-opacity-90 backdrop-blur-sm">
      <div className="flex gap-6">
        <div className="flex flex-col">
          <span className="text-gray-500 mb-1">Signal Strength</span>
          <div className="w-24 h-2 bg-gray-900 border border-gray-700">
            <div 
              className="h-full bg-cyber-green transition-all duration-500 ease-out"
              style={{ width: `${stats.signalStrength}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="text-gray-500 mb-1">Bandwidth</span>
          <div className="w-24 h-2 bg-gray-900 border border-gray-700">
            <div 
              className="h-full bg-cyber-cyan transition-all duration-300 ease-linear animate-pulse"
              style={{ width: `${stats.bandwidthUsage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-right">
         <span className="text-gray-500 block mb-1">Security Alert</span>
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