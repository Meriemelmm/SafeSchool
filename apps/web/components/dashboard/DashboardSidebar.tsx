// components/dashboard/DashboardSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserRole } from "shared/enums";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  MessageSquare,
  LogOut,
} from "lucide-react";

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const menuByRole: Record<UserRole, SidebarItem[]> = {
  admin: [
    { href: "/dashboard/admin", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Gestion des utilisateurs", icon: FileText },
    { href: "/dashboard/admin/etablissements", label: "Gestion des établissements", icon: BookOpen },
    { href: "/dashboard/admin/signalement", label: "Gestion des signalements", icon: MessageSquare },
  ],
  teacher: [
    { href: "/dashboard/teacher", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/dashboard/teacher/signalements", label: "Signalements", icon: FileText },
  ],
  student: [
    { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/student/signalement", label: "Mes Signalements", icon: FileText },
    { href: "/dashboard/student/signalement/create", label: "Signaler un incident", icon: MessageSquare },
  ],
  parent: [
    { href: "/dashboard/parent", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/dashboard/parent/signalement", label: "Mes Signalements", icon: FileText },
    { href: "/dashboard/parent/signalement/create", label: "Signaler un incident", icon: MessageSquare },
  ],
};

type Props = {
  role: UserRole;
  logout: () => Promise<void>;
};

export default function DashboardSidebar({ role, logout }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const menu = menuByRole[role] || menuByRole.student;

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-72 bg-white border-r border-gray-200 shadow-lg flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
          SS
        </div>
        <div>
          <p className="text-lg font-bold text-blue-700">SafeSchool</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{role}</p>
        </div>
      </div>

      <nav className="px-4 py-5 space-y-1 flex-1 overflow-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}