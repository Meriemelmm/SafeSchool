import React from 'react';
import { Phone, HeartPulse, LifeBuoy } from 'lucide-react';

export default function SupportSection() {
  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-700/10 via-slate-900 to-slate-900 opacity-80" />
      
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="text-center mb-16">
           <h2 className="text-4xl font-extrabold text-white mb-6">Besoin d'aide immédiate ?</h2>
           <p className="text-lg text-slate-400 max-w-2xl mx-auto">
             Si vous ou quelqu'un que vous connaissez êtes en danger immédiat, veuillez contacter les services d'urgence ou utiliser ces lignes d'assistance vérifiées.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           {/* Support Card 1 */}
           <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
              <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                 <HeartPulse className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight uppercase">Support en cas de crise</h3>
              <p className="text-5xl font-black text-blue-600 mb-4 tracking-tighter">980</p>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Disponible 24h/24, 7j/7</span>
           </div>

           {/* Support Card 2 */}
           <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-500/20 group-hover:-rotate-6 transition-transform">
                 <LifeBuoy className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight uppercase">National Helpline</h3>
              <p className="text-5xl font-black text-emerald-600 mb-4 tracking-tighter">3020</p>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Appel Gratuit & Confidentiel</span>
           </div>
        </div>

        {/* Emergency reminder */}
        <div className="mt-16 flex flex-col items-center justify-center space-y-4">
           <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl animate-pulse">
              <Phone className="h-5 w-5 text-red-500" />
              <span className="text-red-400 font-bold uppercase tracking-widest text-xs">Urgences vitales : Composez le 17 ou 112</span>
           </div>
        </div>
      </div>
    </section>
  );
}
