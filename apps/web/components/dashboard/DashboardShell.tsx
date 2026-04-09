// components/dashboard/DashboardShell.tsx
"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "shared/enums";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

type Props = {
  children: ReactNode;
};

export default function DashboardShell({ children }: Props) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const rawRole = user?.role;
  const role: UserRole = rawRole && Object.values(UserRole).includes(rawRole as UserRole)
    ? (rawRole as UserRole)
    : UserRole.STUDENT;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Chargement du tableau de bord...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Vous devez vous connecter pour accéder au tableau de bord.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f3f6fc] text-gray-900">
      <DashboardSidebar role={role} logout={logout} />
      <div className="flex-1 flex flex-col">
        {/* Hide header for students to match the image design */}
        {role !== UserRole.STUDENT && (
          <DashboardHeader
            userName={`${user.firstName} ${user.lastName}`}
            userId={user._id}
            role={role}
          />
        )}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}