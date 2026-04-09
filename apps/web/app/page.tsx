import Link from 'next/link';
import { 
  ShieldCheck, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  Users, 
  GraduationCap, 
  Heart,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 transform">
           <div className="h-96 w-96 rounded-full bg-blue-100/50 blur-3xl opacity-60 animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-blue-700 text-sm font-semibold mb-4 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Signaler en toute sécurité et confidentialité</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Chaque élève mérite un <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">endroit sûr</span> pour apprendre.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              SafeSchool offre un environnement sécurisé pour signaler le harcèlement, l'intimidation et la violence scolaire. Nous garantissons que votre voix soit entendue tout en protégeant votre identité.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto bg-blue-600 text-white text-lg font-bold px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center group"
              >
                Signaler un incident (Anonyme)
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#how-it-works" 
                className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 text-lg font-bold px-10 py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
              >
                En savoir plus
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-slate-400 font-medium text-sm">
                <div className="flex items-center space-x-2 border-r border-slate-200 pr-8 last:border-0 last:pr-0">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>100% Confidentiel</span>
                </div>
                <div className="flex items-center space-x-2 border-r border-slate-200 pr-8 last:border-0 last:pr-0">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Suivi en temps réel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Identité protégée</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Comment ça marche</h2>
            <p className="text-slate-500 font-medium italic text-lg">C'est simple, sécurisé et conçu pour un impact réel, une école à la fois.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: MessageSquare,
                title: "1. Déposer un rapport",
                desc: "Remplissez notre formulaire intuitif. Partagez les détails essentiels, joignez des preuves si nécessaire, tout en restant protégé.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: Search,
                title: "2. Suivre l'évolution",
                desc: "Recevez les mises à jour en direct. Voyez comment votre cas progresse et communiquez de manière anonyme avec notre équipe chargée de l'examen.",
                color: "bg-indigo-50 text-indigo-600"
              },
              {
                icon: CheckCircle2,
                title: "3. Résoudre",
                desc: "Les administrateurs scolaires prennent les mesures appropriées pour assurer la sécurité des élèves et ramener la paix dans l'établissement.",
                color: "bg-emerald-50 text-emerald-600"
              }
            ].map((step, idx) => (
              <div key={idx} className="group p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all space-y-6 text-left">
                <div className={`p-4 rounded-2xl w-fit ${step.color} group-hover:scale-110 transition-transform`}>
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Targeted Audience */}
      <section id="who-can-use" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-slate-900 leading-tight">Conçu pour toute la <br />communauté scolaire.</h2>
                <p className="text-slate-600 font-medium">Que vous signaliez, représentiez ou gériez, SafeSchool fournit les outils pour militer pour une éducation plus sûre.</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-blue-100 rounded-xl mr-6 h-fit">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Élèves</h4>
                    <p className="text-slate-500 text-sm mt-1">Reprenez le contrôle de votre sécurité et défendez vos droits en toute confidentialité.</p>
                  </div>
                </div>
                
                <div className="flex p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-indigo-100 rounded-xl mr-6 h-fit">
                    <Heart className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Parents</h4>
                    <p className="text-slate-500 text-sm mt-1">Soutenez le bien-être de votre enfant et assurez-vous qu'il évolue dans un cadre protecteur.</p>
                  </div>
                </div>
                
                <div className="flex p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-emerald-100 rounded-xl mr-6 h-fit">
                      <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Enseignants</h4>
                    <p className="text-slate-500 text-sm mt-1">Détectez les problèmes plus tôt et intervenez efficacement avant que la situation ne s'aggrave.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-xl">
               <div className="relative group">
                  <div className="absolute inset-0 bg-blue-600/10 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                  <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-slate-200">
                     <img 
                       src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1740&auto=format&fit=crop" 
                       alt="Étudiants solidaires" 
                       className="rounded-2xl"
                     />
                     <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-blue-50 max-w-xs space-y-2">
                        <div className="flex items-center space-x-2 text-emerald-600">
                           <CheckCircle2 className="h-5 w-5" />
                           <span className="font-bold text-sm">Près de 1200 écoles</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Faites confiance à l'outil n°1 des établissements pour la lutte contre le harcèlement scolaire.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Help / Hotline */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
           <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 truncate">Besoin d'aide immédiate ?</h2>
              <p className="text-slate-500 font-medium">Si vous ou un de vos proches êtes en danger immédiat, veuillez contacter les services d'urgence ou utiliser l'un de ces numéros d'aide vérifiés.</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-10 rounded-3xl border border-red-50 hover:border-red-100 hover:shadow-xl hover:shadow-red-50/50 transition-all space-y-4">
                <div className="bg-red-50 p-4 rounded-2xl w-fit mx-auto mb-2">
                  <PhoneCall className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Service de Crise (24/7)</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tight">980</p>
                </div>
                <p className="text-sm text-slate-400 italic">Numéro d'appel gratuit</p>
              </div>
              
              <div className="bg-white p-10 rounded-3xl border border-blue-50 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all space-y-4">
                <div className="bg-blue-50 p-4 rounded-2xl w-fit mx-auto mb-2">
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Numéro National Harcèlement</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tight">3020</p>
                </div>
                <p className="text-sm text-slate-400 italic">Accessible 09:00 - 20:00</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
