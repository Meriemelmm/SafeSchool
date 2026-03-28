'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trash2, Edit3, MoreVertical, RefreshCw, Filter, MapPin, Eye } from 'lucide-react';
import { etablissementService, Etablissement } from '@/lib/services/etablissement';
import { Pagination } from '../ui/Pagination';
import { EtablissementType } from 'shared/index';
import { CreateEtablissementForm } from './CreateEtablissementForm';
import { EtablissementDetailsModal } from './EtablissementDetailsModal';

interface EtablissementTableProps {
  initialEtablissements: Etablissement[];
  totalEtablissements: number;
}

export const EtablissementTable: React.FC<EtablissementTableProps> = ({ initialEtablissements, totalEtablissements }) => {
  const [etablissements, setEtablissements] = useState<Etablissement[]>(initialEtablissements || []);
  const [total, setTotal] = useState(totalEtablissements || 0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingEtablissement, setEditingEtablissement] = useState<Etablissement | null>(null);
  const [viewingEtablissement, setViewingEtablissement] = useState<Etablissement | null>(null);
  
  const [filters, setFilters] = useState({
    type: '',
  });

  const limit = 10;
  const isMounted = useRef(false);

  const fetchEtablissements = useCallback(async (p: number, f: any) => {
    setLoading(true);
    try {
      const response = await etablissementService.getAllEtablissements(p, limit, f);
      if (response && response.data) {
        setEtablissements(response.data);
        setTotal(response.meta?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch etablissements:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    fetchEtablissements(page, filters);
  }, [page, filters, fetchEtablissements]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, type: e.target.value }));
    setPage(1);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await etablissementService.toggleActivation(id);
      fetchEtablissements(page, filters);
    } catch (error) {
      console.error('Failed to toggle activation:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'établissement ${name} ?`)) {
      setDeletingId(id);
      try {
        await etablissementService.deleteEtablissement(id);
        fetchEtablissements(page, filters);
      } catch (error) {
        console.error('Failed to delete:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filters Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Gestion des établissements ({total})</h3>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filters.type}
              onChange={handleTypeChange}
              className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer appearance-none shadow-sm min-w-[200px]"
            >
              <option value="">Tous les Types</option>
              <option value={EtablissementType.ECOLE}>Écoles</option>
              <option value={EtablissementType.COLLEGE}>Collèges</option>
              <option value={EtablissementType.LYCEE}>Lycées</option>
            </select>
          </div>

          <button
            onClick={() => fetchEtablissements(page, filters)}
            className="p-2.5 text-gray-500 hover:bg-white hover:text-blue-600 border border-transparent hover:border-gray-200 rounded-lg transition-all"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Établissement</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Ville</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {etablissements && etablissements.length > 0 ? (
              etablissements.map((etab) => (
                <tr key={etab._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm ring-4 ring-blue-50">
                        {etab.nom.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {etab.nom}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">#{etab.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {etab.ville}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(etab._id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 ${
                        etab.isActive 
                          ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' 
                          : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                      }`}
                      title={etab.isActive ? "Désactiver" : "Activer"}
                    >
                       {etab.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                       <button
                         onClick={() => setViewingEtablissement(etab)}
                         className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                         title="Détails"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => setEditingEtablissement(etab)}
                         className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                         title="Modifier"
                       >
                         <Edit3 className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => handleDelete(etab._id, etab.nom)}
                         disabled={deletingId === etab._id}
                         className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                         title="Supprimer"
                       >
                         {deletingId === etab._id ? (
                           <RefreshCw className="w-4 h-4 animate-spin" />
                         ) : (
                           <Trash2 className="w-4 h-4" />
                         )}
                       </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                   {loading ? 'Interrogation du serveur...' : 'Aucun établissement ne correspond à votre recherche.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 px-8">
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
        />
      </div>

      {editingEtablissement && (
        <CreateEtablissementForm
          etablissement={editingEtablissement}
          onSuccess={() => {
            setEditingEtablissement(null);
            fetchEtablissements(page, filters);
          }}
          onCancel={() => setEditingEtablissement(null)}
        />
      )}

      {viewingEtablissement && (
        <EtablissementDetailsModal
          etablissement={viewingEtablissement}
          onClose={() => setViewingEtablissement(null)}
        />
      )}
    </div>
  );
};
