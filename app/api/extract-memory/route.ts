import { NextRequest, NextResponse } from 'next/server';
import { MemoryExtractor } from '@/lib/memory-extractor';
import { ChatMessage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const extractor = new MemoryExtractor();
    const memory = await extractor.extractMemory(messages);

    return NextResponse.json({ memory });
  } catch (error) {
    console.error('Memory extraction API error:', error);
    return NextResponse.json(
      { error: 'Failed to extract memory' },
      { status: 500 }
    );
  }
}

