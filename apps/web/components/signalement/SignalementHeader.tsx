import React from 'react';

export function SignalementHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion des Signalements</h1>
        <p className="text-sm text-gray-500 mt-1">
          Consultez et gérez les incidents signalés sur la plateforme.
        </p>
      </div>
    </div>
  );
}
