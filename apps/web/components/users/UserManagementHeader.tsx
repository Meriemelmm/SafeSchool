'use client';

import React, { useState } from 'react';
import { UserPlus, Download, LayoutGrid, List } from 'lucide-react';
import { CreateUserForm } from './CreateUserForm';

export const UserManagementHeader: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-1 uppercase tracking-widest">
             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
             Administration
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Gestion des <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Utilisateurs</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium max-w-md">
            Gérez les comptes, les rôles et les autorisations de tous les membres de la plateforme SafeSchool.
          </p>
        </div>

        <div className="flex items-center gap-3">
        
          
          <div className="h-10 w-px bg-gray-200 mx-2 hidden sm:block" />

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 group"
          >
            <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      {isFormOpen && (
        <CreateUserForm
          onSuccess={() => {
            setIsFormOpen(false);
            handleRefresh();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};
