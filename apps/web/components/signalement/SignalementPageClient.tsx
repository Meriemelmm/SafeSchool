'use client';

import React, { useState, useMemo } from 'react';
import { ISignalement } from 'shared/interfaces/signalement.interface';
import { SignalementCard } from './SignalementCard';
import { SignalementFilters } from './SignalementFilters';
import { EmptyState } from './EmptyState';
import { SignalementDetailsModal } from './SignalementDetailsModal';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { signalementService } from '@/lib/services/signalement';
import { Pagination } from '@/components/ui/Pagination';

interface PageClientProps {
  initialData: ISignalement[];
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function SignalementPageClient({ initialData = [], title, description, children }: PageClientProps) {
  const [search, setSearch] = useState('');
  const [serverSearch, setServerSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [signalements, setSignalements] = useState<ISignalement[]>(initialData);
  const [loadingData, setLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

  React.useEffect(() => {
    const loadMyReports = async () => {
      // Always load from API to ensure fresh data
      setLoadingData(true);
      try {
        const res = await signalementService.getMyReports(currentPage, ITEMS_PER_PAGE, serverSearch);
        if (res.data) {
          setSignalements(res.data);
          setTotalItems(res.meta?.total || 0);
        }
      } catch (err: any) {
        console.error('Erreur chargement de mes signalements :', err);
        setFetchError(err?.response?.data?.message || err?.message || 'Erreur de connexion.');
      } finally {
        setLoadingData(false);
      }
    };
    loadMyReports();
  }, [currentPage, serverSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFetchError(null);
  };

  const filteredData = useMemo(() => {
   
    return signalements || [];
  }, [signalements]);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setServerSearch(searchTerm);
    setCurrentPage(1); 
  };
const handleDeleted = (id: string) => {
  setSignalements((prev) => prev.filter((s) => s._id !== id));
  setTotalItems((prev) => prev - 1);
};
  const handleCreate = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/student')) {
      router.push('/dashboard/student/signalement/create');
    } else if (currentPath.includes('/parent')) {
      router.push('/dashboard/parent/signalement/create');
    } else {
      router.push('/dashboard/student/signalement/create');
    }
  };
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      {/* Header section from image */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">
            {title || 'Welcome, Anonymous Student.'}
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            {description || 'Tracking your impact and institutional narrative.'}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200/50 transition-all active:scale-95"
        >
          <div className="bg-white/20 p-1 rounded-full">
            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          Créer un nouveau signalement
        </button>
      </div>

      <SignalementFilters onSearch={handleSearch} />

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {loadingData ? (
          <div className="col-span-full p-6 text-center text-gray-500">Chargement des signalements...</div>
        ) : fetchError ? (
          <div className="col-span-full p-6 text-center text-red-500">{fetchError}</div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
           <SignalementCard
  key={item._id}
  signalement={item}
  onView={(id) => setSelectedId(id)}
  onDeleted={handleDeleted}  // ← ajoute cette ligne
/>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              title="Aucun signalement"
              description={search ? "Aucun résultat trouvé pour votre recherche." : "Vous n'avez pas encore créé de signalement."}
              action={!search && (
                <button
                  onClick={handleCreate}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Créer un signalement
                </button>
              )}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loadingData && !fetchError && totalItems > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}
      {/* Details Modal integration */}
      {selectedId && (
        <SignalementDetailsModal
          isOpen={!!selectedId}
          onClose={() => setSelectedId(null)}
          signalement={initialData.find(s => s._id === selectedId) || null}
          onStatusChange={() => { }} // User space is read-only
          readOnly={true}
        />
      )}
    </div>
  );
}
