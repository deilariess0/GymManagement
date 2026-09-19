import { createContext, useState, useCallback, useRef } from "react";

export const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "checkin", title: "Juan Dela Cruz checked in", time: "2 min ago", read: false },
  { id: 2, type: "expiring", title: "Pedro Cruz's membership expires in 3 days", time: "1 hour ago", read: false },
  { id: 3, type: "payment", title: "New payment: ₱800 from Maria Santos", time: "2 hours ago", read: false },
  { id: 4, type: "checkin", title: "Ana Reyes checked in", time: "3 hours ago", read: true },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeToasts, setActiveToasts] = useState([]); // <-- New state for popups

  const removeToast = useCallback((id) => {
    setActiveToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Push a new notification. Appears in the Topbar AND as a popup.
  const addNotification = useCallback(({ type, title }) => {
    const newNotif = {
      id: Date.now() + Math.random(),
      type,
      title,
      time: "Just now",
      read: false,
    };
    
    // 1. Add to Topbar list
    setNotifications((prev) => [newNotif, ...prev]);
    
    // 2. Show visual popup (and auto-dismiss after 4 seconds)
    setActiveToasts((prev) => [...prev, newNotif]);
    setTimeout(() => {
      removeToast(newNotif.id);
    }, 4000);
  }, [removeToast]);

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
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        markAllRead,
        activeToasts,       // <-- Export for the UI
        removeToast         // <-- Export for manual closing
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}