'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';

interface FiltersProps {
  onSearch: (query: string) => void;
  onFilterToggle?: () => void;
}

export function SignalementFilters({ onSearch, onFilterToggle }: FiltersProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Reports</h2>
      
      <div className="flex items-center gap-4">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search reports..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8 pr-4 py-2 bg-transparent text-sm border-b border-gray-200 outline-none focus:border-blue-500 transition-colors w-40 md:w-64"
          />
          <Search className="absolute left-0 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        
        <button 
          onClick={onFilterToggle}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
