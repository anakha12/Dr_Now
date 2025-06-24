import NotificationList from "../notifications/NotificationList"; 

const UserNotifications = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-teal-700 mb-4">Your Notifications</h1>
      <NotificationList />
    </div>
  );
};

export default UserNotifications;
