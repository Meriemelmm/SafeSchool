import Link from 'next/link';
import { Shield, ChevronRight } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">SafeSchool</span>
          </Link>

          {/* Navigation Links - Desktop */}
          {/* <div className="hidden md:flex items-center space-x-8">
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Fonctionnement
            </Link>
            <Link href="#who-can-use" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Qui peut l'utiliser ?
            </Link>
            <Link href="#resources" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Ressources
            </Link>
          </div> */}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 px-4 py-2 transition-colors"
            >
              Se connecter
            </Link>
            <Link 
              href="/register" 
              className="hidden sm:flex items-center bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              S'inscrire
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
