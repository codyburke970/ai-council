import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { systemPrompt, userInput } = await req.json();

    // For MVP, return a simple response
    const response = `Response from an AI with prompt: ${systemPrompt}\nTo user question: ${userInput}`;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 