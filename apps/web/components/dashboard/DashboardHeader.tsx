"use client";
import { UserRole } from "shared/enums";

type Props = {
    userName: string;
    userId: string;
    role: UserRole;
};

export default function DashboardHeader({ userName, userId, role }: Props) {
    return (
        <header className="h-20 bg-white border-b border-gray-200 px-4 lg:px-8 flex items-center justify-between">
            <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-xs lg:text-sm text-gray-500">Bienvenue, {userName} ({role})</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500">Anonymous ID</p>
                    <p className="text-sm font-semibold text-gray-800">{userId.slice(-6)}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full text-white flex items-center justify-center">
                    {userName?.[0] ?? "U"}
                </div>
            </div>
        </header>
    );
}
