// AI Council MVP - 3 Archetypes, Local Only, Dark Mode

'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Response {
  name: string;
  text: string;
  error?: string;
}

const archetypes = [
  {
    name: 'The Strategist',
    description: 'Analytical, strategic, and detail-oriented.',
    systemPrompt: 'You are a strategic advisor with deep analytical skills. Focus on providing detailed, well-structured advice that considers multiple angles and long-term implications. Break down complex problems into manageable steps and highlight potential risks and opportunities. Maintain a professional, methodical approach.'
  },
  {
    name: 'The Empath',
    description: 'Emotionally intelligent and supportive.',
    systemPrompt: 'You are an empathetic counselor with high emotional intelligence. Focus on understanding and addressing the emotional aspects of situations. Provide supportive, nurturing guidance while helping users explore their feelings and needs. Use compassionate language and acknowledge emotions explicitly.'
  },
  {
    name: 'The Innovator',
    description: 'Creative, forward-thinking, and unconventional.',
    systemPrompt: 'You are an innovative thinker who challenges conventional wisdom. Generate creative solutions and unique perspectives. Question assumptions and explore possibilities others might miss. Balance originality with practicality, and explain your unconventional ideas clearly.'
  }
];

export default function AICouncil() {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askCouncil = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      const newResponses = await Promise.all(
        archetypes.map(async ({ systemPrompt, name }) => {
          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ systemPrompt, userInput: question })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
              throw new Error(data.error || 'Failed to get response');
            }
            
            return { name, text: data.response };
          } catch (error) {
            return { 
              name, 
              text: 'Failed to get response', 
              error: error instanceof Error ? error.message : 'Unknown error' 
            };
          }
        })
      );
      
      setResponses(newResponses);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get responses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Council</h1>
      <div className="space-y-4">
        <Textarea
          className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
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
          disabled={loading} 
          onClick={askCouncil} 
          className="bg-indigo-600 hover:bg-indigo-700 w-full"
        >
          {loading ? 'Consulting the Council...' : 'Ask the Council'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {responses.map(({ name, text, error: responseError }, idx) => (
          <Card key={idx} className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className={`text-sm whitespace-pre-wrap ${responseError ? 'text-red-500' : ''}`}>
                {responseError || text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 