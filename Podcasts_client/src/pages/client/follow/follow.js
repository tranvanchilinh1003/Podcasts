import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../firebase/axiosConfig";
import { DialogService } from "../../../services/common/DialogService";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function Follow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const [userInfo, setUserInfo] = useState(null);
  const [data, setData] = useState([]);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [artist, setArtist] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [albumCover, setAlbumCover] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);
  const [viewUpdated, setViewUpdated] = useState(false);
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [oldImage, setOldImage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const currentUserId = localStorage.getItem("userId");
  const [visibleCommentBox, setVisibleCommentBox] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleCommentClick = (postId) => {
    setVisibleCommentBox(visibleCommentBox === postId ? null : postId);
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

  function formatTimeDate(dateString) {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", options);
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    const truncated = text.substr(0, maxLength);
    return (
      truncated.substr(
        0,
        Math.min(truncated.length, truncated.lastIndexOf(" "))
      ) + "..."
    );
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/post-customer/${id}`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handlePlayAudio = (url, title, artist, coverImage, postId) => {
    setAudioUrl(url);
    setSongTitle(title);
    setArtist(artist);
    setAlbumCover(coverImage);
    setIsAudioVisible(true);
    setIsPlaying(true);
    setCurrentPostId(postId);
    setViewUpdated(false);
  };

  const handleCloseAudio = () => {
    setIsAudioVisible(false);
    setAudioUrl(null);
    setSongTitle("");
    setArtist("");
    setAlbumCover("");
    setIsPlaying(false);
  };

  const handlePlayPauseClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (event) => {
    const progressBar = event.currentTarget;
    const offsetX = event.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const newTime = (offsetX / progressBarWidth) * duration;
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (event) => {
    const volume = parseFloat(event.target.value);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const handleMuteClick = () => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 1 : 0;
      setIsMuted(!isMuted);
    }
  };

  const updateViewCount = async (postId) => {
    try {
      await axios.post(`http://localhost:8080/api/update_view/${postId}`);
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);

        if (!viewUpdated && audio.currentTime / audio.duration >= 0.8) {
          updateViewCount(currentPostId);
          setViewUpdated(true);
          fetchPost();
        }
      }
    };

    if (audio) {
      audio.addEventListener("timeupdate", updateProgress);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, [audioUrl, currentPostId, viewUpdated]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
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
      const response = await axios.post(
        `http://localhost:8080/api/follow/${userIdToFollow}`,
        {
          follower_id: user.id,
        }
      );
      console.log("Follow successful:", response.data);
      setIsFollowing(true);
      fetchUserInfo();
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
      const response = await axios.post(
        `http://localhost:8080/api/unfollow/${userIdToUnfollow}`,
        {
          follower_id: user.id,
        }
      );
      console.log("Unfollow successful:", response.data);
      setIsFollowing(false);
      fetchUserInfo();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/customers/${id}`
      );
      const user = response.data.data[0];
      setUserInfo(user);
      setOldImage(user.images);
      setOldPassword(user.password);
      setValue("username", user.username);
      setValue("full_name", user.full_name);
      setValue("email", user.email);

      const currentUser = getUserFromLocalStorage();
      if (currentUser) {
        const followResponse = await axios.get(
          `http://localhost:8080/api/check-follow/${currentUser.id}?followed_id=${id}`
        );
        setIsFollowing(followResponse.data.isFollowing);
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, [id, setValue]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section
      className="latest-podcast-section section-padding pb-0"
      id="section_2"
    >
      <div className="container">
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="content content-full-width">
              <div className="profile">
                <div className="profile-header">
                  <div className="profile-header-cover"></div>
                  <div className="profile-header-content">
                    <div className="profile-header-img rounded-circle">
                      <img
                        src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`}
                        alt="Profile"
                      />
                    </div>
                    <div className="profile-header-info d-flex justify-content-between align-items-center">
                      <h4 className="m-t-10 mt-2 m-b-5 fw-bold ">
                        {userInfo?.username}
                        {userInfo.isticket === "active" && (
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91"
                            className="verified-image img-fluid"
                            alt="Verified"
                          />
                        )}
                        <p className="m-b-10 mt-2 ">
                          Số người theo dõi:{" "}
                          <label className="text-white fw-bold">
                            {userInfo?.followersCount}
                          </label>
                        </p>
                      </h4>
                      <div>
                        {getUserFromLocalStorage()?.id != id && (
                          <Button
                            className="text-white fw-bold py-2 px-5"
                            variant={isFollowing ? "secondary" : "danger"}
                            onClick={() =>
                              isFollowing
                                ? handleUnfollow(id)
                                : handleFollow(id)
                            }
                          >
                            {isFollowing ? "Hủy theo dõi" : "+ Theo dõi"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <ul className="profile-header-tab nav nav-tabs mt-5">
                    <li className="nav-item">
                      <a
                        id="posts-tab"
                        data-bs-toggle="tab"
                        href="#posts"
                        role="tab"
                        aria-controls="posts"
                        aria-selected="true"
                        className="nav-link active"
                      >
                        Bài đăng
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        id="info-tab"
                        data-bs-toggle="tab"
                        href="#info"
                        role="tab"
                        aria-controls="info"
                        aria-selected="false"
                        className="nav-link"
                      >
                        Thông tin
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="profile-content">
                <div className="tab-content p-0">
                  <div
                    className="tab-pane fade show active"
                    id="posts"
                    role="tabpanel"
                    aria-labelledby="posts-tab"
                  >
                    <ul className="timeline">
                      {data.map((post) => (
                        <li key={post.id}>
                        
                          <div className="timeline-time">
                            <span className="time text-center">
                              {formatTimeDate(post.create_date)}
                            </span>
                            <span className="time">
                              {formatDate(post.create_date)}
                            </span>
                          </div>
                        
                          <div className="timeline-icon">
                            <a href="javascript:;">&nbsp;</a>
                          </div>
                        
                          <div className="timeline-body border">
                            <div className="timeline-header">
                              <span className="userimage">
                                <img
                                  src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`}
                                  alt="Hồ sơ"
                                />
                              </span>
                              <span className="username mx-1">
                                <a href="javascript:;">{userInfo?.username}</a>
                              </span>
                              <span className="pull-right text-muted">
                                {post.view} Lượt xem
                              </span>
                            </div>
                            <div className="timeline-content">
                              <h4>{post.title}</h4>
                              <p className="description-text">
                                {expandedPostId === post.id
                                  ? post.description
                                  : truncateText(post.description, 100)}{" "}
                                {/* Adjust the 100 to the desired max length */}
                                {post.description.length >
                                  100  && (
                                  <span
                                    className="read-more-toggle"
                                    onClick={() =>
                                      setExpandedPostId(
                                        expandedPostId === post.id
                                          ? null
                                          : post.id
                                      )
                                    }
                                  >
                                    {expandedPostId === post.id
                                      ? "Ẩn bớt"
                                      : "Xem thêm"}
                                  </span>
                                )}
                              </p>
                              <div className="image-container">
                                <img
                                  src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
                                  alt="Your image description"
                                  className="border rounded"
                                />
                                <span
                                  className="custom-block-icon"
                                  onClick={() =>
                                    handlePlayAudio(
                                      post.audio,
                                      post.title,
                                      post.username,
                                      post.images,
                                      post.id
                                    )
                                  }
                                >
                                  <i className="bi-play-fill fs-2"></i>
                                </span>
                              </div>
                            </div>
                            <div className="timeline-likes">
                              <div className="stats-right">
                                <span className="stats-text mx-1">
                                  259 Chia sẻ
                                </span>
                                <a href="#">
                                  <span className="stats-text">
                                    {post.total_comments} Bình luận
                                  </span>
                                </a>
                              </div>
                              <div className="stats">
                                <span className="fa-stack fa-fw stats-icon">
                                  <i className="fa fa-circle fa-stack-2x text-danger"></i>
                                  <i className="fa fa-heart fa-stack-1x fa-inverse t-plus-1"></i>
                                </span>
                                <span className="fa-stack fa-fw stats-icon">
                                  <i className="fa fa-circle fa-stack-2x text-primary"></i>
                                  <i className="fa fa-thumbs-up fa-stack-1x fa-inverse"></i>
                                </span>
                                <span className="stats-total">
                                  {post.total_favorites}
                                </span>
                              </div>
                            </div>
                            <div className="timeline-footer">
                              <a
                                href="javascript:;"
                                className="m-r-15 text-inverse-lighter mx-1"
                              >
                                <i className="bi bi-hand-thumbs-up"></i> Thích
                              </a>
                              <a
                                href="javascript:;"
                                className="m-r-15 text-inverse-lighter mx-1"
                                onClick={() => handleCommentClick(post.id)}
                              >
                                <i className="bi bi-chat"></i> Bình luận
                              </a>
                              <a
                                href="javascript:;"
                                className="m-r-15 text-inverse-lighter mx-1"
                              >
                                <i className="bi bi-share"></i> Chia sẻ
                              </a>
                            </div>
                            {/* Khu vực nhập bình luận */}
                            {visibleCommentBox === post.id && (
                              <div className="timeline-comment-box">
                                <div className="user">
                                  <img
                                    src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`}
                                    alt="Hồ sơ"
                                  />
                                </div>
                                <div className="input">
                                  <form action="">
                                    <div className="input-group">
                                      <input
                                        type="text"
                                        className="form-control rounded-corner"
                                        placeholder="Viết một bình luận..."
                                      />
                                      <span className="input-group-btn p-l-10">
                                        <button
                                          className="btn btn-primary f-s-12 rounded-corner"
                                          type="button"
                                        >
                                          Bình luận
                                        </button>
                                      </span>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="info"
                    role="tabpanel"
                    aria-labelledby="info-tab"
                  >
                    <table className="table table-striped">
                      <tbody>
                        <tr>
                          <td>Họ Và Tên:</td>
                          <td>{userInfo?.full_name}</td>
                        </tr>
                        <tr>
                          <td>Email:</td>
                          <td>{userInfo?.email}</td>
                        </tr>
                        <tr>
                          <td>Số lượng người theo dõi:</td>
                          <td>{userInfo?.followersCount}</td>
                        </tr>
                        <tr>
                          <td>Tham gia:</td>
                          <td>{formatDate(userInfo?.create_date)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAudioVisible && (
        <div
          className="audio-player"
          style={{ position: "fixed", bottom: 0, zIndex: 1000 }}
        >
          <span className="text-white close-audio" onClick={handleCloseAudio}>
            <i className="bi bi-x"></i>
          </span>
          <div className="album-cover">
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${albumCover}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
              alt="Album Cover"
            />
            <span className="icon-audio" onClick={handlePlayPauseClick}>
              {isPlaying ? (
                <i className="bi bi-stop-fill fs-2"></i>
              ) : (
                <i className="bi bi-play fs-1"></i>
              )}
            </span>
          </div>
          <div className="player-controls d-flex">
            <div className="song-info">
              <div className="song-title">{songTitle}</div>
              <p className="artist">{artist}</p>
            </div>
            <div className="d-flex">
              <div
                className="m-auto progress-bar-audio"
                onClick={handleProgressClick}
              >
                <div
                  className="progress"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <div className="volume-controls">
                <i
                  className={`bi ${
                    isMuted ? "bi-volume-mute volume" : "bi-volume-up volume"
                  }`}
                  onClick={handleMuteClick}
                ></i>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioRef.current ? audioRef.current.volume : 1}
                  onChange={handleVolumeChange}
                  className="volume-slider w-50"
                />
              </div>
            </div>

            <div className="time-info">
              <span className="current-time">{formatTime(currentTime)}</span> /
              <span className="total-time">{formatTime(duration)}</span>
            </div>

            <div className="buttons">
              <button className="play-btn" onClick={handlePlayPauseClick}>
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/audio%2F${audioUrl}?alt=media&token=4acc2496-8718-4a17-b827-d4ff81986c25`}
            autoPlay
          ></audio>
        </div>
      )}
    </section>
  );
}

export default Follow;
