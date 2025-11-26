import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION, TRAP_DATABASE } from "../constants";
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

  // Specific instructions for Level 2 Trap logic to ensure reliable execution
  if (gameState === GameState.LEVEL_2_INTRO) {
    const randomTrap = TRAP_DATABASE[Math.floor(Math.random() * TRAP_DATABASE.length)];
    contextInjection += `
    INSTRUCTION: Give the user a short alphanumeric sequence (e.g., X-9-Y-2). 
    IMMEDIATELY following the sequence, ask this exact distraction question: "${randomTrap}"
    Do not explain why. Just output the sequence and the question.
    `;
  } else if (gameState === GameState.LEVEL_2_TRAP_ACTIVE) {
    contextInjection += `
    INSTRUCTION: Analyze the user's response. 
    1. Did they answer the distraction question (the personal/gaming/social question)? If YES -> Respond with "MISSION FAILED" and explain they chased the 'shiny object'.
    2. Did they ONLY repeat the sequence? If YES -> Respond with "ACCESS GRANTED" and praise their filtering capability.
    `;
  }

  try {
    const fullMessage = `${contextInjection}\n\nRunner Input: ${userMessage}`;
    const result = await chatSession!.sendMessage({ message: fullMessage });
    return result.text || "SYSTEM ERROR: EMPTY PACKET RECEIVED";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "SYSTEM ALERT: CONNECTION UNSTABLE. RETRYING...";
  }
};
