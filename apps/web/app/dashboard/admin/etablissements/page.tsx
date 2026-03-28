import React from 'react';
import { etablissementService } from '@/lib/services/etablissement';
import { EtablissementTable } from '@/components/etablissement/EtablissementTable';
import { EtablissementManagementHeader } from '@/components/etablissement/EtablissementManagementHeader';

export const metadata = {
  title: 'Gestion des Établissements | SafeSchool Admin',
  description: 'Gérez tous les établissements partenaires de la plateforme SafeSchool.',
};

export default async function AdminEtablissementsPage() {
  let initialEtabs = [];
  let totalEtabs = 0;

  try {
    const response = await etablissementService.getAllEtablissements(1, 10);
    initialEtabs = response.data || [];
    totalEtabs = response.total || 0;
  } catch (error) {
    console.error('Failed to pre-fetch etablissements:', error);
  }

  return (
    <main className="p-4 md:p-10 min-h-screen bg-gray-50/20">
      <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-1000">
        <EtablissementManagementHeader />
        
        <div className="space-y-6">
          <EtablissementTable initialEtablissements={initialEtabs} totalEtablissements={totalEtabs} />
        </div>

        {/* Info Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group hover:scale-105 transition-all">
              <div className="z-10 relative">
                 <h4 className="text-xl font-bold mb-1 text-gray-900 tracking-tight">Structures Actives</h4>
                 <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4">Statistiques temps réel</p>
                 <div className="text-4xl font-extrabold text-gray-900 tracking-tighter mb-1">{totalEtabs}</div>
                 <p className="text-sm text-gray-400 font-medium">Établissements enregistrés</p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
           </div>

           <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
              <div className="z-10 relative flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div>
                    <h4 className="text-2xl font-bold mb-2 tracking-tight">Contrôle de l'Écosystème</h4>
                    <p className="text-indigo-100/80 font-medium max-w-sm leading-relaxed">
                       Ajoutez de nouvelles écoles pour étendre le réseau de protection SafeSchool. Chaque établissement possède son propre code d'accès unique.
                    </p>
                 </div>
                 <button className="px-8 py-4 bg-white text-indigo-700 font-extrabold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest">
                    Voir les rapports par école
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-all duration-1000" />
           </div>
        </div>
      </div>
    </main>
  );
}
