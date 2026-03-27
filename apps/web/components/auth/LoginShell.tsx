"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginSchema } from '@/app/validation/login.validation';

export default function LoginShell() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const clearError = (field: 'email' | 'password') => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
    } catch (validationError: any) {
      const errors: { email?: string; password?: string } = {};
      validationError.inner.forEach((err: any) => {
        if (err.path === 'email') errors.email = err.message;
        if (err.path === 'password') errors.password = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto border-2 border-blue-400 rounded-lg bg-white p-8 shadow-sm relative">
      <div className="flex flex-col items-center">
        <div className="text-center mb-10 w-full">
          <h1 className="text-2xl font-bold text-[#1e293b]">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-2">Login to access your secure dashboard.</p>
        </div>

        {error && (
          <div className="w-full mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@school.edu"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${fieldErrors.email
                  ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                  : 'border-gray-100 focus:ring-blue-100 focus:border-blue-400'
                  }`}
                required
              />
            </div>
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
              <Link href="#" className="text-xs font-bold text-blue-500 hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${fieldErrors.password
                  ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                  : 'border-gray-100 focus:ring-blue-100 focus:border-blue-400'
                  }`}
                required
              />
            </div>
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>

          <div className="flex items-center justify-between w-full pt-4">
            <Link
              href="/"
              className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-10 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-md transition-all flex items-center gap-2"
            >
              Log In
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
          </div>
        </form>
      </div>

      {/* Trust Badges */}
      <div className="absolute bottom-[-45px] left-0 w-full flex justify-center items-center gap-8 text-[10px] uppercase font-bold text-gray-400">
        <div className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> END-TO-END ENCRYPTED</div>
        <div className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg> SECURE DASHBOARD</div>
      </div>
    </div>
  );
}
