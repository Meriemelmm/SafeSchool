import LoginShell from '@/components/auth/LoginShell';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">Ravi de vous revoir</h2>
          <p className="mt-2 text-sm text-slate-600">
             Veuillez vous connecter pour accéder à votre tableau de bord.
          </p>
        </div>
        
        <div className="mt-8 bg-white py-10 px-10 border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200">
          <LoginShell />
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-600">
          Vous n&apos;avez pas encore de compte ?{' '}
          <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
            S&apos;inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  );
}