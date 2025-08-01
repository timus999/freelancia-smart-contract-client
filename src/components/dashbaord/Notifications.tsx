// components/NotificationCard.tsx
import { BellRing } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/utils/cn.ts";
import { Notification } from "@/hooks/useNotifications.tsx";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "@/utils/timeformatter.ts";

type Props = {
  notification: Notification;
  onMarkRead: (id: number) => void;
};

export const NotificationCard = ({ notification, onMarkRead }: Props) => {

    const navigate = useNavigate();

  return (
  <Card
  onClick={() => {
    onMarkRead(notification.id);
    if (notification.redirect_url) navigate(notification.redirect_url);
  }}
  className={cn(
    "mb-2 transition-all hover:shadow-md",
    !notification.read && "border-l-4 border-blue-400 bg-secondary"
  )}
>
  <CardContent className="flex justify-between items-center p-4 min-h-[120px]">
    <div className="flex items-start gap-3 w-full">
      <BellRing className="mt-1 text-gray-500 flex-shrink-0" />
      <div className="flex flex-col justify-between w-full">
        <p className="text-sm font-medium line-clamp-4 break-words mr-6">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Posted {timeAgo(notification.created_at)} ago
        </p>
      </div>
    </div>
  </CardContent>
</Card>

  );
};
