import { NextRequest, NextResponse } from 'next/server';
import { PersonalityEngine } from '@/lib/personality-engine';
import { ChatMessage, PersonalityType, ExtractedMemory } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      originalResponse,
      personalityType,
      memory,
      conversationContext,
    }: {
      originalResponse: string;
      personalityType: PersonalityType;
      memory: ExtractedMemory;
      conversationContext: ChatMessage[];
    } = body;

    if (!originalResponse || !personalityType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const engine = new PersonalityEngine();
    const transformedResponse = await engine.transformResponse(
      originalResponse,
      personalityType,
      memory || { preferences: [], emotionalPatterns: [], facts: [] },
      conversationContext || []
    );

    return NextResponse.json({ transformedResponse });
  } catch (error) {
    console.error('Response transformation API error:', error);
    return NextResponse.json(
      { error: 'Failed to transform response' },
      { status: 500 }
    );
  }
}

