import React from 'react';
import Image from 'next/image';
import { Users, Shield, Heart } from 'lucide-react';

const audiences = [
  {
    type: "Élèves",
    title: "Sentez-vous en sécurité partout à l'école.",
    description: "Signalez anonymement les problèmes pour obtenir de l'aide et mettre fin au harcèlement.",
    icon: Shield,
    color: "bg-blue-100/50 text-blue-600 border-blue-200"
  },
  {
    type: "Parents",
    title: "Protégez vos enfants en temps réel.",
    description: "Suivez l'état des signalements et collaborez avec l'école pour assurer la sécurité de votre enfant.",
    icon: Heart,
    color: "bg-emerald-100/50 text-emerald-600 border-emerald-200"
  },
  {
    type: "Enseignants",
    title: "Créez un environnement d'apprentissage sain.",
    description: "Identifiez rapidement les tensions et agissez avant qu'elles ne s'aggravent.",
    icon: Users,
    color: "bg-orange-100/50 text-orange-600 border-orange-200"
  }
];

export default function Community() {
  return (
    <section className="py-24 bg-white" id="community">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-12 animate-slide-left">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
               Conçue pour toute la <br className="hidden md:block" />
               <span className="text-blue-600">communauté scolaire.</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-xl font-medium">
               Que vous soyez élève, parent ou enseignant, SafeSchool vous offre les outils nécessaires pour signaler, suivre et agir face au harcèlement.
            </p>

            <div className="space-y-6">
              {audiences.map((aud, index) => (
                <div key={index} className="flex items-start space-x-6 p-6 rounded-3xl border border-slate-50 shadow-sm hover:shadow-xl transition-all group">
                   <div className={`${aud.color} w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 shadow-lg shadow-black/5`}>
                      <aud.icon className="h-7 w-7" />
                   </div>
                   <div className="pt-2">
                       <span className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1 block">{aud.type}</span>
                       <h4 className="text-lg font-bold text-slate-900 mb-2">{aud.title}</h4>
                       <p className="text-slate-500 font-medium leading-relaxed">{aud.description}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative animate-slide-right delay-200">
             {/* Main Image */}
             <div className="relative rounded-3xl overflow-hidden shadow-3xl shadow-blue-200 aspect-[4/3] border-8 border-white">
                <Image 
                  src="/students.png"
                  alt="School community"
                  fill
                  className="object-cover"
                />
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10" />
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -z-10" />
             
             {/* Floating Badge */}
             <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center space-x-4 max-w-xs animate-bounce-slow">
                 <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center rounded-full text-white shadow-lg shadow-emerald-200">
                    <Shield className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Protection garantie</p>
                    <p className="text-sm font-extrabold text-slate-900">Plus de 200 écoles sécurisées.</p>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
