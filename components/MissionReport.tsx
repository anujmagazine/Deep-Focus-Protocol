import React from 'react';
import { ScoreState } from '../types';
import { GlitchText } from './GlitchText';

interface MissionReportProps {
  scoreState: ScoreState;
  onRestart: () => void;
  success: boolean;
}

export const MissionReport: React.FC<MissionReportProps> = ({ scoreState, onRestart, success }) => {
  
  // Rank Logic - Simplified for Gamers/Students
  const ranks = [
    { name: "NOOB (Too Distracted)", min: 0, color: "text-gray-500" },
    { name: "ROOKIE (Getting There)", min: 1000, color: "text-cyber-cyan" },
    { name: "PRO PLAYER (Solid Focus)", min: 1500, color: "text-orange-400" },
    { name: "LEGEND (Unstoppable)", min: 2000, color: "text-cyber-green" }
  ];

  const currentRankIndex = ranks.reduce((acc, rank, index) => scoreState.score >= rank.min ? index : acc, 0);
  const currentRank = ranks[currentRankIndex];
  const nextRank = ranks[currentRankIndex + 1];

  // Progress to next rank
  let progress = 100;
  if (nextRank) {
    const range = nextRank.min - currentRank.min;
    const value = scoreState.score - currentRank.min;
    progress = Math.min(100, Math.max(0, (value / range) * 100));
  }

  // Generate Analysis Feedback
  const getAnalysis = () => {
    if (!success) return "Mission Failed. You clicked too many distractions. In real life, this is why you end up scrolling Instagram instead of studying for exams.";
    
    if (scoreState.score > 2000) return "PERFECT GAME! You blocked every distraction. Your focus is at 100%. You are ready for any exam.";
    if (scoreState.score > 1500) return "GG WP (Good Game). You focused well, but hesitated on a few popups. Keep training.";
    if (scoreState.score > 1000) return "NOT BAD. You finished the game, but the notifications slowed you down. You need to improve your mental firewall.";
    return "BARELY SURVIVED. You clicked too many fake messages. You are easily distracted. Try 'Do Not Disturb' mode.";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-black p-4 relative z-50 overflow-y-auto">
      <div className="bg-gray-900 border-2 border-cyber-green p-6 md:p-8 rounded-lg max-w-xl w-full text-center shadow-[0_0_50px_rgba(0,255,65,0.15)] mt-10 mb-10">
        
        <h1 className={`text-3xl md:text-5xl font-display font-bold mb-2 ${success ? 'text-cyber-green' : 'text-cyber-red'}`}>
          {success ? 'MISSION ACCOMPLISHED' : 'GAME OVER'}
        </h1>
        <p className="text-gray-400 font-mono text-sm mb-6">SESSION DISCONNECTED</p>
        
        <div className="h-px w-full bg-gray-800 my-4"></div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 font-mono">
          <div className="flex flex-col items-center p-4 bg-black/40 rounded border border-gray-800">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest">Final Score</span>
            <span className="text-2xl md:text-4xl text-white font-bold">{scoreState.score}</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-black/40 rounded border border-gray-800">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest">Distractions Blocked</span>
            <span className="text-2xl md:text-4xl text-cyber-cyan font-bold">{scoreState.distractionsDefeated}</span>
          </div>
        </div>

        {/* Rank Section */}
        <div className="mb-8 bg-black/20 p-4 rounded-lg border border-gray-800">
          <span className="text-gray-500 text-xs uppercase tracking-widest">Your Rank</span>
          <div className={`mt-2 text-2xl md:text-3xl font-display font-bold ${currentRank.color} drop-shadow-md`}>
            {currentRank.name}
          </div>
          
          {/* Progress Bar to next rank */}
          {nextRank && (
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-mono">
                <span>CURRENT RANK</span>
                <span>NEXT: {nextRank.name.split(' ')[0]}</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyber-green transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-right text-[10px] text-gray-600 mt-1">
                {Math.round(nextRank.min - scoreState.score)} XP needed for next rank
              </div>
            </div>
          )}
        </div>

        {/* Analysis Text */}
        <div className="text-left mb-8 bg-cyber-green/5 border-l-2 border-cyber-green p-4">
          <h3 className="text-cyber-green font-bold text-xs uppercase mb-2">Coach Feedback:</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed font-mono">
            "{getAnalysis()}"
          </p>
        </div>

        <button 
          onClick={onRestart}
          className="w-full py-4 bg-cyber-green text-black font-display font-bold text-lg tracking-widest hover:bg-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};