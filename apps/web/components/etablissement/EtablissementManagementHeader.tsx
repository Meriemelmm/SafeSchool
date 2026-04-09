'use client';

import React, { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { CreateEtablissementForm } from '@/components/etablissement/CreateEtablissementForm';

export const EtablissementManagementHeader: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Établissements</h1>
          <p className="text-sm text-gray-500">Gérez les structures scolaires et leurs informations de contact.</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nouvel Établissement
        </button>
      </div>

      {isFormOpen && (
        <CreateEtablissementForm
          onSuccess={() => {
            setIsFormOpen(false);
            window.location.reload();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};
