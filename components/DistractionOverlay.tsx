import React, { useEffect } from 'react';
import { Distraction } from '../types';

interface DistractionOverlayProps {
  distractions: Distraction[];
  onInteract: (id: string, action: 'CLICKED' | 'CLOSED') => void;
}

export const DistractionOverlay: React.FC<DistractionOverlayProps> = ({ distractions, onInteract }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {distractions.map((d) => (
        <div
          key={d.id}
          className={`pointer-events-auto absolute transition-all duration-300 animate-flicker
            ${d.type === 'NOTIFICATION' 
              ? 'bg-gray-800 border-l-4 border-green-500 text-white p-3 rounded shadow-lg w-72' 
              : 'bg-white border-2 border-red-600 text-black p-4 rounded shadow-2xl w-80 flex flex-col items-center text-center'
            }
          `}
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            // Slight rotation for chaos effect
            transform: `rotate(${Math.random() * 4 - 2}deg)`
          }}
          onClick={() => onInteract(d.id, 'CLICKED')}
        >
          {/* Header/Title */}
          <div className="flex justify-between items-center w-full mb-2">
            <span className={`font-bold text-xs uppercase ${d.type === 'SYSTEM_ALERT' ? 'text-red-600' : 'text-gray-400'}`}>
              {d.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInteract(d.id, 'CLOSED');
              }}
              className="text-gray-500 hover:text-red-500 font-bold px-2"
            >
              ✕
            </button>
          </div>

          {/* Message Content */}
          <div className="text-sm font-sans mb-2">
            {d.message}
          </div>

          {/* Fake Buttons for System Alerts */}
          {d.type === 'SYSTEM_ALERT' && (
            <div className="flex gap-2 mt-2 w-full">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-xs py-1 rounded">Cancel</button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded">OK</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};