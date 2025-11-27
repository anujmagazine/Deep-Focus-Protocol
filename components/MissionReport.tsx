import React from 'react';
import { ScoreState } from '../types';
import { GlitchText } from './GlitchText';

interface MissionReportProps {
  scoreState: ScoreState;
  onRestart: () => void;
  success: boolean;
}

export const MissionReport: React.FC<MissionReportProps> = ({ scoreState, onRestart, success }) => {
  const getRank = (score: number) => {
    if (score > 2000) return "CYBER LEGEND";
    if (score > 1500) return "ELITE RUNNER";
    if (score > 1000) return "OPERATOR CLASS";
    return "SCRIPT KIDDIE";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-black p-4 relative z-50">
      <div className="bg-gray-900 border-2 border-cyber-green p-8 rounded-lg max-w-lg w-full text-center shadow-[0_0_30px_rgba(0,255,65,0.2)]">
        
        <h1 className={`text-4xl font-display font-bold mb-2 ${success ? 'text-cyber-green' : 'text-cyber-red'}`}>
          {success ? 'MISSION COMPLETE' : 'MISSION FAILED'}
        </h1>
        
        <div className="h-px w-full bg-gray-700 my-6"></div>

        <div className="grid grid-cols-2 gap-4 mb-8 font-mono">
          <div className="flex flex-col items-center p-4 bg-black/50 rounded border border-gray-800">
            <span className="text-gray-500 text-xs uppercase">Total Score</span>
            <span className="text-3xl text-white font-bold">{scoreState.score}</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-black/50 rounded border border-gray-800">
            <span className="text-gray-500 text-xs uppercase">Distractions Blocked</span>
            <span className="text-3xl text-cyber-cyan font-bold">{scoreState.distractionsDefeated}</span>
          </div>
        </div>

        <div className="mb-8">
          <span className="text-gray-500 text-sm uppercase tracking-widest">Efficiency Rank</span>
          <div className="mt-2 text-3xl font-display font-bold text-cyber-green animate-pulse">
            {getRank(scoreState.score)}
          </div>
        </div>

        <button 
          onClick={onRestart}
          className="w-full py-4 bg-cyber-green text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
        >
          Reboot System
        </button>
      </div>
    </div>
  );
};