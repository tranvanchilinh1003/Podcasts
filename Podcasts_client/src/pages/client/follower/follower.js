import React, { useState, useEffect } from 'react';
import axios from "axios";
import './follower.css';
import { Link, useNavigate } from "react-router-dom";
function InfoUser({ id }) {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    fetchFollowing();
  }, [id]);

  const fetchFollowing = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/list_follow/${id}`);
      const fetchedFollowing = response.data.data;

      // Lấy thông tin người dùng hiện tại để kiểm tra trạng thái theo dõi
      const currentUser = getUserFromLocalStorage();
      if (currentUser) {
        const followResponse = await Promise.all(
          fetchedFollowing.map(async (user) => {
            const checkFollowResponse = await axios.get(
              `http://localhost:8080/api/check-follow/${currentUser.id}?followed_id=${user.id}`
            );
            return { ...user, isFollowing: checkFollowResponse.data.isFollowing };
          })
        );
        setFollowing(followResponse);
      } else {
        // Nếu không có người dùng hiện tại, chỉ cần hiển thị danh sách mà không có trạng thái theo dõi
        setFollowing(fetchedFollowing.map(user => ({ ...user, isFollowing: false })));
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
      console.error("No user information found in localStorage.");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/follow/${userIdToFollow}`, {
        follower_id: user.id,
      });
      setFollowing(prevFollowing => 
        prevFollowing.map(follower => 
          follower.id === userIdToFollow ? { ...follower, isFollowing: true } : follower
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
      await axios.post(`http://localhost:8080/api/unfollow/${userIdToUnfollow}`, {
        follower_id: user.id,
      });
      setFollowing(prevFollowing => 
        prevFollowing.map(follower => 
          follower.id === userIdToUnfollow ? { ...follower, isFollowing: false } : follower
        )
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 10); 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card-follow w-100 mb-5">
      <p className="title-follow">Người theo dõi</p>
      <div className="user__container">
        {following.slice(0, visibleCount).length > 0 ? (
          following.slice(0, visibleCount).map((user) => (
            <div key={user.id} className="user-follow">
              <Link className="image" to={`/follow/${user.id}`}>
                <img className='image' src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${user.images}?alt=media`} alt="Hồ sơ" />
              </Link>
              <div className="user__content">
                <div className="text">
                  <Link to={`/follow/${user.id}`} className='text-dark'><span className="name">{user.username}</span></Link>
                  <p className="username">{user.email}</p>
                </div>
                <button 
                  className= {user.isFollowing? 'btn btn-secondary' : 'follow'} 
                  onClick={() => user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                >
                  {user.isFollowing ? "Hủy theo dõi" : "Theo dõi"}
                </button>
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
          <button className="more" onClick={loadMore}>Xem thêm</button>
        </div>
      )}
    </div>
  );
}

export default InfoUser;
