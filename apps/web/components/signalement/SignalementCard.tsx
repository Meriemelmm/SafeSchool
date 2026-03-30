'use client';

import React from 'react';
import { ArrowRight, Pencil } from 'lucide-react';
import { ISignalement } from 'shared/interfaces/signalement.interface';
import { StatutSignalement, Nature, NiveauGravite } from 'shared/enums/signalement-enums';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

interface CardProps {
  signalement: ISignalement;
  onView: (id: string) => void;
}



const statusConfig: Record<string, {
  label: string;
  dotClass: string;
  bgClass: string;
  textClass: string;
  accentColor: string;
}> = {
  [StatutSignalement.NOUVEAU]: {
    label: 'Soumis',
    dotClass: 'bg-blue-500',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    accentColor: '#3B82F6',
  },
  [StatutSignalement.EN_COURS]: {
    label: 'En cours',
    dotClass: 'bg-amber-500',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    accentColor: '#F59E0B',
  },
  [StatutSignalement.EN_INVESTIGATION]: {
    label: 'En investigation',
    dotClass: 'bg-amber-500',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    accentColor: '#F59E0B',
  },
  [StatutSignalement.RESOLU]: {
    label: 'Résolu',
    dotClass: 'bg-emerald-500',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    accentColor: '#10B981',
  },
  [StatutSignalement.REJETE]: {
    label: 'Refusé',
    dotClass: 'bg-rose-500',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    accentColor: '#F43F5E',
  },
  [StatutSignalement.ESCALADE]: {
    label: 'Escaladé',
    dotClass: 'bg-rose-500',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    accentColor: '#F43F5E',
  },
};


const natureLabels: Record<string, string> = {
  [Nature.AGGRESSION]: 'Agression',
  [Nature.HARASSMENT]: 'Harcèlement',
};


const graviteConfig: Record<string, { label: string; textClass: string }> = {
  [NiveauGravite.FAIBLE]: { label: 'Faible', textClass: 'text-emerald-600' },
  [NiveauGravite.MOYEN]: { label: 'Moyen', textClass: 'text-amber-600' },
  [NiveauGravite.ELEVE]: { label: 'Élevé', textClass: 'text-orange-600' },
  [NiveauGravite.CRITIQUE]: { label: 'Critique', textClass: 'text-rose-600' },
};



export function SignalementCard({ signalement, onView }: CardProps) {
  const router = useRouter();

  const config = statusConfig[signalement.status as string] ?? {
    label: 'Inconnu',
    dotClass: 'bg-gray-400',
    bgClass: 'bg-gray-50',
    textClass: 'text-gray-500',
    accentColor: '#9CA3AF',
  };

  const gravite = signalement.gravite
    ? (graviteConfig[signalement.gravite as string] ?? null)
    : null;

  const natureLabel = signalement.nature
    ? (natureLabels[signalement.nature as string] ?? signalement.nature)
    : null;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentPath = window.location.pathname;
    if (currentPath.includes('/student')) {
      router.push(`/dashboard/student/signalement/edit/${signalement._id}`);
    } else if (currentPath.includes('/parent')) {
      router.push(`/dashboard/parent/signalement/edit/${signalement._id}`);
    } else {
      router.push(`/dashboard/student/signalement/edit/${signalement._id}`);
    }
  };

  const refCode = signalement._id
    ? `#REP-${signalement._id.substring(0, 4).toUpperCase()}`
    : '#REP-????';

  const displayDate = signalement.createdAt
    ? format(new Date(signalement.createdAt), 'd MMM yyyy', { locale: fr })
    : '—';

  return (
    <div
      onClick={() => onView(signalement._id)}
      className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:border-gray-200"
    >
      {/* Barre colorée statut */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ backgroundColor: config.accentColor }}
      />

      <div className="p-5 pt-6 flex flex-col gap-3">

        {/* Badge statut + date */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${config.bgClass} ${config.textClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
            {config.label}
          </span>
          <span className="text-[11px] text-gray-400 whitespace-nowrap">
            {displayDate}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-1">
          {signalement.title ?? signalement.nature ?? 'Sans titre'}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 min-h-[38px]">
          {signalement.description ?? 'Aucune description disponible.'}
        </p>

        {/* Footer : tags + bouton */}
        {/* Footer : tags + boutons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Bloc tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {natureLabel && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-50 text-violet-700 uppercase tracking-wide">
                {natureLabel}
              </span>
            )}

            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">
              {refCode}
            </span>

            {gravite && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-50 uppercase tracking-wide ${gravite.textClass}`}>
                {gravite.label}
              </span>
            )}
          </div>

          {/* Bloc boutons */}
          <div className="flex items-center gap-2">
            {/* Bouton Modifier */}
            <button
              onClick={handleEdit}
              title="Modifier le signalement"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            {/* Bouton Détails */}
            <button
              onClick={(e) => { e.stopPropagation(); onView(signalement._id); }}
              className="flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap"
            >
              Détails <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}