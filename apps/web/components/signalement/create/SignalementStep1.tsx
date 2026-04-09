'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Nature, TypeViolence, NiveauGravite } from 'shared/enums/signalement-enums';
import { SignalementFormData } from './types';

interface Props {
  data: SignalementFormData;
  onChange: (data: Partial<SignalementFormData>) => void;
}

const NATURE_OPTIONS = [
  { value: Nature.AGGRESSION, label: 'Agression' },
  { value: Nature.HARASSMENT, label: 'Harcèlement' },
];

const VIOLENCE_TYPE_OPTIONS = [
  { value: TypeViolence.PHYSICAL,       label: 'Violence physique' },
  { value: TypeViolence.VERBAL,         label: 'Violence verbale' },
  { value: TypeViolence.PSYCHOLOGICAL,  label: 'Violence psychologique' },
  { value: TypeViolence.CYBER,          label: 'Cyber-harcèlement' },
  { value: TypeViolence.SEXUAL,         label: 'Violence sexuelle' },
  { value: TypeViolence.DISCRIMINATION, label: 'Discrimination' },
  { value: TypeViolence.OTHER,          label: 'Autre' },
];

const SEVERITY_LEVELS: {
  value: NiveauGravite;
  label: string;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    value: NiveauGravite.FAIBLE,
    label: 'Faible',
    activeClass: 'bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-sm',
    inactiveClass: 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200',
  },
  {
    value: NiveauGravite.MOYEN,
    label: 'Moyen',
    activeClass: 'bg-amber-400 text-white ring-2 ring-amber-300 shadow-sm',
    inactiveClass: 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200',
  },
  {
    value: NiveauGravite.ELEVE,
    label: 'Élevé',
    activeClass: 'bg-orange-500 text-white ring-2 ring-orange-300 shadow-sm',
    inactiveClass: 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200',
  },
  {
    value: NiveauGravite.CRITIQUE,
    label: 'Critique',
    activeClass: 'bg-red-500 text-white ring-2 ring-red-300 shadow-sm',
    inactiveClass: 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200',
  },
];

export default function SignalementStep1({ data, onChange }: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    onChange({ [name]: val });
  };

  return (
    <div className="space-y-7">

      {/* ── Mode Anonyme ── */}
      <div
        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none
          ${data.isAnonymous
            ? 'bg-indigo-50 border-indigo-200'
            : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}
        onClick={() => onChange({ isAnonymous: !data.isAnonymous })}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
            ${data.isAnonymous ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Mode Anonyme</p>
            <p className="text-xs text-gray-500 font-medium">
              {data.isAnonymous
                ? 'Votre identité est cachée au personnel non autorisé'
                : 'Votre nom sera visible pour le personnel autorisé'}
            </p>
          </div>
        </div>
        <label
          className="relative inline-flex items-center cursor-pointer"
          onClick={e => e.stopPropagation()}
        >
          <input
            type="checkbox"
            name="isAnonymous"
            checked={data.isAnonymous}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner" />
        </label>
      </div>

      {/* ── Ligne : Nature + Gravité ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Nature */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Catégorie d'incident
          </label>
          <select
            name="nature"
            value={data.nature}
            onChange={handleChange}
            className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all appearance-none"
          >
            {NATURE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Gravité */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Niveau de gravité
          </label>
          <div className="flex gap-2">
            {SEVERITY_LEVELS.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => onChange({ gravite: level.value })}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                  ${data.gravite === level.value ? level.activeClass : level.inactiveClass}`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Type de violence (select simple) ── */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
          Type de violence
        </label>
        <select
          name="typeViolence"
          value={data.typeViolence}
          onChange={handleChange}
          className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all appearance-none"
        >
          {VIOLENCE_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* ── Titre du rapport ── */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
          Titre du rapport
        </label>
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Un résumé concis du problème..."
          className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-gray-300 placeholder:font-normal"
        />
      </div>

      {/* ── Description détaillée ── */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
          Description détaillée
        </label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          rows={6}
          placeholder="Veuillez fournir autant de contexte que possible. Incluez les noms, dates ou actions spécifiques si vous les connaissez."
          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-gray-300 placeholder:font-normal resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
