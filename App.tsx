
import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { HUD } from './components/HUD';
import { Terminal } from './components/Terminal';
import { GlitchText } from './components/GlitchText';
import { IntroScreen } from './components/IntroScreen';
import { initGemini, sendMessageToOperator } from './services/geminiService';
import { Message, Sender, GameState, TerminalState } from './types';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [terminalState, setTerminalState] = useState<TerminalState>({
    signalStrength: 10,
    bandwidthUsage: 5,
    securityAlertLevel: 'LOW'
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Triggered when user clicks "Initialize Simulation" on Intro Screen
  const handleStartGame = () => {
    setGameStarted(true);
    initGemini();
    
    // Initial welcome message starts here, not on mount
    setTimeout(() => {
        addMessage({
          id: 'init-1',
          text: "SYSTEM ONLINE.\n\nWelcome, Runner. I am Operator.\n\nWe are going to train your brain to focus like a pro gamer. It takes just 15 minutes.\n\nAre you ready? Type 'Start' to begin.",
          sender: Sender.OPERATOR,
          timestamp: Date.now()
        });
    }, 800);
  };

  // Monitor Game State logic based on keyword triggers from AI or explicit flow
  React.useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];

    if (lastMsg.sender === Sender.OPERATOR) {
      const text = lastMsg.text.toUpperCase();
      
      // State Transitions based on Operator Output logic
      if (gameState === GameState.IDLE && (text.includes("SCAN") || text.includes("LEVEL 1"))) {
        setGameState(GameState.LEVEL_1_INTRO);
        updateStats(30, 20, 'LOW');
      } else if (gameState === GameState.LEVEL_1_INTRO && (text.includes("SHIELD") || text.includes("LEVEL 2"))) {
        setGameState(GameState.LEVEL_2_INTRO);
        updateStats(60, 45, 'MED');
      } else if (gameState === GameState.LEVEL_2_INTRO && (text.includes("?") || text.includes("QUEST"))) {
        // Operator just asked the trap question
        setGameState(GameState.LEVEL_2_TRAP_ACTIVE);
        updateStats(65, 80, 'HIGH');
      } else if (gameState === GameState.LEVEL_2_TRAP_ACTIVE) {
        if (text.includes("GAME OVER") || text.includes("FAILED")) {
           setGameState(GameState.FAILED);
           updateStats(0, 0, 'CRITICAL');
        } else if (text.includes("SHIELD HOLDS") || text.includes("COMPLETE") || text.includes("LEVEL 3")) {
           setGameState(GameState.LEVEL_3_INTRO);
           updateStats(90, 60, 'LOW');
        }
      }
    }
  }, [messages, gameState]);

  const updateStats = (signal: number, bandwidth: number, alert: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL') => {
    setTerminalState({ signalStrength: signal, bandwidthUsage: bandwidth, securityAlertLevel: alert });
  };

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Add user message
    addMessage({
      id: uuidv4(),
      text: userText,
      sender: Sender.USER,
      timestamp: Date.now()
    });

    setIsTyping(true);

    // AI Logic
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
      <div className="crt-overlay fixed inset-0 z-50 pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Main Content Switcher */}
      {!gameStarted ? (
        <IntroScreen onStart={handleStartGame} />
      ) : (
        <>
          {/* Header */}
          <header className="p-4 border-b border-cyber-green-dim flex justify-between items-center z-40 bg-cyber-black/90">
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
          <HUD stats={terminalState} />

          {/* Main Terminal Area */}
          <Terminal messages={messages} isTyping={isTyping} />

          {/* Input Area */}
          <div className="p-4 border-t border-cyber-green-dim bg-cyber-black z-40">
            <div className="max-w-4xl mx-auto relative flex items-center">
              <span className="absolute left-4 text-cyber-green animate-pulse">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={gameState === GameState.FAILED ? "SYSTEM LOCKED. REFRESH TO RESTART." : "Type your answer..."}
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
            <div className="text-center mt-2 text-[10px] text-gray-500">
              SECURE CONNECTION // DO NOT CLOSE
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
