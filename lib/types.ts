export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserPreference {
  category: string;
  value: string;
  confidence: number;
  evidence: string[];
}

export interface EmotionalPattern {
  emotion: string;
  frequency: number;
  triggers: string[];
  context: string;
}

export interface Fact {
  fact: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  evidence: string[];
}

export interface ExtractedMemory {
  preferences: UserPreference[];
  emotionalPatterns: EmotionalPattern[];
  facts: Fact[];
}

export type PersonalityType = 
  | 'calm_mentor'
  | 'witty_friend'
  | 'therapist'
  | 'neutral';

export interface PersonalityConfig {
  type: PersonalityType;
  name: string;
  description: string;
  tone: string;
  examples: string[];
}

