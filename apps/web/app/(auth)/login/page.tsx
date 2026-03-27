import LoginShell from '@/components/auth/LoginShell';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-6 px-4">
        <div className="flex items-center gap-2">
          {/* Mock Logo */}
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2L3 6v6.5c0 5.05 3.81 9.85 9 11.5 5.19-1.65 9-6.45 9-11.5V6l-9-4zm0 18.94c-4.14-1.46-7-5.54-7-9.44V7.3l7-3.11 7 3.11v6.14c0 3.9-2.86 7.98-7 9.44z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1e293b]">SafeSchool</span>
        </div>
        <div className="text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[800px] relative">
          <LoginShell />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-gray-400 space-y-2">
          <p>© 2024 SafeSchool Initiative. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/terms" className="hover:text-gray-600 border-b border-transparent hover:border-gray-300">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-gray-600 border-b border-transparent hover:border-gray-300">Privacy Policy</Link>
            <Link href="/emergency" className="hover:text-gray-600 border-b border-transparent hover:border-gray-300 text-red-400 font-semibold">Emergency Contacts</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}