'use client';

import AICouncil from '@/components/AICouncil';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto">
      <div className="flex justify-end p-4">
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