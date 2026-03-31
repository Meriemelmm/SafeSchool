import React from 'react';
import Link from 'next/link';
import { AlertCircle, ShieldCheck, Lock, UserCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Background blobs for aesthetics */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-sky-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-5xl">
        {/* Anti-harassment Badge */}
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in border border-blue-100 shadow-sm">
           <AlertCircle className="h-4 w-4" />
           <span>Signalement 100% anonyme et sécurisé</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1] animate-slide-up">
           Chaque élève mérite un <br className="hidden md:block" />
           <span className="text-blue-600 bg-clip-text">endroit sûr</span> pour apprendre.
        </h1>

        {/* Sub-headline */}
        <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-100">
           SafeSchool offre un environnement sécurisé et confidentiel pour signaler le harcèlement scolaire et la violence. 
           Faites entendre votre voix tout en protégeant votre identité.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up delay-200">
           <Link 
             href="/register" 
             className="w-full sm:w-auto bg-blue-600 text-white font-bold px-10 py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center space-x-3 text-lg group"
           >
             <AlertCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
             <span>Signaler un incident (Anonyme)</span>
           </Link>
           <Link 
             href="#confidentialite" 
             className="w-full sm:w-auto bg-white text-slate-700 font-bold px-10 py-5 rounded-2xl border-2 border-slate-100 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center space-x-3 text-lg"
           >
             <span>Sécurité & Confidentialité</span>
           </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-20 pt-8 border-t border-slate-50 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
           <div className="flex items-center space-x-2 text-slate-600 font-medium">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span>Conforme au RGPD</span>
           </div>
           <div className="flex items-center space-x-2 text-slate-600 font-medium">
              <Lock className="h-5 w-5 text-blue-500" />
              <span>Chiffrement Bout-en-Bout</span>
           </div>
           <div className="flex items-center space-x-2 text-slate-600 font-medium">
              <UserCheck className="h-5 w-5 text-blue-500" />
              <span>Protection de l'identité</span>
           </div>
        </div>
      </div>
    </section>
  );
}
