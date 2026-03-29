'use client';

import React from 'react';
import { Clock, MapPin, Info, CalendarDays } from 'lucide-react';
import { SignalementFormData } from './types';

interface Props {
  data: SignalementFormData;
  onChange: (data: Partial<SignalementFormData>) => void;
}

const LIEUX_RAPIDES = [
 
  'Couloir',
  'Salle de classe',
  'Cafétéria',
  'Toilettes',
  'Vestiaires',
  'Terrain de sport',
  'Bus scolaire',
];

export default function SignalementStep2({ data, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-7">

      {/* ── Date ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Date de l'incident
          </label>
          <input
            type="date"
            name="dateIncident"
            value={data.dateIncident}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all"
          />
          <p className="text-xs text-gray-400 font-medium pl-1">
            Sélectionnez la date à laquelle l'incident s'est produit
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Heure approximative
          </label>
          <input
            type="time"
            name="timeIncident"
            className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all"
          />
          <p className="text-xs text-gray-400 font-medium pl-1">
            Heure approximative (facultatif)
          </p>
        </div>
      </div>

      {/* ── Localisation ── */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
          Lieu de l'incident
        </label>
        <input
          type="text"
          name="location"
          value={data.location}
          onChange={handleChange}
          placeholder="Où l'incident s'est-il produit ?"
          className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-gray-300 placeholder:font-normal"
        />

        {/* Lieux rapides */}
        <div className="flex flex-wrap gap-2 pt-1">
          {LIEUX_RAPIDES.map(loc => (
            <button
              key={loc}
              type="button"
              onClick={() => onChange({ location: loc })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border
                ${data.location === loc
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* ── Info box ── */}
      <div className="flex gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Info className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 mb-1">Pourquoi avons-nous besoin de ces informations ?</h4>
          <p className="text-sm text-blue-600 font-medium leading-relaxed">
            Savoir précisément où et quand l'incident s'est produit nous permet d'identifier 
            les ressources disponibles (surveillance, caméras, témoins) pour mieux traiter votre signalement.
          </p>
        </div>
      </div>
    </div>
  );
}
