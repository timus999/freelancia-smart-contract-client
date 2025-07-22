// pages/NotificationsPage.tsx
import { useNotifications } from "@/hooks/useNotifications.ts";
import { NotificationCard } from "@/components/dashbaord/Notifications.tsx";
import { Loader2, Inbox } from "lucide-react";
import { motion } from "framer-motion";

const NotificationsPage = () => {
  const { notifications, isLoading, error, markNotificationAsRead } = useNotifications();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error loading notifications.</div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
        <Inbox className="w-12 h-12 mb-2" />
        <p>No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-6 px-4">
      <h1 className="text-xl font-semibold mb-4">Notifications</h1>
      {notifications.map((notification) => (
             <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
        <NotificationCard
          notification={notification}
          onMarkRead={markNotificationAsRead}
        />
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationsPage;
