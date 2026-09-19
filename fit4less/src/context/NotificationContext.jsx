// src/context/NotificationContext.jsx
import { createContext, useState, useCallback } from "react";

export const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "checkin", title: "Juan Dela Cruz checked in", time: "2 min ago", read: false },
  { id: 2, type: "expiring", title: "Pedro Cruz's membership expires in 3 days", time: "1 hour ago", read: false },
  { id: 3, type: "payment", title: "New payment: ₱800 from Maria Santos", time: "2 hours ago", read: false },
  { id: 4, type: "checkin", title: "Ana Reyes checked in", time: "3 hours ago", read: true },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Push a new notification. Always appears at the top, unread.
  const addNotification = useCallback(({ type, title }) => {
    const newNotif = {
      id: Date.now() + Math.random(),
      type,
      title,
      time: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}