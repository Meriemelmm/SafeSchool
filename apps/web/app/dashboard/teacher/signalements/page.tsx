import React from 'react';
import { signalementService } from '@/lib/services/signalement';
import { SignalementTable } from '@/components/signalement/SignalementTable';
import { SignalementHeader } from '@/components/signalement/SignalementHeader';
import { ISignalement } from 'shared/interfaces/signalement.interface';

export const metadata = {
  title: 'Gestion des Signalements | SafeSchool Enseignant',
  description: 'Gérez tous les signalements de la plateforme SafeSchool depuis votre tableau de bord enseignant.',
};

export default async function teacherignalementsPage() {
  let initialSignalements: ISignalement[] = [];
  let totalSignalements = 0;

  try {
    const response = await signalementService.getAll(1, 10);
    if (response && response.data) {
      initialSignalements = response.data;
      totalSignalements = response.meta?.total || 0;
    }
  } catch (error) {
    console.error('Failed to pre-fetch signalements on server:', error);
  }

  return (
    <main className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <SignalementHeader />
        <SignalementTable initialData={initialSignalements} totalItems={totalSignalements} />
      </div>
    </main>
  );
}
