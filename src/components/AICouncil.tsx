// AI Council MVP - 3 Archetypes, Local Only, Dark Mode

'use client';

import React, { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/errors';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Conversation {
  messages: Message[];
  isTyping: boolean;
  error?: string;
}

interface ArchetypeState {
  name: string;
  description: string;
  systemPrompt: string;
  conversation: Conversation;
}

interface FailedMessage {
  message: string;
  timestamp: number;
}

const initialArchetypes: ArchetypeState[] = [
  {
    name: 'The Strategist',
    description: 'Analytical, strategic, and detail-oriented.',
    systemPrompt: 'You are a strategic advisor with deep analytical skills. Focus on providing detailed, well-structured advice that considers multiple angles and long-term implications. Break down complex problems into manageable steps and highlight potential risks and opportunities. Maintain a professional, methodical approach.',
    conversation: { messages: [], isTyping: false }
  },
  {
    name: 'The Empath',
    description: 'Emotionally intelligent and supportive.',
    systemPrompt: 'You are an empathetic counselor with high emotional intelligence. Focus on understanding and addressing the emotional aspects of situations. Provide supportive, nurturing guidance while helping users explore their feelings and needs. Use compassionate language and acknowledge emotions explicitly.',
    conversation: { messages: [], isTyping: false }
  },
  {
    name: 'The Innovator',
    description: 'Creative, forward-thinking, and unconventional.',
    systemPrompt: 'You are an innovative thinker who challenges conventional wisdom. Generate creative solutions and unique perspectives. Question assumptions and explore possibilities others might miss. Balance originality with practicality, and explain your unconventional ideas clearly.',
    conversation: { messages: [], isTyping: false }
  }
];

export default function AICouncil() {
  const [archetypes, setArchetypes] = useState<ArchetypeState[]>(initialArchetypes);
  const [mainQuestion, setMainQuestion] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<Record<number, FailedMessage>>({});

  const askArchetype = async (archetypeIndex: number, userMessage: string, isRetry = false) => {
    if (!userMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    // Clear previous error state for this archetype
    if (!isRetry) {
      setFailedAttempts(current => {
        const updated = { ...current };
        delete updated[archetypeIndex];
        return updated;
      });
    }

    setArchetypes(current => current.map((archetype, idx) => 
      idx === archetypeIndex 
        ? { 
            ...archetype, 
            conversation: { 
              ...archetype.conversation,
              isTyping: true,
              error: undefined
            }
          }
        : archetype
    ));

    try {
      // Only add user message if it's not a retry
      if (!isRetry) {
        const newMessage: Message = {
          role: 'user',
          content: userMessage,
          timestamp: Date.now()
        };

        setArchetypes(current => current.map((archetype, idx) => 
          idx === archetypeIndex 
            ? {
                ...archetype,
                conversation: {
                  ...archetype.conversation,
                  messages: [...archetype.conversation.messages, newMessage]
                }
              }
            : archetype
        ));
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: archetypes[archetypeIndex].systemPrompt,
            userInput: userMessage,
            conversationHistory: archetypes[archetypeIndex].conversation.messages
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
          throw new Error(data.error || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const aiMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: Date.now()
        };

        setArchetypes(current => current.map((archetype, idx) => 
          idx === archetypeIndex 
            ? {
                ...archetype,
                conversation: {
                  ...archetype.conversation,
                  messages: [...archetype.conversation.messages, aiMessage],
                  isTyping: false,
                  error: undefined
                }
              }
            : archetype
        ));

        // Clear failed attempt if successful
        setFailedAttempts(current => {
          const updated = { ...current };
          delete updated[archetypeIndex];
          return updated;
        });
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error: unknown) {
      let errorMessage = getErrorMessage(error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
          errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
        }
      }
      
      setArchetypes(current => current.map((archetype, idx) => 
        idx === archetypeIndex 
          ? {
              ...archetype,
              conversation: {
                ...archetype.conversation,
                isTyping: false,
                error: errorMessage
              }
            }
          : archetype
      ));

      // Store failed attempt
      setFailedAttempts(current => ({
        ...current,
        [archetypeIndex]: {
          message: userMessage,
          timestamp: Date.now()
        }
      }));

      if (errorMessage.includes('rate limit')) {
        setError('Please wait a moment before sending more messages');
      }
    }
  };

  const askCouncil = useCallback(async () => {
    if (!mainQuestion.trim()) {
      setError('Please enter a question');
      return;
    }

    if (mainQuestion.length > 4000) {
      setError('Question is too long. Please shorten it.');
      return;
    }

    if (archetypes.some(a => a.conversation.isTyping)) {
      setError('Please wait for all responses before asking another question');
      return;
    }

    setError(null);
    
    // Ask all archetypes simultaneously
    await Promise.all(archetypes.map((_, idx) => askArchetype(idx, mainQuestion)));
    setMainQuestion('');
  }, [mainQuestion, archetypes]);

  const handleReply = useCallback(async () => {
    if (!replyText.trim() || selectedArchetype === null) {
      setError('Please enter a reply');
      return;
    }

    if (replyText.length > 4000) {
      setError('Reply is too long. Please shorten it.');
      return;
    }

    if (archetypes[selectedArchetype].conversation.isTyping) {
      setError('Please wait for the response before sending another message');
      return;
    }
    
    await askArchetype(selectedArchetype, replyText);
    setReplyText('');
  }, [replyText, selectedArchetype, archetypes]);

  const handleRetry = async (archetypeIndex: number) => {
    const failedAttempt = failedAttempts[archetypeIndex];
    if (failedAttempt) {
      await askArchetype(archetypeIndex, failedAttempt.message, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Council</h1>
      
      {/* Main question input */}
      <div className="space-y-4">
        <Textarea
          className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
          placeholder="Ask the council a question..."
          value={mainQuestion}
          onChange={(e) => setMainQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              askCouncil();
            }
          }}
        />
        {error && (
          <p className="text-red-500">{error}</p>
        )}
        <Button 
          disabled={archetypes.some(a => a.conversation.isTyping)} 
          onClick={askCouncil} 
          className="bg-indigo-600 hover:bg-indigo-700 w-full"
        >
          {archetypes.some(a => a.conversation.isTyping) ? 'Council is responding...' : 'Ask the Council'}
        </Button>
      </div>

      {/* Archetype responses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {archetypes.map((archetype, idx) => (
          <Card 
            key={idx} 
            className={`bg-gray-800 border ${
              selectedArchetype === idx ? 'border-indigo-500' : 'border-gray-700'
            }`}
          >
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{archetype.name}</h2>
                <Button
                  onClick={() => setSelectedArchetype(selectedArchetype === idx ? null : idx)}
                  className="text-xs bg-transparent hover:bg-gray-700"
                >
                  {selectedArchetype === idx ? 'Close Thread' : 'Reply'}
                </Button>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {archetype.conversation.messages.map((message, messageIdx) => (
                  <div 
                    key={messageIdx}
                    className={`p-2 rounded ${
                      message.role === 'user' ? 'bg-gray-700' : 'bg-gray-600'
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">
                      {message.role === 'user' ? 'You' : archetype.name}:
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
                {archetype.conversation.isTyping && (
                  <div className="text-gray-400 text-sm">Typing...</div>
                )}
                {archetype.conversation.error && (
                  <div className="space-y-2">
                    <p className="text-red-500 text-sm">{archetype.conversation.error}</p>
                    {failedAttempts[idx] && (
                      <Button
                        onClick={() => handleRetry(idx)}
                        className="w-full bg-red-600 hover:bg-red-700 text-sm"
                        disabled={archetype.conversation.isTyping}
                      >
                        Retry Message
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Individual reply area */}
              {selectedArchetype === idx && (
                <div className="space-y-2">
                  <Textarea
                    className="bg-gray-700 border-gray-600 text-white text-sm"
                    placeholder={`Reply to ${archetype.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleReply();
                      }
                    }}
                  />
                  <Button
                    onClick={handleReply}
                    disabled={archetype.conversation.isTyping}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Send Reply
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 