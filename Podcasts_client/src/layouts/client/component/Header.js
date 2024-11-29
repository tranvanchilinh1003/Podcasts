import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthClient } from "../../../pages/client/login/AuthContext";
import { DialogService } from "../../../services/common/DialogService";
import { gapi } from "gapi-script";
import Spinner from "../../../pages/client/Spinner/Spinner";
import "./header.css";
import { API_ENDPOINT } from "../../../config/api-endpoint.config";
import NotificationComponent from "./NotificationComponent";
import fetchNotification, {
  deleteNotification,
} from "../../../pages/client/firebase/NotificationHandler";
import { getDatabase, ref, update } from "firebase/database";

const CLIENT_ID =
  "973247984258-riadtumd7jcati9d9g9ip47tuqfqdkhc.apps.googleusercontent.com";
const API_KEY = "AIzaSyAp8wzduKw5P30-B0hUnGD1qiuuj73L8qs";


function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [username, setUsername] = useState("");
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
  const [isListening, setIsListening] = useState(false);
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

  const sortNotifications = (notifications) => {
    return notifications.sort((a, b) => {
      if (a.isread === "active" && b.isread !== "active") return -1;
      if (a.isread !== "active" && b.isread === "active") return 1;
  
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
  
      if (isNaN(dateA) || isNaN(dateB)) {
        console.error("Invalid date format for sorting:", a, b);
        return 0; 
      }
  
      return dateB - dateA;
    });
  };
  
    const fetNotification = async () => {
      setLoading(true);
      try {
        // Fetch dữ liệu từ Firebase
        await fetchNotification((notifications) => {
          console.log("Fetched notifications:", notifications);
    
          // Kiểm tra việc sắp xếp trước khi set lại state
          const sortedNotifications = sortNotifications(notifications);
          console.log("Sorted notifications:", sortedNotifications);
    
          // Set lại notifications sau khi sắp xếp
          setNotifications(sortedNotifications);
        }, setLoading);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
  
  const fetchUserInfo = async () => {
    try {
      
      const customer = getUserFromLocalStorage();
      const userId = customer ? customer.id : null;
      
      const response = await axios.get(
        `${API_ENDPOINT.auth.base}/customers/${userId}`
      );
      setUserInfo(response.data.data[0]);
      setOldImage(response.data.data[0].images);
      setUsername(response.data.data[0].username);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, [isLoggedIn]);
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

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const user = JSON.parse(localStorage.getItem("customer"));

    if (token && user) {
      fetchUserInfo();
    } else {
      logout();
    }

    const handleStorageChange = (event) => {
      if (event.key === "customer") {
        fetchUserInfo();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
        `${API_ENDPOINT.auth.base}/suggest_keywords?keyword=${value}`
      );
      setSuggestions(response.data.data);
      setShowAll(false);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  };

  const handleSearchSubmit = async (event) => {
  
    if (searchTerm.trim() !== "") {
      navigate(`/post_search?messages=${searchTerm}`);
      setSearchTerm("");
      setSuggestions("");
    }
  };
  const handleSearchIconClick = () => {
    handleSearchSubmit(new Event("submit"));
  };

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
  
    recognition.start();
  
    recognition.onstart = () => {
      setIsListening(true);
    };
  
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setSearchTerm(result);
      recognition.stop();  
    };
  
    recognition.onerror = (event) => {
      console.error("Lỗi nhận diện giọng nói: ", event.error);
      setIsListening(false);
    };
  
    recognition.onend = () => {
      setIsListening(false);
  
    };
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
      const database = getDatabase();

      console.log('database', database);
      

      const notificationRef = ref(database, `notifications/${id}`);
      // Cập nhật trường isread thành "active"
      await update(notificationRef, {
        isread: "inactive",
      });

      fetNotification(); // Gọi lại để cập nhật danh sách thông báo
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const database = getDatabase();
      const updates = {};

      notifications.forEach((notification) => {
        updates[`notifications/${notification.id}/isread`] = "inactive";
      });

      await update(ref(database), updates);
      // Cập nhật giao diện bằng cách gọi lại `fetchNotification` hoặc cập nhật state trực tiếp
      fetNotification(); // Gọi lại để cập nhật danh sách thông báo
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

 

  const handleDelete = async (notificationId) => {
    try {
      // Khởi tạo Firebase Database
      const database = getDatabase();
      // Gọi hàm deleteNotification
      await deleteNotification(notificationId, database, setNotifications);
    } catch (error) {
      console.error("Error deleting notification:", error.message);
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
              src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2FlogoCuisine-removebg-preview.png?alt=media&token=7e17d9ca-3639-4b8c-88d7-3ded37f039c5"
              className="logo-image img-fluid"
              alt="templatemo pod talk"
              style={{ width: "50px", height: "50px" }}
            />
          </Link>
          <label
            className="text-white fst-italic fw-bold ms-0"
            style={{ fontSize: "16px" }}
          >
            CUISINE PODCASTS
          </label>
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
          className="collapse navbar-collapse justify-content-end mr-4"
          id="navbarNav"
        >
          <div className="custom-search">
            <form
              onSubmit={handleSearchSubmit}
              method="get"
              className="custom-form search-form flex-fill"
              role="search"
              id='searchForm'
            >
              <div className="searchbar">
                <div className="searchbar-wrapper">
                  <div className="searchbar-left">
                    <div className="search-icon-wrapper">
                      <span
                        onClick={handleSearchIconClick}
                        className="search-icon searchbar-icon"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="searchbar-center">
                    <div className="searchbar-input-spacer"></div>

                    <input
                      type="text"
                      className="searchbar-input"
                      maxlength="2048"
                      name="q"
                      autocapitalize="off"
                      autocomplete="off"
                      title="Search"
                      role="combobox"
                      placeholder="Bạn muốn tìm gì?"
                      aria-label="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>

                  <div className="searchbar-right">
                    <svg
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      onClick={startVoiceSearch}
                      className={`voice-search ${
                        isListening ? "listening voice-listening" : ""
                      }`}
                    >
                      <path
                        fill="#4285f4"
                        d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"
                      ></path>
                      <path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path>
                      <path
                        fill="#fbbc05"
                        d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"
                      ></path>
                      <path
                        fill="#ea4335"
                        d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"
                      ></path>
                    </svg>
                  </div>
                </div>
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
                    className="notification-icon me-4"
                    onClick={toggleNotifications}
                  >
                    <i className="bi bi-bell text-white position-relative fs-5">
                      {notifications.length > 0 &&
                        notifications.filter(
                          (notification) => notification.isread === "active"
                        ).length > 0 && (
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
                                (notification) =>
                                  notification.isread === "active"
                              ).length
                            }
                          </span>
                        )}
                    </i>
                  </div>
                 
                  {showNotifications && (
                    <NotificationComponent
                      notifications={notifications}
                      notificationCount={notificationCount}
                      markAsRead={markAsRead}
                      handleDelete={handleDelete}
                      handleSeeMore={handleSeeMore}
                      markAllAsRead={markAllAsRead}
                    />
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
                    <label
                      className="text-white ms-1"
                      style={{ fontSize: "14px" }}
                    >
                      {username}
                    </label>
                    {showAccountMenu && (
                      <ul
                        className="dropdown-menu dropdown-menu-light mt-0"
                        style={{
                          transform: "translateX(-10px)",
                          pointerEvents: "auto",
                          zIndex: 1080,
                        }}
                      >
                        <li className="dropdown-item">
                          <strong>{username}</strong>
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
                className="btn btn-outline-light rounded-1 button-home text-white fw-bold"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="btn btn-danger ms-2 button-home text-white fw-bold"
              >
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
