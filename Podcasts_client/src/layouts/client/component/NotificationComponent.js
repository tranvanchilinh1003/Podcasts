import React, { useState } from "react";
import { Link } from "react-router-dom";

const NotificationComponent = ({
  notifications,
  notificationCount,
  markAsRead,
  handleDelete,
  handleSeeMore,
  markAllAsRead, // New prop to handle marking all notifications as read
}) => {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => {
      const newState = {};
      for (const key in prev) {
        newState[key] = key === id ? !prev[key] : false;
      }
      newState[id] = !prev[id];
      return newState;
    });
  };

  return (
    <ul className="dropdown-menu" style={{ flexDirection: "column" }}>
      {notifications.length > 0 ? (
        <>
          {/* Mark All as Read Button */}
          <li
            className="dropdown-item text-center"
            style={{
              cursor: "pointer",
              color: "black",
              backgroundColor: "#f1f3f5",
              fontWeight: "bold",
              fontSize: "14px",
            }}
            onClick={() => markAllAsRead(notifications)} // Trigger the markAllAsRead function
          >
            Đánh dấu tất cả đã đọc
          </li>

          {/* Notification List */}
          {notifications
            .slice(0, notificationCount)
            .map((notification, index) => (
              <li
                key={index}
                className={`dropdown-item d-flex align-items-center justify-content-between px-3 notification`}
              >
                <div
                  className={`d-flex align-items-center item ${
                    notification.isread === "inactive"
                      ? "notification-inactive"
                      : ""
                  }`}
                >
                  <Link
                    to={`/follow/${notification.sender_id}`}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                  >
                    <img
                      src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${notification.images}?alt=media`}
                      alt={notification.username}
                      className="img-thumbnail me-2"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                    />
                  </Link>
                  <div className="ms-2">
                    <div className="d-flex align-items-center">
                      <Link
                        className="fw-bold"
                        to={`/follow/${notification.sender_id}`}
                      >
                        {notification.username}
                      </Link>
                      <span style={{ fontSize: "7px", marginLeft: "5px" }}>
                        {new Date(notification.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", textTransform: "none" }}>
                      {notification.type === "like"
                        ? "Đã thích bài viết của bạn."
                        : notification.type === "follow"
                        ? "Đã theo dõi bạn."
                        : "Thông báo khác."}
                    </div>
                  </div>
                </div>
                <div className="dropdown">
                  <i
                    className="bi bi-three-dots"
                    onClick={() => toggleDropdown(notification.id)}
                    style={{
                      cursor: "pointer",
                      fontSize: "16px",
                      marginLeft: "0px",
                      color: "black",
                    }}
                  ></i>
                  {dropdownOpen[notification.id] && (
                    <ul
                      className="dropdown-menu text-center show p-2"
                      style={{ padding: "0", opacity: 1 }}
                    >
                      {notification.isread === "active" ? (
                        <li
                          className="button-read"
                          style={{
                            listStyle: "none",
                            marginBottom: "5px",
                            opacity: 1,
                          }}
                        >
                          <a
                            className="dropdown-item button-read"
                            style={{ cursor: "pointer" }}
                            onClick={() => markAsRead(notification.id)}
                          >
                            Đánh dấu đã đọc
                          </a>
                        </li>
                      ) : null}
                      <li
                        className="button-read"
                        style={{ listStyle: "none", opacity: 1 }}
                      >
                        <a
                          style={{ cursor: "pointer" }}
                          className="dropdown-item button-read"
                          onClick={() => handleDelete(notification.id)}
                        >
                          Gỡ thông báo này
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            ))}
        </>
      ) : (
        <li className="dropdown-item">Không có thông báo mới.</li>
      )}
      {notifications.length > notificationCount && (
        <li
          className="dropdown-item text-center btn"
          style={{
            cursor: "pointer",
            color: "black",
            backgroundColor: "#d1d4d7",
            fontSize: "12px",
          }}
          onClick={handleSeeMore}
        >
          Xem thông báo trước đó
        </li>
      )}
    </ul>
  );
};

export default NotificationComponent;
