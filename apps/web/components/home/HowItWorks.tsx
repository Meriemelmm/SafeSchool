import React from 'react';
import { Send, Search, CheckCircle } from 'lucide-react';

const steps = [
  {
    title: '1. Signaler',
    description: 'Remplissez le formulaire de signalement en quelques minutes. Vous pouvez choisir de rester anonyme ou de fournir vos coordonnées.',
    icon: Send,
    color: 'bg-blue-500',
    hover: 'group-hover:bg-blue-600',
  },
  {
    title: '2. Suivre',
    description: 'Restez informé de l\'avancement de votre signalement grâce à votre code de suivi personnel et confidentiel.',
    icon: Search,
    color: 'bg-indigo-500',
    hover: 'group-hover:bg-indigo-600',
  },
  {
    title: '3. Résoudre',
    description: 'Les administrateurs de l\'école examinent le cas et prennent les mesures nécessaires pour garantir la sécurité de chacun.',
    icon: CheckCircle,
    color: 'bg-emerald-500',
    hover: 'group-hover:bg-emerald-600',
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden relative" id="how-it-works">
       {/* Background circles */}
       <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30" />
       <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-30" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="text-center mb-20 max-w-3xl mx-auto">
           <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Comment ça fonctionne ?</h2>
           <p className="text-lg text-slate-600">Un moyen simple, sécurisé et efficace de protéger chaque élève et de transformer la culture scolaire en 3 étapes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="group bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
               <div className={`${step.color} ${step.hover} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-100 transition-colors`}>
                  <step.icon className="h-8 w-8" />
               </div>
               <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">{step.title}</h3>
               <p className="text-slate-600 leading-relaxed text-lg font-medium opacity-80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
