'use client';

import React from 'react';
import { FileSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ 
  title = "Aucun signalement trouvé", 
  description = "Nous n'avons trouvé aucun signalement correspondant à votre recherche.",
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-200">
      <div className="bg-blue-50 p-4 rounded-full mb-6">
        <FileSearch className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-8">
        {description}
      </p>
      {action}
    </div>
  );
}
