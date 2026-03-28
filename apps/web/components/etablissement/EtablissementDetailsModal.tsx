'use client';

import React, { useState } from 'react';
import { X, Building2, MapPin, Hash, Phone, Mail, Calendar, Info, ShieldCheck, CheckCircle2, SlidersHorizontal, School } from 'lucide-react';
import { Etablissement } from '@/lib/services/etablissement';

interface Props {
  etablissement: Etablissement;
  onClose: () => void;
}

export const EtablissementDetailsModal: React.FC<Props> = ({ etablissement, onClose }) => {
  if (!etablissement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl">
              {etablissement.nom.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{etablissement.nom}</h2>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{etablissement.code}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
          {/* Main Info */}
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter block mb-2">Type d'établissement</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                {etablissement.type === 'lycee' ? <SlidersHorizontal className="w-5 h-5 text-blue-500" /> : <Building2 className="w-5 h-5 text-indigo-500" />}
                <span className="font-bold text-gray-700 capitalize">{etablissement.type}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter block mb-2">Localisation</label>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                   <MapPin className="w-4 h-4 text-rose-500" />
                   {etablissement.ville}
                </div>
                <div className="pl-7 text-sm text-gray-500 leading-relaxed">
                   {etablissement.adresse}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter block mb-2">Statut opérationnel</label>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${etablissement.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {etablissement.isActive ? (
                  <><CheckCircle2 className="w-4 h-4" /> Actif</>
                ) : (
                  <><Info className="w-4 h-4" /> Inactif</>
                )}
              </div>
            </div>
          </div>

          {/* Contact & Meta */}
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter block mb-2">Coordonnées de contact</label>
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                   <Mail className="w-4 h-4 text-blue-500" />
                   {etablissement.email || 'Non renseigné'}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                   <Phone className="w-4 h-4 text-blue-500" />
                   {etablissement.telephone || 'Non renseigné'}
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3 border-t border-gray-50">
               <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-bold uppercase">ID Système</span>
                  <span className="text-gray-600 font-mono tracking-tighter">#{etablissement._id}</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-bold uppercase">Créé le</span>
                  <span className="text-gray-600 font-medium">{new Date(etablissement.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
               </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
               <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
               <p className="text-xs text-blue-800 leading-normal">
                  Toutes les données de cet établissement sont sécurisées et conformes aux protocoles SafeSchool.
               </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex justify-end">
           <button
             onClick={onClose}
             className="px-8 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all active:scale-95"
           >
              Fermer
           </button>
        </div>
      </div>
    </div>
  );
};
