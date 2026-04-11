import { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";

const AppNotificationDropdown = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayedNotifications = [
    ...notifications.filter((n) => !n.read),
    ...notifications.filter((n) => n.read).slice(0, 6),
  ];

  return (

    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Overlay to close on click outside */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 border border-gray-100 transform origin-top-right transition-all">
            <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-gray-50/50">
              <span className="font-bold text-gray-800">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllAsRead();
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {displayedNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2 opacity-20">📭</div>
                  <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                </div>
              ) : (
                displayedNotifications.map((n) => (

                  <div
                    key={n.id}
                    className={`p-4 border-b border-gray-50 hover:bg-teal-50/30 cursor-pointer transition-colors ${
                      !n.read ? "bg-teal-50/50" : ""
                    }`}
                    onClick={() => !n.read && markAsRead(n.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!n.read ? "bg-teal-500" : "bg-transparent"}`} />
                      <div className="flex-1">
                        <p className={`text-sm leading-snug ${!n.read ? "font-bold text-gray-900" : "text-gray-600 font-medium"}`}>
                          {n.message}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-2 block font-semibold uppercase tracking-wider">
                          {new Date(n.timestamp).toLocaleString()}
                        </span>
                      </div>
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
};

export default AppNotificationDropdown;

