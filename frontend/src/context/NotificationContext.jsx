// frontend/src/context/NotificationContext.jsx
import { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getNotifications, markNotificationRead } from '../api/adminApi';
import useAuth from '../hooks/useAuth';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const clientRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
      const { data } = await getNotifications({ page: 0, size: 20 });
      const items = data.data?.content || [];
      setNotifications(items);
      setUnreadCount(items.filter(n => !n.read).length);
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!currentUser) return;
    try {
      const client = new Client({
        webSocketFactory: () => new SockJS('/ws'),
        onConnect: () => {
          client.subscribe(`/topic/notifications/${currentUser.id}`, (msg) => {
            try {
              const notification = JSON.parse(msg.body);
              setNotifications(prev => [notification, ...prev]);
              setUnreadCount(prev => prev + 1);
            } catch {}
          });
        },
        onStompError: () => {},
        onWebSocketError: () => {},
        reconnectDelay: 5000,
      });
      client.activate();
      clientRef.current = client;
      return () => { try { client.deactivate(); } catch {} };
    } catch {}
  }, [currentUser]);

  const markRead = useCallback(async (id) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}
