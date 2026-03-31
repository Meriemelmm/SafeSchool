import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import Community from '@/components/home/Community';
import SupportSection from '@/components/home/SupportSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <Community />
      <SupportSection />
      
      {/* Additional decorative section or FAQ if needed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
           <h3 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Prêt à sécuriser votre école ?</h3>
           <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto font-medium">Rejoignez des centaines d'écoles qui font déjà confiance à SafeSchool pour protéger leurs élèves.</p>
           <div className="flex justify-center space-x-6">
              <button className="bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">Commencer Maintenant</button>
              <button className="bg-white text-slate-700 font-bold px-8 py-4 rounded-2xl border-2 border-slate-100 hover:border-blue-600 transition-all">Consulter les Guides</button>
           </div>
        </div>
      </section>
    </div>
  );
}