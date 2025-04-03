'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface PersonaInfo {
  name: string;
  description: string;
  strengths: string[];
  bestFor: string[];
  icon: string;
}

const personas: PersonaInfo[] = [
  {
    name: 'The Strategist',
    description: 'Analytical, strategic, and detail-oriented advisor focused on systematic problem-solving.',
    strengths: [
      'Long-term planning',
      'Risk assessment',
      'Data-driven analysis',
      'Strategic frameworks'
    ],
    bestFor: [
      'Career planning',
      'Business decisions',
      'Resource allocation',
      'Process optimization'
    ],
    icon: '🎯'
  },
  {
    name: 'The Empath',
    description: 'Emotionally intelligent counselor who helps navigate personal and interpersonal challenges.',
    strengths: [
      'Emotional awareness',
      'Active listening',
      'Conflict resolution',
      'Relationship building'
    ],
    bestFor: [
      'Personal growth',
      'Relationship advice',
      'Team dynamics',
      'Work-life balance'
    ],
    icon: '💝'
  },
  {
    name: 'The Innovator',
    description: 'Creative thinker who challenges conventional wisdom and explores new possibilities.',
    strengths: [
      'Creative problem-solving',
      'Pattern recognition',
      'Future thinking',
      'Paradigm shifting'
    ],
    bestFor: [
      'Brainstorming',
      'Innovation strategy',
      'Breaking deadlocks',
      'Alternative perspectives'
    ],
    icon: '💡'
  },
  {
    name: 'Council Consensus',
    description: 'Synthesizes the collective wisdom of all council members into actionable insights.',
    strengths: [
      'Balanced perspective',
      'Insight synthesis',
      'Clear summarization',
      'Actionable recommendations'
    ],
    bestFor: [
      'Complex decisions',
      'Multi-faceted problems',
      'Balanced solutions',
      'Final recommendations'
    ],
    icon: '⚖️'
  }
];

export default function PersonasPage() {
  return (
    <main className="container mx-auto py-8 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <Link 
          href="/" 
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back to Council
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Meet Your AI Council</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Your AI Council consists of specialized advisors, each bringing unique perspectives and strengths to help you make better decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personas.map((persona) => (
          <Card key={persona.name} className="bg-gray-800 hover:bg-gray-750 transition-shadow border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{persona.icon}</span>
                <h2 className="text-xl font-semibold text-white">{persona.name}</h2>
              </div>
              <p className="text-gray-300 mb-4">{persona.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-white mb-2">Key Strengths</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {persona.strengths.map((strength) => (
                      <li key={strength}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-2">Best For</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {persona.bestFor.map((use) => (
                      <li key={use}>{use}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
} 