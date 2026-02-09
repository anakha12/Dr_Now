
import { useNotifications } from "../../context/NotificationContext";

const NotificationBell = () => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <span className="text-xl">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
