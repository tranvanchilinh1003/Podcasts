import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthClient } from "../../../pages/client/login/AuthContext";
import { DialogService } from "../../../services/common/DialogService";
import { gapi } from "gapi-script";
import Spinner from "../../../pages/client/Spinner/Spinner";

const CLIENT_ID =
  "973247984258-riadtumd7jcati9d9g9ip47tuqfqdkhc.apps.googleusercontent.com";
const API_KEY = "AIzaSyAp8wzduKw5P30-B0hUnGD1qiuuj73L8qs";

function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { isLoggedIn, customer, logout, loginGoogle } = useAuthClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [notificationCount, setNotificationCount] = useState(5);
  const getUserFromLocalStorage = () => {
    const userArray = JSON.parse(localStorage.getItem("customer"));
    return userArray && userArray.length > 0 ? userArray[0] : null;
  };

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", options);
  }

  const fetNotification = async () => {
    try {
      const customer = getUserFromLocalStorage();
      const userId = customer ? customer.id : null;
      const response = await axios.get(
        `http://localhost:8080/api/notification_userId/${userId}`
      );

      const readNotifications =
        JSON.parse(localStorage.getItem("readNotifications")) || [];

      const notificationsWithReadStatus = response.data.data.map(
        (notification) => ({
          ...notification,
          read: readNotifications.includes(notification.id),
        })
      );
      setNotifications(notificationsWithReadStatus);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNotificationCount(5);
    fetNotification();
  }, [isLoggedIn]);

  useEffect(() => {
    const initializeGapi = () => {
      gapi.load("client:auth2", () => {
        gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: "email",
          })
          .then(() => {
            console.log("gapi initialized");
          })
          .catch((error) => {
            console.error("Error initializing gapi:", error);
          });
      });
    };

    initializeGapi();
  }, []);
const fetchUserInfo = async () => {
  try {
    const customer = getUserFromLocalStorage();
    const userId = customer ? customer.id : null;
    const response = await axios.get(
      `http://localhost:8080/api/customers/${userId}`
    );
    setUserInfo(response.data.data[0]);
    setOldImage(response.data.data[0].images);
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    setError(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const token = localStorage.getItem("userToken");
  const user = JSON.parse(localStorage.getItem("customer"));

  if (token && user) {
    fetchUserInfo();
  } else {
    logout();
  }

  const handleStorageChange = (event) => {
    if (event.key === 'customer') {
      fetchUserInfo();
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Cleanup event listener on unmount
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, [logout]);


  const handleLogout = async () => {
    try {
      if (typeof gapi !== "undefined" && gapi.auth2) {
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance) {
          await authInstance.signOut();
        }
      }

      DialogService.success("Đăng xuất thành công");
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error during sign-out", error);
    }
  };

  // Handle search term change
  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowAll(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/suggest_keywords?keyword=${value}`
      );
      setSuggestions(response.data.data);
      setShowAll(false);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/post_search?messages=${searchTerm}`);
      setSearchTerm("");
      setSuggestions("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowAccountMenu(false);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown")) {
      setShowNotifications(false);
      setDropdownOpen({});
    }
  };

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
    setShowNotifications(false);
  };

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

  const markAsRead = async (id) => {
    try {
      // Make the API call to update the notification
      const response = await axios.patch(
        `http://localhost:8080/api/notification/${id}`
      );
      fetNotification();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notification/${id}`);

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
      DialogService.error("Gỡ thông báo không thành công!");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSeeMore = (event) => {
    event.stopPropagation();
    setNotificationCount((prevCount) => prevCount + 5);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ position: "fixed", width: "100%" }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Link
            className="navbar-brand"
            to="/"
            onClick={scrollToTop}
            style={{ marginLeft: "0" }}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2Ficon.png?alt=media&token=a5846c3a-f685-4365-a3d7-9a1e8152f14e"
              className="logo-image img-fluid"
              alt="templatemo pod talk"
              style={{ width: "50px", height: "50px" }}
            />
          </Link>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <Link
            className="navbar-brand me-lg-3 me-0"
            to="/"
            onClick={scrollToTop}
          >
            <i className="bi bi-house-fill fs-2"></i>
          </Link>
          <div className="custom-search">
            <form
              onSubmit={handleSearchSubmit}
              method="get"
              className="custom-form search-form flex-fill"
              role="search"
            >
              <div
                className="input-group input-group-lg justify-content-center"
                style={{ width: "300px" }}
              >
                <input
                  name="search"
                  type="search"
                  className="border-0 p-2 rounded-start"
                  id="search"
                  placeholder="Bạn muốn tìm gì?"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button type="submit" className="form-control" id="submit">
                  <i className="bi-search"></i>
                </button>
              </div>
            </form>
            {suggestions.length > 0 && (
              <div
                className="dropdown list-inline bg-gradient rounded-3"
                id="searchSuggestions"
                style={{ marginTop: "0.5rem" }}
              >
                <ul
                  id="suggestionList"
                  className={`dropdown-menu-customers ${
                    showAll ? "expanded" : ""
                  }`}
                  aria-labelledby="dropdownMenuButton"
                >
                  {suggestions
                    .slice(0, showAll ? suggestions.length : 5)
                    .map((suggestion, index) => (
                      <li
                        key={index}
                        className="dropdown-item-customers d-flex align-items-center"
                      >
                        <img
                          src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${suggestion.images}?alt=media`}
                          alt={suggestion.title}
                        />
                        <Link
                          to={`/getId_post/${suggestion.id}`}
                          className="keywordds p-2"
                        >
                          {suggestion.title}
                        </Link>
                      </li>
                    ))}
                  {suggestions.length > 5 && (
                    <li>
                      <p
                        className="show-all-text text-center m-auto"
                        onClick={handleShowAll}
                        style={{ cursor: "pointer" }}
                      >
                        {showAll ? "Ẩn bớt" : "Xem tất cả"}
                      </p>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center ms-lg-auto">
          {isLoggedIn ? (
            <>
              {customer && customer.length > 0 && (
                <div className="nav-items dropdown dropend d-flex align-items-center">
                  <div
                    className="notification-icon me-5"
                    onClick={toggleNotifications}
                  >
                    <i className="bi bi-bell text-white position-relative fs-5">
                      {notifications.length > 0 && (
                        <span
                          className="position-absolute top-0 start-100 translate-middle badge bg-danger text-center"
                          style={{
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            fontSize: "10px",
                            textAlign: "center",
                            marginTop: "15px",
                          }}
                        >
                          {
                            notifications.filter(
                              (notification) => !notification.read
                            ).length
                          }
                        </span>
                      )}
                    </i>
                  </div>
                  {showNotifications && (
  <ul className="dropdown-menu" style={{ flexDirection: "column" }}>
    {notifications.length > 0 ? (
      notifications.slice(0, notificationCount).map((notification, index) => (
        <li
          key={index}
          className={`dropdown-item d-flex align-items-center justify-content-between px-3 notification `}
        >
          <div className={`d-flex align-items-center item ${
            notification.isread === "inactive" ? "notification-inactive" : ""
          }`}>
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
                <Link className="fw-bold" to={`/follow/${notification.sender_id}`}>
                  {notification.username}
                </Link>
                <span style={{ fontSize: "7px", marginLeft: "5px" }}>
                  {formatDate(notification.created_at)}
                </span>
              </div>
              <div style={{ fontSize: "12px", textTransform: "none" }}>
                {notification.type === "like"
                  ? "Đã thích bài viết của bạn."
                  : "Đã theo dõi bạn."}
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
                color: "black", // Always visible
              }}
            ></i>
            {dropdownOpen[notification.id] && (
              <ul className="dropdown-menu text-center show p-2" style={{ padding: "0", opacity: 1 }}>
                {notification.isread === "active" ? (
                  <li className="button-read" style={{ listStyle: "none", marginBottom: "5px", opacity: 1 }}>
                    <a
                      className="dropdown-item button-read"
                      style={{ cursor: "pointer" }}
                      onClick={() => markAsRead(notification.id)}
                    >
                      Đánh dấu đã đọc
                    </a>
                  </li>
                ) : null}
                <li className="button-read" style={{ listStyle: "none", opacity: 1 }}>
                  <a
                    style={{ cursor: "pointer" }}
                    className="dropdown-item button-read "
                    onClick={() => handleDelete(notification.id)}
                  >
                    Gỡ thông báo này
                  </a>
                </li>
              </ul>
            )}
          </div>
        </li>
      ))
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
)}


                  <div
                    onClick={toggleAccountMenu}
                    onMouseLeave={() => setShowAccountMenu(false)}
                  >
                    <img
                      className="img-profile rounded-circle"
                      src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`}
                      width={40}
                      height={40}
                      alt="Profile"
                    />
                    {showAccountMenu && (
                      <ul
                        className="dropdown-menu dropdown-menu-light"
                        style={{
                          transform: "translateX(-88px)",
                          pointerEvents: "auto",
                          zIndex: 1080,
                        }}
                      >
                        <li className="dropdown-item">
                          <strong>{userInfo.username}</strong>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/account/${userInfo.id}`}
                          >
                            Thông tin tài khoản
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleLogout}
                          >
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="btn btn-outline-light rounded-1 button-home"
              >
                Đăng ký
              </Link>
              <Link to="/login" className="btn btn-danger ms-2 button-home">
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
