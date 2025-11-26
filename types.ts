export enum Sender {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  SYSTEM = 'SYSTEM'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isGlitch?: boolean;
}

export enum GameState {
  IDLE = 'IDLE', // Before start
  LEVEL_1_INTRO = 'LEVEL_1_INTRO',
  LEVEL_1_ACTION = 'LEVEL_1_ACTION',
  LEVEL_2_INTRO = 'LEVEL_2_INTRO',
  LEVEL_2_TRAP_ACTIVE = 'LEVEL_2_TRAP_ACTIVE', // The crucial moment
  LEVEL_3_INTRO = 'LEVEL_3_INTRO',
  LEVEL_3_ACTION = 'LEVEL_3_ACTION',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface TerminalState {
  signalStrength: number; // 0 to 100
  bandwidthUsage: number; // 0 to 100
  securityAlertLevel: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
}