'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trash2, User as UserIcon, MoreVertical, RefreshCw, Filter } from 'lucide-react';
import { userService, User, UserFilters } from '@/lib/services/users';
import { Pagination } from '../ui/Pagination';
import { UserRole } from 'shared/index';

interface UserTableProps {
  initialUsers: User[];
  totalUsers: number;
}

export const UserTable: React.FC<UserTableProps> = ({ initialUsers, totalUsers }) => {
  const [users, setUsers] = useState<User[]>(initialUsers || []);
  const [total, setTotal] = useState(totalUsers || 0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<UserFilters>({
    role: '',
  });

  const limit = 10;
  const isMounted = useRef(false);

  const fetchUsers = useCallback(async (p: number, currentFilters: UserFilters) => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(p, limit, currentFilters);
      if (response && response.data) {
        setUsers(response.data);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
   
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

   
    fetchUsers(page, filters);
  }, [page, filters, fetchUsers]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, role: e.target.value }));
    setPage(1); 
  };

  const handleDelete = async (id: string, name: string) => {
   
      setDeletingId(id);
      try {
        await userService.deleteUser(id);
        fetchUsers(page, filters);
      } catch (error) {
        console.error('Failed to delete user:', error);
      } finally {
        setDeletingId(null);
      }
    
  };

  const getRoleBadge = (role: string) => {
    const roles: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700',
      student: 'bg-blue-100 text-blue-700',
      teacher: 'bg-green-100 text-green-700',
      parent: 'bg-amber-100 text-amber-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roles[role?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
        {role || 'N/A'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filters Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Gestion des utilisateurs ({total})</h3>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filters.role}
              onChange={handleRoleChange}
              className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer appearance-none shadow-sm min-w-[200px]"
            >
              <option value="">Tous les Rôles</option>
              <option value={UserRole.STUDENT}>Élève</option>
              <option value={UserRole.TEACHER}>Professeur</option>
              <option value={UserRole.PARENT}>Parent</option>
              <option value={UserRole.ADMIN}>Administrateur</option>
            </select>
          </div>

          <button
            onClick={() => fetchUsers(page, filters)}
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
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                        {(user.firstName || user.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {user.firstName || ''} {user.lastName || ''}
                        </div>
                        <div className="text-xs text-gray-500">#{user._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                       <button
                         onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                         disabled={deletingId === user._id}
                         className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                       >
                         {deletingId === user._id ? (
                           <RefreshCw className="w-4 h-4 animate-spin" />
                         ) : (
                           <Trash2 className="w-4 h-4" />
                         )}
                       </button>
                       <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                         <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                   {loading ? 'Chargement...' : 'Aucun utilisateur trouvé.'}
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
    </div>
  );
};
