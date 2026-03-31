import Link from 'next/link';
import { Shield, Mail, Globe, Share2, MessageCircle, ShieldCheck, HeartPulse, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">SafeSchool</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              SafeSchool est une plateforme sécurisée et confidentielle dédiée à la lutte contre le harcèlement scolaire, au service de chaque élève, chaque école et chaque communauté.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-all text-white group">
                <Globe className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-all text-white group">
                <Share2 className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-all text-white group">
                <MessageCircle className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Liens rapides</h4>
            <nav className="flex flex-col space-y-4">
              <Link href="/about" className="text-sm hover:text-blue-500 transition-colors">À propos de nous</Link>
              <Link href="/guides" className="text-sm hover:text-blue-500 transition-colors">Guides et ressources</Link>
              <Link href="/contact" className="text-sm hover:text-blue-500 transition-colors">Contactez-nous</Link>
              <Link href="/blog" className="text-sm hover:text-blue-500 transition-colors">Blog Actualités</Link>
            </nav>
          </div>

          {/* Security & Privacy */}
          <div className="space-y-6">
             <h4 className="text-white text-sm font-bold uppercase tracking-wider">Sécurité & Confidentialité</h4>
            <nav className="flex flex-col space-y-4">
              <Link href="/privacy" className="flex items-center space-x-2 text-sm hover:text-blue-500 transition-colors">
                 <ShieldCheck className="h-4 w-4 shrink-0" />
                 <span>Protection des données</span>
              </Link>
              <Link href="/terms" className="text-sm hover:text-blue-500 transition-colors">Conditions d'utilisation</Link>
              <Link href="/cookie-policy" className="text-sm hover:text-blue-500 transition-colors">Politique de cookies</Link>
              <Link href="/transparancy" className="text-sm hover:text-blue-500 transition-colors">Certificats de sécurité</Link>
            </nav>
          </div>

          {/* Immediate Help Support */}
          <div className="space-y-6">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Aide d'urgence</h4>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 space-y-4">
               <div className="flex items-start space-x-3">
                 <HeartPulse className="h-5 w-5 text-red-400 shrink-0" />
                 <div>
                    <p className="text-xs font-semibold text-slate-300 uppercase">Support en cas de crise</p>
                    <p className="text-lg font-bold text-white">980</p>
                 </div>
               </div>
               <div className="flex items-start space-x-3">
                 <HelpCircle className="h-5 w-5 text-blue-400 shrink-0" />
                 <div>
                    <p className="text-xs font-semibold text-slate-300 uppercase">Numéro National Harcèlement</p>
                    <p className="text-lg font-bold text-white">3020</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs font-medium ">
            © {new Date().getFullYear()} SafeSchool Systems Inc. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-xs">
            <Link href="#" className="hover:text-blue-500">Mentions légales</Link>
            <Link href="#" className="hover:text-blue-500">Plan du site</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
