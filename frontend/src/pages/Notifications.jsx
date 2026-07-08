import { useEffect, useState } from "react";
import { Bell, CheckCheck, Circle } from "lucide-react";
import api from "../services/api.js";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setUnreadCount((previousCount) => Math.max(0, previousCount - 1));
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not mark notification as read."
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) => ({
          ...notification,
          isRead: true
        }))
      );

      setUnreadCount(0);
      setMessage("All notifications marked as read.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update notifications."
      );
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <p className="loading-text">Loading notifications...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="notifications-heading">
        <div>
          <p className="eyebrow">Notifications</p>
          <h1>Stay updated on your skill requests.</h1>
          <p>
            You have {unreadCount} unread notification
            {unreadCount === 1 ? "" : "s"}.
          </p>
        </div>

        {notifications.length > 0 && unreadCount > 0 && (
          <button
            type="button"
            className="mark-all-button"
            onClick={markAllAsRead}
          >
            <CheckCheck size={18} />
            Mark all as read
          </button>
        )}
      </section>

      {error && <p className="form-error page-message">{error}</p>}
      {message && <p className="form-success page-message">{message}</p>}

      {notifications.length === 0 ? (
        <section className="empty-state">
          <Bell size={42} />
          <h2>No notifications yet</h2>
          <p>
            When another student sends or updates a skill request, it will
            appear here.
          </p>
        </section>
      ) : (
        <section className="notification-list">
          {notifications.map((notification) => (
            <button
              type="button"
              className={`notification-card ${
                notification.isRead ? "is-read" : "is-unread"
              }`}
              key={notification._id}
              onClick={() => {
                if (!notification.isRead) {
                  markAsRead(notification._id);
                }
              }}
            >
              <div className="notification-icon">
                <Bell size={20} />
              </div>

              <div className="notification-content">
                <p>{notification.message}</p>
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>

              {!notification.isRead && (
                <Circle size={11} className="unread-dot" fill="currentColor" />
              )}
            </button>
          ))}
        </section>
      )}
    </main>
  );
}

export default Notifications;