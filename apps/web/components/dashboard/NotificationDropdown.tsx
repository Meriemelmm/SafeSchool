"use client";

import React, { useState } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import Link from 'next/link';

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="relative">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
      >
        <Bell className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-indigo-600 animate-swing' : 'text-gray-400 group-hover:text-indigo-500'}`} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

   
      {isOpen && (
        <>
          {/* Overlay closure handler */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl shadow-indigo-200/50 border border-indigo-50 z-50 overflow-hidden transform animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-tight">Notifications</h3>
              <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
                {unreadCount} Nouvelles
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto overflow-x-hidden">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs font-medium text-gray-400">Aucune notification pour le moment.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group ${!notif.isRead ? 'bg-indigo-50/20' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-indigo-600' : 'bg-transparent'}`} />
                      <div className="flex-grow">
                        <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'}`}>
                          {notif.message}
                        </p>
                        <p className="text-[9px] text-gray-300 font-bold uppercase mt-1">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="p-1.5 opacity-0 group-hover:opacity-100 bg-white rounded-lg shadow-sm text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all ring-1 ring-indigo-50"
                          title="Marquer comme lu"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

           
          </div>
        </>
      )}
    </div>
  );
}
