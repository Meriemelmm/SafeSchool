'use client';

import React from 'react';
import { StatutSignalement } from 'shared/enums/signalement-enums';

interface Props {
  currentStatus: StatutSignalement | '';
  onChange: (status: StatutSignalement | '') => void;
}

const ALL_STATUS = [
  { value: '', label: 'Tous les statuts' },
  { value: StatutSignalement.NOUVEAU, label: 'Nouveau' },
  { value: StatutSignalement.EN_COURS, label: 'En cours' },
  { value: StatutSignalement.EN_INVESTIGATION, label: 'Investigation' },
  { value: StatutSignalement.RESOLU, label: 'Résolue' },
  { value: StatutSignalement.REJETE, label: 'Rejetée' },
  { value: StatutSignalement.ESCALADE, label: 'Escaladée' },
];

export function StatusFilter({ currentStatus, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_STATUS.map((status) => (
        <button
          key={status.value}
          onClick={() => onChange(status.value as any)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            currentStatus === status.value
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}
