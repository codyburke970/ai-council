import UserProfileForm from '@/components/UserProfileForm';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Main Page
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Your AI Council Profile</h1>
        <UserProfileForm />
      </div>
    </main>
  );
} 