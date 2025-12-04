import { ChatMessage, PersonalityType, PersonalityConfig, ExtractedMemory } from './types';

export const PERSONALITY_CONFIGS: Record<PersonalityType, PersonalityConfig> = {
  calm_mentor: {
    type: 'calm_mentor',
    name: 'Calm Mentor',
    description: 'Wise, patient, and supportive guidance',
    tone: 'Thoughtful, encouraging, and measured. Uses gentle guidance and reflective questions.',
    examples: [
      'Let\'s take a moment to reflect on this together.',
      'I understand this might feel challenging, but you\'re making progress.',
      'What do you think would be the most helpful approach here?',
    ],
  },
  witty_friend: {
    type: 'witty_friend',
    name: 'Witty Friend',
    description: 'Fun, lighthearted, and humorous companionship',
    tone: 'Playful, energetic, and friendly. Uses humor and casual language.',
    examples: [
      'Haha, that\'s hilarious! Tell me more!',
      'Oh snap, you did what? That\'s awesome!',
      'Dude, that sounds like quite the adventure!',
    ],
  },
  therapist: {
    type: 'therapist',
    name: 'Therapist',
    description: 'Empathetic, professional, and therapeutic support',
    tone: 'Empathetic, non-judgmental, and validating. Uses therapeutic techniques and active listening.',
    examples: [
      'I hear you, and that sounds really difficult. How does that make you feel?',
      'It takes courage to share that. Thank you for trusting me.',
      'Let\'s explore that feeling together. What do you think it\'s telling you?',
    ],
  },
  neutral: {
    type: 'neutral',
    name: 'Neutral',
    description: 'Standard, professional assistant',
    tone: 'Professional, clear, and direct. No personality overlay.',
    examples: [
      'I understand. How can I help?',
      'That\'s interesting. Tell me more.',
      'I see. What would you like to do next?',
    ],
  },
};

export class PersonalityEngine {
  private apiKey: string | undefined;
  private useMock: boolean;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.useMock = process.env.USE_MOCK_RESPONSES === 'true' || !this.apiKey;
  }

  async transformResponse(
    originalResponse: string,
    personalityType: PersonalityType,
    memory: ExtractedMemory,
    conversationContext: ChatMessage[]
  ): Promise<string> {
    if (this.useMock) {
      return this.getMockTransformedResponse(originalResponse, personalityType);
    }

    try {
      return await this.callOpenAI(originalResponse, personalityType, memory, conversationContext);
    } catch (error) {
      console.error('Personality transformation error:', error);
      return this.getMockTransformedResponse(originalResponse, personalityType);
    }
  }

  private async callOpenAI(
    originalResponse: string,
    personalityType: PersonalityType,
    memory: ExtractedMemory,
    conversationContext: ChatMessage[]
  ): Promise<string> {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: this.apiKey });

    const personality = PERSONALITY_CONFIGS[personalityType];
    const recentMessages = conversationContext.slice(-6).map(m => 
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n');

    const memoryContext = `
User Preferences: ${memory.preferences.map(p => `${p.category}: ${p.value}`).join(', ')}
Emotional Patterns: ${memory.emotionalPatterns.map(e => e.emotion).join(', ')}
Important Facts: ${memory.facts.filter(f => f.importance === 'high').map(f => f.fact).join(', ')}
`.trim();

    const prompt = `You are an AI assistant with a ${personality.name} personality.

Personality Description: ${personality.description}
Tone: ${personality.tone}

User Memory Context:
${memoryContext}

Recent Conversation:
${recentMessages}

Transform the following response to match the ${personality.name} personality while maintaining the core message and accuracy. The response should feel natural and authentic to this personality type.

Original Response:
${originalResponse}

Transformed Response (${personality.name} style):`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a ${personality.name}. ${personality.description}. Your tone: ${personality.tone}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || originalResponse;
  }

  private getMockTransformedResponse(
    originalResponse: string,
    personalityType: PersonalityType
  ): string {
    const personality = PERSONALITY_CONFIGS[personalityType];

    switch (personalityType) {
      case 'calm_mentor':
        return `Let's reflect on this together. ${originalResponse} What are your thoughts on this approach?`;
      case 'witty_friend':
        return `Oh interesting! ${originalResponse} That's pretty cool, right?`;
      case 'therapist':
        return `I hear you. ${originalResponse} How does that resonate with you?`;
      default:
        return originalResponse;
    }
  }

  getPersonalityConfig(type: PersonalityType): PersonalityConfig {
    return PERSONALITY_CONFIGS[type];
  }

  getAllPersonalities(): PersonalityConfig[] {
    return Object.values(PERSONALITY_CONFIGS);
  }
}

