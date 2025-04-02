import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { APIError } from '@/lib/errors';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

async function retry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.message.includes('rate_limit')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.CLAUDE_API_KEY) {
      throw new APIError('Claude API key not configured', 500, 'CLAUDE_API_ERROR');
    }

    const { systemPrompt, userInput, conversationHistory = [] } = await req.json().catch(() => {
      throw new APIError('Invalid request body', 400, 'INVALID_INPUT');
    });

    if (!systemPrompt || !userInput) {
      throw new APIError('Missing required fields', 400, 'INVALID_INPUT');
    }

    if (userInput.length > 4000) {
      throw new APIError('Input too long', 400, 'INVALID_INPUT');
    }

    // Format conversation history for Claude
    const formattedHistory = conversationHistory.map((msg: Message) => {
      if (!msg.role || !msg.content) {
        throw new APIError('Invalid message format in history', 400, 'INVALID_INPUT');
      }
      return {
        role: msg.role,
        content: msg.content
      };
    });

    // Create the message with context and retry logic
    const message = await retry(async () => {
      try {
        return await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 1000,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
            ...formattedHistory,
            {
              role: 'user',
              content: userInput,
            },
          ],
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('rate_limit')) {
            throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT');
          }
          throw new APIError(error.message, 500, 'CLAUDE_API_ERROR');
        }
        throw error;
      }
    });

    // Handle different types of content from Claude's response
    let response = '';
    if (message.content[0]?.type === 'text') {
      response = message.content[0].text;
    } else {
      throw new APIError('Unexpected response format', 500, 'CLAUDE_API_ERROR');
    }

    if (!response.trim()) {
      throw new APIError('Empty response from AI', 500, 'CLAUDE_API_ERROR');
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 