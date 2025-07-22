import client from "@/api/client.ts";
import { useState, useEffect, useCallback } from "react";

export type Notification = {
  id: number;
  user_id: number;
  message: string;
  read: boolean;
  created_at: string;
  job_id?: number,
  actor_id?: number,
  username?: string,
  redirect_url?: string,
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await client.get<Notification[]>("/api/notifications");
  return res.data;
};

export const markAsRead = async (notificationId: number): Promise<void> => {
  await client.post("/api/notifications/mark-read", { id: notificationId });
};

// Custom hook without react-query
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load notifications on mount
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Mark single notification as read and update local state
  const markNotificationAsRead = useCallback(async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  }, []);

   const hasUnread = notifications.some((n) => !n.read);


  return {
    notifications,
    isLoading,
    error,
    markNotificationAsRead,
    hasUnread

  };
};
