"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { notificationService } from '@/lib/services/notification';

interface NotificationData {
  _id: string;
  type: string;
  message: string;
  signalementId: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

 
  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (user) {
          const history = await notificationService.getMyNotifications();
          setNotifications(history);
          console.log("notifications from context file",notifications);
          
        }
      } catch (err) {
        console.error('Erreur chargement notifications:', err);
      }
    };
    loadHistory();
  }, [user]);

  useEffect(() => {
    if (user) {
      
      const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3007';
      const newSocket = io(socketUrl, {
        query: { userId: user._id }
      });

      setSocket(newSocket);

     
      newSocket.on('new_notification', (notification: NotificationData) => {
        setNotifications((prev) => [notification, ...prev]);

       
        toast(notification.message, {
          icon: '🔔',
          duration: 6000,
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '12px'
          },
        });

       
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("SafeSchool Alerte", { body: notification.message });
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Erreur markAsRead:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
