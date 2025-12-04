import { z } from 'zod';
import { ChatMessage, ExtractedMemory, UserPreference, EmotionalPattern, Fact } from './types';

const MemorySchema = z.object({
  preferences: z.array(z.object({
    category: z.string(),
    value: z.string(),
    confidence: z.number().min(0).max(1),
    evidence: z.array(z.string()),
  })),
  emotionalPatterns: z.array(z.object({
    emotion: z.string(),
    frequency: z.number().min(0).max(1),
    triggers: z.array(z.string()),
    context: z.string(),
  })),
  facts: z.array(z.object({
    fact: z.string(),
    category: z.string(),
    importance: z.enum(['high', 'medium', 'low']),
    evidence: z.array(z.string()),
  })),
});

export class MemoryExtractor {
  private apiKey: string | undefined;
  private useMock: boolean;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.useMock = process.env.USE_MOCK_RESPONSES === 'true' || !this.apiKey;
  }

  async extractMemory(messages: ChatMessage[]): Promise<ExtractedMemory> {
    if (this.useMock) {
      return this.getMockMemory(messages);
    }

    try {
      const response = await this.callOpenAI(messages);
      return MemorySchema.parse(response);
    } catch (error) {
      console.error('Memory extraction error:', error);
      return this.getMockMemory(messages);
    }
  }

  private async callOpenAI(messages: ChatMessage[]): Promise<ExtractedMemory> {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: this.apiKey });

    const conversationHistory = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `Analyze the following conversation and extract structured memory about the user. Return ONLY valid JSON matching this schema:

{
  "preferences": [{"category": "string", "value": "string", "confidence": 0.0-1.0, "evidence": ["message excerpts"]}],
  "emotionalPatterns": [{"emotion": "string", "frequency": 0.0-1.0, "triggers": ["strings"], "context": "string"}],
  "facts": [{"fact": "string", "category": "string", "importance": "high|medium|low", "evidence": ["message excerpts"]}]
}

Focus on:
- Preferences: likes, dislikes, interests, communication style
- Emotional patterns: recurring emotions, triggers, emotional context
- Facts: important personal information, relationships, experiences, goals

Conversation:
${conversationHistory}

Return ONLY the JSON object, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a memory extraction system. Return only valid JSON matching the specified schema.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content) as ExtractedMemory;
  }

  private getMockMemory(messages: ChatMessage[]): ExtractedMemory {
    // Analyze messages for basic patterns
    const allText = messages
      .filter(m => m.role === 'user')
      .map(m => m.content.toLowerCase())
      .join(' ');

    const preferences: UserPreference[] = [];
    const emotionalPatterns: EmotionalPattern[] = [];
    const facts: Fact[] = [];

    // Extract preferences
    if (allText.includes('love') || allText.includes('like')) {
      preferences.push({
        category: 'Interests',
        value: 'Positive experiences',
        confidence: 0.7,
        evidence: messages.filter(m => m.content.toLowerCase().includes('love')).slice(0, 2).map(m => m.content),
      });
    }

    if (allText.includes('work') || allText.includes('job')) {
      preferences.push({
        category: 'Career',
        value: 'Professional development',
        confidence: 0.8,
        evidence: messages.filter(m => m.content.toLowerCase().includes('work')).slice(0, 2).map(m => m.content),
      });
    }

    // Extract emotional patterns
    if (allText.includes('stressed') || allText.includes('anxious') || allText.includes('worried')) {
      emotionalPatterns.push({
        emotion: 'Anxiety',
        frequency: 0.6,
        triggers: ['work', 'deadline', 'pressure'],
        context: 'Work-related stress',
      });
    }

    if (allText.includes('happy') || allText.includes('excited') || allText.includes('great')) {
      emotionalPatterns.push({
        emotion: 'Happiness',
        frequency: 0.5,
        triggers: ['achievement', 'positive feedback', 'social interaction'],
        context: 'Positive experiences',
      });
    }

    // Extract facts
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length > 0) {
      facts.push({
        fact: `User has sent ${userMessages.length} messages`,
        category: 'Interaction',
        importance: 'medium',
        evidence: [userMessages[0].content],
      });
    }

    return {
      preferences: preferences.length > 0 ? preferences : [{
        category: 'General',
        value: 'Engaged user',
        confidence: 0.5,
        evidence: [messages[0]?.content || ''],
      }],
      emotionalPatterns: emotionalPatterns.length > 0 ? emotionalPatterns : [{
        emotion: 'Neutral',
        frequency: 0.5,
        triggers: [],
        context: 'General conversation',
      }],
      facts: facts.length > 0 ? facts : [{
        fact: 'Active conversationalist',
        category: 'Behavior',
        importance: 'low',
        evidence: [],
      }],
    };
  }
}

