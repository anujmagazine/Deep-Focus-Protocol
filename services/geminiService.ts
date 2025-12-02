import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION, TRAP_DATABASE, FOCUS_TASKS, LEVEL_2_CHALLENGES } from "../constants";
import { GameState } from "../types";

let ai: GoogleGenAI | null = null;
let model: GenerativeModel | null = null;
let chatSession: Chat | null = null;

// Initialize the AI service
export const initGemini = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return;
  }
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Using gemini-2.5-flash for speed and cost-effectiveness in a chat app
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
      temperature: 0.7, // Slight creativity for the persona
    },
  });
};

export const sendMessageToOperator = async (
  userMessage: string, 
  gameState: GameState
): Promise<string> => {
  if (!chatSession) {
    initGemini();
    if (!chatSession) return "SYSTEM ERROR: NEURAL LINK SEVERED (API Key Missing)";
  }

  // Injecting context about the game state to guide the LLM
  let contextInjection = `[CURRENT_GAME_STATE: ${gameState}]`;

  // Dynamic Injection Logic
  if (gameState === GameState.IDLE) {
     const task = FOCUS_TASKS[Math.floor(Math.random() * FOCUS_TASKS.length)];
     contextInjection += `\nINSTRUCTION: Start the game. Welcome the user. For Level 1, ask them to do this specific task: "${task}".`;
  }
  else if (gameState === GameState.LEVEL_2_INTRO) {
    const randomTrap = TRAP_DATABASE[Math.floor(Math.random() * TRAP_DATABASE.length)];
    const challenge = LEVEL_2_CHALLENGES[Math.floor(Math.random() * LEVEL_2_CHALLENGES.length)];
    
    contextInjection += `
    INSTRUCTION: Give the user this specific challenge: "${challenge.prompt}".
    IMMEDIATELY following the challenge, ask this exact distraction question: "${randomTrap}"
    Do not explain why. Just output the challenge and the question.
    `;
  } else if (gameState === GameState.LEVEL_2_TRAP_ACTIVE) {
    contextInjection += `
    INSTRUCTION: Analyze the user's response. 
    1. Did they answer the distraction question (the personal/gaming/social question)? If YES -> Respond with "MISSION FAILED" and explain they chased the 'shiny object'.
    2. Did they ONLY solve the challenge? If YES -> Respond with "Shield Up! Level 2 Clear."
    `;
  } else if (gameState === GameState.LEVEL_4_INTRO) {
    contextInjection += `
    INSTRUCTION: Start Level 4: The Boss Fight.
    Tell the user to visualize the Phone Numpad (1-9). Start at 5.
    Then, generate 3-4 random moves (e.g., Up, Left, Down). Ensure the final position is a valid number on the keypad.
    Ask them: "Where are you now?"
    `;
  }

  try {
    const fullMessage = `${contextInjection}\n\nPlayer Input: ${userMessage}`;
    const result = await chatSession!.sendMessage({ message: fullMessage });
    return result.text || "SYSTEM ERROR: EMPTY PACKET RECEIVED";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "SYSTEM ALERT: CONNECTION UNSTABLE. RETRYING...";
  }
};