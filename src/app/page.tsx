'use client';

import AICouncil from '@/components/AICouncil';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto">
      <div className="flex justify-end gap-4 p-4">
        <Link 
          href="/personas" 
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Meet the Council
        </Link>
        <span className="text-gray-300">|</span>
        <Link 
          href="/profile" 
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Edit Your Profile →
        </Link>
      </div>
      <AICouncil />
    </main>
  );
} 