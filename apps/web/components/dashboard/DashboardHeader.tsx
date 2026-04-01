"use client";
import { UserRole } from "shared/enums";
import NotificationDropdown from "./NotificationDropdown";
import { Moon, User, ChevronDown } from "lucide-react";
import Link from "next/link";

type Props = {
    userName: string;
    userId: string;
    role: UserRole;
};

export default function DashboardHeader({ userName, userId, role }: Props) {
    return (
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
            {/* Page Title */}
            <h2 className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight">
                Dashboard
            </h2>

            {/* Right section: Profile & Notifications */}
            <div className="flex items-center gap-6">
                <NotificationDropdown />
                
                {/* Dark Mode Icon */}
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <Moon size={20} fill="#64748b" />
                </button>

                <div className="h-8 w-[1.5px] bg-slate-100" />

                {/* User Section Link to Profile */}
                <Link href="/dashboard/profile" className="group flex items-center gap-4 hover:opacity-80 transition-all">
                    <div className="text-right hidden sm:block">
                        <p className="text-[13px] font-bold text-slate-700 leading-none mb-1 group-hover:text-blue-600 transition-colors">
                            {userName}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 tracking-tight leading-none">
                            ID: #{userId.slice(-5).toUpperCase()}
                        </p>
                    </div>
                    
                    {/* User Avatar */}
                    <div className="relative">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all border border-slate-200 group-hover:border-blue-100">
                            <User size={18} fill="currentColor" />
                        </div>
                    </div>
                </Link>
            </div>
        </header>
    );
}
