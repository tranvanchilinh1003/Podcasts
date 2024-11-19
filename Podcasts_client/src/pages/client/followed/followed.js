import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import './followed.css';
import { database } from "../firebase/firebase";
import {
  addNotification,
  deleteNotification,
  findNotificationIdByType
} from "../firebase/NotificationHandler";

function UserFollowList({ type }) {
  const { id } = useParams();
  const [notificationId, setNotificationId] = useState('');
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setFollowing([]);
    setVisibleCount(10);
    fetchFollowing();
  }, [id, type]); 

  const fetchFollowing = async () => {
    try {
      const endpoint = type === "follower" ? `list_follower/${id}` : `list_followed/${id}`;
      const response = await axios.get(`${API_ENDPOINT.auth.base}/${endpoint}`);
      const fetchedFollowing = response.data.data;

      const currentUser = getUserFromLocalStorage();
      if (currentUser) {
        const followResponse = await Promise.all(
          fetchedFollowing.map(async (user) => {
            const checkFollowResponse = await axios.get(
              `${API_ENDPOINT.auth.base}/check-follow/${currentUser.id}?followed_id=${user.id}`
            );
            return {
              ...user,
              isFollowing: checkFollowResponse.data.isFollowing,
            };
          })
        );
        setFollowing(followResponse);
      } else {
        setFollowing(fetchedFollowing.map((user) => ({ ...user, isFollowing: false })));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserFromLocalStorage = () => {
    const userArray = JSON.parse(localStorage.getItem("customer"));
    return userArray && userArray.length > 0 ? userArray[0] : null;
  };

  const handleFollow = async (userIdToFollow) => {
    const user = getUserFromLocalStorage();
    if (!user) {
      navigate("/login");
      return;
    }
  
    try {
      // Gửi yêu cầu theo dõi
      await axios.post(`http://localhost:8080/api/follow/${userIdToFollow}`, {
        follower_id: user.id,
      });
  
      await addNotification(
        parseInt(userIdToFollow), 
        user.id,
        null, 
        "follow",
        database 
      );
  
      // Cập nhật trạng thái theo dõi trong UI
      setFollowing((prevFollowing) =>
        prevFollowing.map((follower) =>
          follower.id === userIdToFollow
            ? { ...follower, isFollowing: true }
            : follower
        )
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  
  const handleUnfollow = async (userIdToUnfollow) => {
    const user = getUserFromLocalStorage();
    if (!user) {
      console.error("No user information found in localStorage.");
      return;
    }
  
    try {
      // Gửi yêu cầu bỏ theo dõi
      await axios.post(`http://localhost:8080/api/unfollow/${userIdToUnfollow}`, {
        follower_id: user.id,
      });
  
      const notificationId = await findNotificationIdByType(
        "follow", 
        userIdToUnfollow,
        user.id 
      );
  
      if (notificationId) {
        await deleteNotification(notificationId, database, null);
      } else {
        console.error("Notification ID not found for unfollow action.");
      }
  
      // Cập nhật trạng thái UI
      setFollowing((prevFollowing) =>
        prevFollowing.map((follower) =>
          follower.id === userIdToUnfollow
            ? { ...follower, isFollowing: false }
            : follower
        )
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };
  

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const profileLink = (id) => {
    return id === getUserFromLocalStorage()?.id ? `/account/${id}` : `/follow/${id}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card-follow w-100 mb-5">
      <p className="title-follow">{type === "follower" ? "Người theo dõi" : "Đang theo dõi"}</p>
      <div className="user__container">
        {following.slice(0, visibleCount).length > 0 ? (
          following.slice(0, visibleCount).map((user) => (
            <div key={user.id} className="user-follow">
              <Link className="image" to={profileLink(user.id)}>
                <img
                  className="image"
                  src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${user.images}?alt=media`}
                  alt="Hồ sơ"
                />
              </Link>
              <div className="user__content">
                <div className="text">
                  <Link to={profileLink(user.id)} className="text-dark">
                    <span className="name">{user.username}</span>
                  </Link>
                  <p className="username">{user.email}</p>
                </div>
                {user.id !== getUserFromLocalStorage()?.id && (
                  <button
                    className={user.isFollowing ? "btn btn-secondary" : "follow"}
                    onClick={() =>
                      user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)
                    }
                  >
                    {user.isFollowing ? "Hủy theo dõi" : "Theo dõi"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-1 p-lg-5">
            Không có người nào đang theo dõi!
          </p>
        )}
      </div>
      {following.length > visibleCount && (
        <div className="d-flex justify-content-center">
          <button className="more" onClick={loadMore}>
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}

export default UserFollowList;
