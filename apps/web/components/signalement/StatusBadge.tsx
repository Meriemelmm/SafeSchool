'use client';

import React from 'react';
import { StatutSignalement } from 'shared/enums/signalement-enums';

interface Props {
  status: StatutSignalement;
  className?: string;
}

const statusConfig: Record<StatutSignalement, { label: string; classes: string }> = {
  [StatutSignalement.NOUVEAU]: {
    label: 'Nouveau',
    classes: 'bg-blue-50 text-blue-700 border-blue-100 uppercase font-bold tracking-tight',
  },
  [StatutSignalement.EN_COURS]: {
    label: 'En cours',
    classes: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  [StatutSignalement.EN_INVESTIGATION]: {
    label: 'Investigation',
    classes: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
  [StatutSignalement.RESOLU]: {
    label: 'Résolu',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  [StatutSignalement.REJETE]: {
    label: 'Rejeté',
    classes: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  [StatutSignalement.ESCALADE]: {
    label: 'Escaladé',
    classes: 'bg-purple-50 text-purple-700 border-purple-100 shadow-sm',
  },
};

export function StatusBadge({ status, className = '' }: Props) {
  const config = statusConfig[status] || { label: status, classes: 'bg-gray-100 text-gray-700' };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] border leading-none inline-flex items-center justify-center min-w-[80px] text-center ${config.classes} ${className}`}>
      {config.label}
    </span>
  );
}
