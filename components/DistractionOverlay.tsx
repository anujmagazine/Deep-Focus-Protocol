import React from 'react';
import { Distraction } from '../types';

interface DistractionOverlayProps {
  distractions: Distraction[];
  onInteract: (id: string, action: 'CLICKED' | 'CLOSED') => void;
}

export const DistractionOverlay: React.FC<DistractionOverlayProps> = ({ distractions, onInteract }) => {
  
  const getBrandStyles = (title: string, type: string) => {
    const t = title.toLowerCase();
    if (t.includes('whatsapp')) return 'bg-white border-l-8 border-[#25D366] text-black';
    if (t.includes('instagram')) return 'bg-white border-l-8 border-purple-500 text-black bg-gradient-to-r from-purple-50 to-pink-50';
    if (t.includes('youtube')) return 'bg-white border-l-8 border-[#FF0000] text-black';
    if (t.includes('zomato')) return 'bg-white border-l-8 border-[#cb202d] text-black';
    if (t.includes('system') || type === 'SYSTEM_ALERT') return 'bg-gray-200 border-2 border-gray-400 text-black shadow-2xl';
    
    // Default Notification
    return 'bg-gray-800 border-l-4 border-cyber-cyan text-white';
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {distractions.map((d) => {
        const styles = getBrandStyles(d.title, d.type);
        const rotation = Math.random() * 6 - 3; // Random rotation between -3 and 3 deg

        return (
          <div
            key={d.id}
            className={`pointer-events-auto absolute animate-pop-in rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.6)] 
              flex flex-col cursor-pointer transition-transform hover:scale-105 active:scale-95
              ${styles}
              ${d.type === 'POPUP' || d.type === 'SYSTEM_ALERT' ? 'w-80 p-4' : 'w-72 p-3'}
            `}
            style={{
              top: `${d.top}%`,
              left: `${d.left}%`,
              '--tw-rotate': `${rotation}deg`
            } as React.CSSProperties}
            onClick={() => onInteract(d.id, 'CLICKED')}
          >
            {/* Header/Title */}
            <div className="flex justify-between items-center w-full mb-1">
              <div className="flex items-center gap-2">
                 {/* Fake Icons based on simple colored circles if needed, or just text */}
                 <span className={`font-bold text-xs uppercase tracking-wide opacity-80`}>
                   {d.title}
                 </span>
                 <span className="text-[10px] opacity-50">now</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInteract(d.id, 'CLOSED');
                }}
                className="text-gray-400 hover:text-red-600 font-bold px-2 py-1 rounded hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            {/* Message Content */}
            <div className={`text-sm leading-tight ${d.type === 'NOTIFICATION' ? 'font-sans' : 'font-mono'}`}>
              {d.message}
            </div>

            {/* Fake Action Buttons for realism */}
            {d.type === 'SYSTEM_ALERT' && (
              <div className="flex gap-2 mt-3 w-full border-t border-gray-300 pt-2">
                <button className="flex-1 bg-white border border-gray-400 hover:bg-gray-50 text-xs py-1.5 rounded font-medium shadow-sm">Cancel</button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded font-medium shadow-sm">Update</button>
              </div>
            )}
            {d.title.includes('WhatsApp') && (
              <div className="mt-2 text-xs text-[#25D366] font-bold">Reply</div>
            )}
          </div>
        );
      })}
    </div>
  );
};