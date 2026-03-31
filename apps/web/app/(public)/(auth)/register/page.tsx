import RegisterShell from '@/components/register/RegisterShell';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-slate-900 tracking-tight">Créer un compte</h2>
          <p className="mt-2 text-sm text-slate-600">
             Rejoignez SafeSchool pour signaler et suivre les incidents en toute sécurité.
          </p>
        </div>
        
        <div className="mt-8 bg-white py-10 px-10 border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200">
          <RegisterShell />
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-600">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
