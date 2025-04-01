// AI Council MVP - 3 Archetypes, Local Only, Dark Mode

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Response {
  name: string;
  text: string;
}

const archetypes = [
  {
    name: 'The Strategist',
    description: 'Logical, forward-thinking, and tactical.',
    systemPrompt: 'You are a logical strategist. Provide clear, step-by-step advice based on logic and long-term planning.'
  },
  {
    name: 'The Empath',
    description: 'Emotionally attuned and nurturing.',
    systemPrompt: 'You are deeply empathetic. Respond with emotional sensitivity and support, focusing on the user\'s feelings and needs.'
  },
  {
    name: 'The Rebel',
    description: 'Unconventional, challenging norms.',
    systemPrompt: 'You are a rebellious thinker. Challenge assumptions and suggest unconventional, creative ideas.'
  }
];

export default function AICouncil() {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);

  const askCouncil = async () => {
    setLoading(true);
    const newResponses = await Promise.all(
      archetypes.map(async ({ systemPrompt, name }) => {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemPrompt, userInput: question })
        });
        const data = await res.json();
        return { name, text: data.response };
      })
    );
    setResponses(newResponses);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Council</h1>
      <Textarea
        className="bg-gray-800 border-gray-700 text-white"
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Button disabled={loading} onClick={askCouncil} className="bg-indigo-600 hover:bg-indigo-700">
        {loading ? 'Thinking...' : 'Ask the Council'}
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {responses.map(({ name, text }, idx) => (
          <Card key={idx} className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-sm whitespace-pre-wrap">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 