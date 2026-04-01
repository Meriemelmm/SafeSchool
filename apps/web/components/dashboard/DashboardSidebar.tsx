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
  User,
  LogOut,
  Shield,
  Lock
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
    { href: "/dashboard/profile", label: "Mon Profil", icon: User },
  ],
  teacher: [
    { href: "/dashboard/teacher", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/dashboard/teacher/signalements", label: "Signalements", icon: FileText },
    { href: "/dashboard/profile", label: "Mon Profil", icon: User },
  ],
  student: [
    { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/student/signalement/create", label: "Signaler un incident", icon: MessageSquare },
    { href: "/dashboard/student/signalement", label: "Mes Signalements", icon: FileText },
    { href: "/dashboard/profile", label: "Mon Profil", icon: User },
  ],
  parent: [
    { href: "/dashboard/parent", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/dashboard/parent/signalement/create", label: "Signaler un incident", icon: MessageSquare },
    { href: "/dashboard/parent/signalement", label: "Mes Signalements", icon: FileText },
    { href: "/dashboard/profile", label: "Mon Profil", icon: User },
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
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="px-8 py-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Shield size={22} fill="white" />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">SafeSchool</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-slate-50 text-slate-900 border border-slate-100 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={20} className={active ? "text-slate-900" : "text-slate-400"} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[15px] ${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Identity Shield Card */}
      <div className="px-6 mb-4">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-slate-500">
                <Lock size={12} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-wider">Identity Shield Active</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Your identity is hidden from school administrators by default.
            </p>
        </div>
      </div>

      {/* Sign Out */}
      <div className="px-6 py-6 border-t border-slate-50">
        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-600 transition-colors group"
        >
          <LogOut size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
          <span className="text-[15px] font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}