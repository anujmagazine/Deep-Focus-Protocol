import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HUD } from './components/HUD';
import { Terminal } from './components/Terminal';
import { GlitchText } from './components/GlitchText';
import { IntroScreen } from './components/IntroScreen';
import { DistractionOverlay } from './components/DistractionOverlay';
import { MissionReport } from './components/MissionReport';
import { initGemini, sendMessageToOperator } from './services/geminiService';
import { Message, Sender, GameState, TerminalState, ScoreState, Distraction, DistractionType } from './types';
import { VISUAL_DISTRACTIONS } from './constants';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  
  // Stats & Scoring
  const [terminalState, setTerminalState] = useState<TerminalState>({
    signalStrength: 100,
    bandwidthUsage: 0,
    securityAlertLevel: 'LOW'
  });
  const [scoreState, setScoreState] = useState<ScoreState>({
    score: 0,
    streak: 1,
    health: 100,
    distractionsDefeated: 0
  });

  // Distraction Logic
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartGame = () => {
    setGameStarted(true);
    setGameState(GameState.IDLE);
    setMessages([]);
    setScoreState({ score: 0, streak: 1, health: 100, distractionsDefeated: 0 });
    setDistractions([]);
    initGemini();
    
    setTimeout(() => {
        addMessage({
          id: 'init-1',
          text: "SYSTEM ONLINE.\n\nWelcome, Runner. I am Operator.\n\nWe are going to train your brain to focus like a pro gamer. It takes just 15 minutes.\n\nI will issue challenges. Watch out for 'popups' and fake notifications. Ignore them to win points.\n\nAre you ready? Type 'Start' to begin.",
          sender: Sender.OPERATOR,
          timestamp: Date.now()
        });
    }, 800);
  };

  // --- Distraction Spawning Logic ---
  useEffect(() => {
    if (!gameStarted || gameState === GameState.IDLE || gameState === GameState.COMPLETED || gameState === GameState.FAILED) {
      setDistractions([]); // Clear distractions if not active
      return;
    }

    let spawnRate = 10000; // default 10s
    if (gameState === GameState.LEVEL_2_INTRO || gameState === GameState.LEVEL_2_TRAP_ACTIVE) {
      spawnRate = 3000; // Chaos mode in Level 2
    } else if (gameState === GameState.LEVEL_3_ACTION) {
      spawnRate = 5000;
    }

    const interval = setInterval(() => {
      // 50% chance to spawn a distraction per tick
      if (Math.random() > 0.4) {
        spawnDistraction();
      }
    }, spawnRate);

    return () => clearInterval(interval);
  }, [gameStarted, gameState]);


  const spawnDistraction = () => {
    const template = VISUAL_DISTRACTIONS[Math.floor(Math.random() * VISUAL_DISTRACTIONS.length)];
    const id = uuidv4();
    const type = template.type as DistractionType;
    
    // Random position (keep away from center chat a bit if possible, but randomness is key)
    // Limits: Top 10% to 80%, Left 5% to 70% to avoid being offscreen
    const top = 10 + Math.random() * 70;
    const left = 5 + Math.random() * 60;

    setDistractions(prev => [...prev, {
      id,
      type,
      title: template.title,
      message: template.message,
      top,
      left,
      createdAt: Date.now()
    }]);

    // Update Bandwidth usage visually when distractions appear
    setTerminalState(prev => ({ ...prev, bandwidthUsage: Math.min(100, prev.bandwidthUsage + 10) }));
  };

  const handleDistractionInteract = (id: string, action: 'CLICKED' | 'CLOSED') => {
    setDistractions(prev => prev.filter(d => d.id !== id));
    
    // Reduce bandwidth
    setTerminalState(prev => ({ ...prev, bandwidthUsage: Math.max(0, prev.bandwidthUsage - 10) }));

    if (action === 'CLICKED') {
      // Bad: User fell for the trap
      setScoreState(prev => ({
        ...prev,
        streak: 1, // Reset streak
        health: Math.max(0, prev.health - 15), // Damage
        score: Math.max(0, prev.score - 50)
      }));
      triggerHealthShake();
    } else {
      // Good: User actively dismissed it (Neutral/Small Good)
      // Note: Best behavior is ignoring, but closing is okay to clear view.
      setScoreState(prev => ({
        ...prev,
        score: prev.score + (20 * prev.streak),
        distractionsDefeated: prev.distractionsDefeated + 1
      }));
    }
  };

  // Auto-remove old distractions (Simulate "Ignoring" them successfully)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setDistractions(prev => {
        const kept = prev.filter(d => now - d.createdAt < 6000); // Last 6 seconds
        const removedCount = prev.length - kept.length;
        if (removedCount > 0) {
           // Reward for ignoring!
           setScoreState(s => ({
             ...s,
             score: s.score + (50 * s.streak), // Big points for ignoring
             distractionsDefeated: s.distractionsDefeated + removedCount,
             streak: Math.min(4, s.streak + 0.1) // Build streak slowly
           }));
           setTerminalState(t => ({ ...t, bandwidthUsage: Math.max(0, t.bandwidthUsage - (10 * removedCount)) }));
        }
        return kept;
      });
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);


  const triggerHealthShake = () => {
    const body = document.body;
    body.classList.add('animate-shake');
    setTimeout(() => body.classList.remove('animate-shake'), 500);
  };

  // --- Game State Logic ---

  React.useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];

    if (lastMsg.sender === Sender.OPERATOR) {
      const text = lastMsg.text.toUpperCase();
      
      // State Transitions
      if (gameState === GameState.IDLE && (text.includes("SCAN") || text.includes("LEVEL 1"))) {
        setGameState(GameState.LEVEL_1_INTRO);
        updateStats('LOW');
      } else if (gameState === GameState.LEVEL_1_INTRO && (text.includes("SHIELD") || text.includes("LEVEL 2"))) {
        setGameState(GameState.LEVEL_2_INTRO);
        setScoreState(s => ({...s, score: s.score + 500})); // Level bonus
        updateStats('MED');
      } else if (gameState === GameState.LEVEL_2_INTRO && (text.includes("?") || text.includes("QUEST"))) {
        setGameState(GameState.LEVEL_2_TRAP_ACTIVE);
        updateStats('HIGH');
      } else if (gameState === GameState.LEVEL_2_TRAP_ACTIVE) {
        if (text.includes("GAME OVER") || text.includes("FAILED")) {
           setGameState(GameState.FAILED);
           setScoreState(s => ({...s, health: 0}));
           updateStats('CRITICAL');
        } else if (text.includes("SHIELD HOLDS") || text.includes("COMPLETE") || text.includes("LEVEL 3")) {
           setGameState(GameState.LEVEL_3_INTRO);
           setScoreState(s => ({...s, score: s.score + 1000})); // Level bonus
           updateStats('LOW');
        }
      } else if (text.includes("MISSION COMPLETE") || text.includes("ZONE")) {
           setGameState(GameState.COMPLETED);
           setScoreState(s => ({...s, score: s.score + 2000})); // Completion bonus
      }
    }
  }, [messages, gameState]);

  // Fail if health drops to 0
  useEffect(() => {
    if (scoreState.health <= 0 && gameState !== GameState.FAILED && gameStarted) {
      setGameState(GameState.FAILED);
      addMessage({
        id: uuidv4(),
        text: "CRITICAL FAILURE: SIGNAL LOST. Too many distractions accepted.",
        sender: Sender.SYSTEM,
        timestamp: Date.now()
      });
    }
  }, [scoreState.health, gameState, gameStarted]);

  const updateStats = (alert: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL') => {
    setTerminalState(prev => ({ ...prev, securityAlertLevel: alert }));
  };

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    addMessage({
      id: uuidv4(),
      text: userText,
      sender: Sender.USER,
      timestamp: Date.now()
    });

    setIsTyping(true);

    const responseText = await sendMessageToOperator(userText, gameState);
    
    setIsTyping(false);
    addMessage({
      id: uuidv4(),
      text: responseText,
      sender: Sender.OPERATOR,
      timestamp: Date.now()
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-green font-mono flex flex-col relative overflow-hidden">
      {/* Visual Effects */}
      <div className="crt-overlay fixed inset-0 z-40 pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Screen Switcher */}
      {!gameStarted ? (
        <IntroScreen onStart={handleStartGame} />
      ) : (gameState === GameState.COMPLETED || gameState === GameState.FAILED) ? (
        <MissionReport 
            scoreState={scoreState} 
            onRestart={handleStartGame} 
            success={gameState === GameState.COMPLETED} 
        />
      ) : (
        <>
          {/* Header */}
          <header className="p-4 border-b border-cyber-green-dim flex justify-between items-center z-30 bg-cyber-black/90">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-cyber-red rounded-full animate-pulse"></div>
               <h1 className="text-xl md:text-2xl font-display font-bold tracking-widest text-white">
                 THE <GlitchText text="BREACH" as="span" className="text-cyber-green" />
               </h1>
            </div>
            <div className="text-xs text-cyber-cyan opacity-70">
              STATUS: CONNECTED
            </div>
          </header>

          {/* Stats HUD */}
          <HUD stats={terminalState} score={scoreState} />

          {/* Distraction Overlay */}
          <DistractionOverlay distractions={distractions} onInteract={handleDistractionInteract} />

          {/* Main Terminal Area */}
          <Terminal messages={messages} isTyping={isTyping} />

          {/* Input Area */}
          <div className="p-4 border-t border-cyber-green-dim bg-cyber-black z-30">
            <div className="max-w-4xl mx-auto relative flex items-center">
              <span className="absolute left-4 text-cyber-green animate-pulse">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={gameState === GameState.FAILED ? "SYSTEM LOCKED." : "Type your answer..."}
                disabled={gameState === GameState.FAILED || isTyping}
                className="w-full bg-gray-900/50 border border-cyber-green-dim text-white p-4 pl-10 focus:outline-none focus:border-cyber-green focus:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all font-mono tracking-wide placeholder-gray-600"
                autoFocus
              />
              <button 
                onClick={handleSend}
                disabled={gameState === GameState.FAILED || isTyping}
                className="absolute right-2 px-4 py-2 bg-cyber-green-dim text-black font-bold hover:bg-cyber-green disabled:opacity-50 transition-colors uppercase text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<App />);