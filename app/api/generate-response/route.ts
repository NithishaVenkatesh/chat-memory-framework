import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];
    const useMock = process.env.USE_MOCK_RESPONSES === 'true' || !process.env.OPENAI_API_KEY;

    let response: string;

    if (useMock) {
      // Mock response generation
      const lastMessage = messages[messages.length - 1]?.content || '';
      response = `I understand you're saying: "${lastMessage}". That's an interesting point. How can I help you further?`;
    } else {
      // Use OpenAI to generate a base response
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const conversationHistory = messages
        .slice(-10)
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Provide thoughtful, accurate responses.',
          },
          ...conversationHistory,
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      response = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Response generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

