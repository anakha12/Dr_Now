
import { useNotifications } from "../../context/NotificationContext";

const NotificationList = () => {
  const { notifications, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-md mx-auto bg-white shadow p-4 rounded">
      <h2 className="text-lg font-semibold mb-3">Notifications</h2>
      <button onClick={markAllAsRead} className="mb-3 text-sm text-blue-500 underline">
        Mark all as read
      </button>
      <ul className="space-y-2">
        {notifications.map((n: any) => (
          <li
            key={n.id}
            className={`p-2 border rounded ${
              !n.read ? "bg-gray-100 font-medium" : "text-gray-500"
            }`}
          >
            <div>{n.message}</div>
            <div className="text-xs">{n.timestamp.toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
