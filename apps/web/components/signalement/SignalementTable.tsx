'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Eye, Trash2, Search, Filter } from 'lucide-react';
import { ISignalement } from 'shared/interfaces/signalement.interface';
import { StatutSignalement, Nature, TypeViolence } from 'shared/enums/signalement-enums';
import { signalementService } from '@/lib/services/signalement';
import { Pagination } from '@/components/ui/Pagination';
import { SignalementDetailsModal } from './SignalementDetailsModal';

const STATUS_OPTIONS: { value: StatutSignalement; label: string }[] = [
  { value: StatutSignalement.NOUVEAU, label: 'Nouveau' },
  { value: StatutSignalement.EN_COURS, label: 'En Cours' },
  { value: StatutSignalement.EN_INVESTIGATION, label: 'Investigation' },
  { value: StatutSignalement.RESOLU, label: 'Résolu' },
  { value: StatutSignalement.REJETE, label: 'Rejeté' },
  { value: StatutSignalement.ESCALADE, label: 'Escaladé' },
];

const NATURE_OPTIONS: { value: Nature; label: string }[] = [
  { value: Nature.AGGRESSION, label: 'Agression' },
  { value: Nature.HARASSMENT, label: 'Harcèlement' },
];

const TYPE_VIOLENCE_OPTIONS: { value: TypeViolence; label: string }[] = [
  { value: TypeViolence.PHYSICAL, label: 'Physique' },
  { value: TypeViolence.VERBAL, label: 'Verbal' },
  { value: TypeViolence.PSYCHOLOGICAL, label: 'Psychologique' },
  { value: TypeViolence.CYBER, label: 'Cyber' },
  { value: TypeViolence.SEXUAL, label: 'Sexuel' },
  { value: TypeViolence.DISCRIMINATION, label: 'Discrimination' },
  { value: TypeViolence.OTHER, label: 'Autre' },
];


export function SignalementTable({ initialData, totalItems }: { initialData: ISignalement[], totalItems: number }) {
  const [signalements, setSignalements] = useState<ISignalement[]>(initialData);
  const [total, setTotal] = useState(totalItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedSignalement, setSelectedSignalement] = useState<ISignalement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [natureFilter, setNatureFilter] = useState('');
  const [typeViolenceFilter, setTypeViolenceFilter] = useState('');
  const isMounted = React.useRef(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      if (!initialData || initialData.length === 0) {
        fetchSignalements(page);
      }
      return;
    }
    fetchSignalements(page);

  }, [page, statusFilter, natureFilter, typeViolenceFilter]);

  const fetchSignalements = async (currentPage: number) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await signalementService.getAll(currentPage, ITEMS_PER_PAGE, {
        search,
        status: statusFilter as StatutSignalement ,
        nature: natureFilter as Nature,
        typeViolence: typeViolenceFilter as TypeViolence 
      });
      setSignalements(res.data);
      setTotal(res.meta?.total || 0);
    } catch (error: any) {
      console.error('Failed to fetch signalements', error);
      setErrorMsg(error?.response?.data?.message || error.message || 'Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSignalements(1);
  };

  const handleDelete = async (id: string) => {

    try {
      await signalementService.delete(id);
      fetchSignalements(page);
    } catch (error) {
      console.error('Failed to delete signalement', error);
    }
  };

  const openDetails = (signalement: ISignalement) => {
    setSelectedSignalement(signalement);
    setIsModalOpen(true);
  };

  const handleStatusChange = (updatedSignalement: ISignalement) => {
    setSignalements(signalements.map(s => s._id === updatedSignalement._id ? updatedSignalement : s));
    if (selectedSignalement?._id === updatedSignalement._id) {
      setSelectedSignalement({ ...selectedSignalement, status: updatedSignalement.status });
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const getStatusBadge = (status: StatutSignalement) => {
    const styles: Record<StatutSignalement, string> = {
      nouveau: 'bg-blue-100 text-blue-800',
      en_cours: 'bg-yellow-100 text-yellow-800',
      en_investigation: 'bg-purple-100 text-purple-800',
      resolu: 'bg-green-100 text-green-800',
      rejete: 'bg-red-100 text-red-800',
      escalade: 'bg-orange-100 text-orange-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Rechercher par titre ou description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
          >
            <option value="">Tous les statuts</option>
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={natureFilter}
            onChange={(e) => {
              setNatureFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
          >
            <option value="">Toutes les natures</option>
            {NATURE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={typeViolenceFilter}
            onChange={(e) => {
              setTypeViolenceFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
          >
            <option value="">Tous les types</option>
            {TYPE_VIOLENCE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>


      </div>

      <div className="overflow-x-auto relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all duration-300">
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
              <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
              <span className="text-sm font-medium text-gray-700">Chargement...</span>
            </div>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Nature</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Signaleur</th>

              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {errorMsg ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-red-500 bg-red-50">
                  <div className="font-bold">Erreur de chargement des résultats:</div>
                  <div>{errorMsg}</div>
                </td>
              </tr>
            ) : signalements.length > 0 ? (
              signalements.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{new Date(s.dateIncident).toLocaleDateString('fr-FR')}</div>
                    <div className="text-xs text-gray-500 capitalize">{s.nature} • {s.typeViolence}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{s.title}</div>
                    <div className="text-xs text-gray-500 capitalize">Gravité: {s.gravite}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {s.isAnonymous || !s.reportedBy ? (
                      <span className="text-sm italic text-gray-500">Anonyme</span>
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{s.reportedBy.firstName} {s.reportedBy.lastName}</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openDetails(s)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors mr-2"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                  Aucun signalement trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-100 p-4 bg-white flex justify-center">
          <Pagination
            currentPage={page}
            totalItems={total}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setPage}
          />
        </div>
      )}

      {selectedSignalement && (
        <SignalementDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          signalement={selectedSignalement}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
