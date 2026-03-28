import React from 'react';
import { userService } from '@/lib/services/users';
import { UserTable } from '@/components/users/UserTable';
import { UserManagementHeader } from '@/components/users/UserManagementHeader';
import { User } from '@/lib/services/users';

export const metadata = {
  title: 'Gestion des Utilisateurs | SafeSchool Admin',
  description: 'Gérez tous les utilisateurs de la plateforme SafeSchool depuis votre tableau de bord administrateur.',
};

export default async function AdminUsersPage() {
  let initialUsers: User[] = [];
  let totalUsers = 0;

  try {
    const response = await userService.getAllUsers(1, 10);
    if (response) {
      initialUsers = response.data || [];
      totalUsers = response.total || 0;
    }
  } catch (error) {
    console.error('Failed to pre-fetch users on server:', error);
  }

  return (
    <main className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <UserManagementHeader />
        <UserTable initialUsers={initialUsers} totalUsers={totalUsers} />
      </div>
    </main>
  );
}
