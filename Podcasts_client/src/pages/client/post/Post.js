import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 

function Post() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [albumCover, setAlbumCover] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [viewUpdated, setViewUpdated] = useState(false);
  const [sharesToday, setSharesToday] = useState([]);
  const [customer_id, setCustomer] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null); // New state for expanded post ID

  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/get_All");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/shares/today");
        setSharesToday(response.data.data);
      } catch (error) {
        console.error("Error fetching shares today:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchPost();
  }, []);

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
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/get_All");
      setAllData(response.data.data);
    } catch (error) {
      console.error("Error fetching all posts:", error);
    }
  };

  const handleLikeClick = (event, postId) => {
    event.preventDefault();
  };

  const handleLoadMoreToggle = () => {
    if (!isExpanded) {
      fetchAllPosts();
    }
    setVisibleCount(isExpanded ? 6 : data.length);
    setIsExpanded(!isExpanded);
  };

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
      if (isMuted) {
        audioRef.current.volume = 1;
      } else {
        audioRef.current.volume = 0;
      }
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

  const postsToDisplay = data.slice(0, visibleCount);

  const handleShareClick = async (postId) => {
    try {
      const customer = localStorage.getItem('customer');
      setCustomer(JSON.parse(customer));
      const response = await axios.post('http://localhost:8080/api/shares', {
        post_id: postId,
        customers_id: customer_id[0].id
      });
      console.log("Share count updated:", response.data);

      Toastify({
        text: "Chia sẻ thành công!",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#4caf50",
        stopOnFocus: true,
      }).showToast();
    } catch (error) {
      console.error("Error updating share count:", error);

      Toastify({
        text: "Vui lòng đăng nhập để chia sẻ",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#f44336",
        stopOnFocus: true,
      }).showToast();
    }
  };

  const handleFavouriteClick = async (postId) => {
    const customer = localStorage.getItem('customer');
    setCustomer(JSON.parse(customer));

    try {
      const response = await axios.post('http://localhost:8080/api/favourite', {
        post_id: postId,
        customers_id: customer_id[0].id
      });
      console.log("Favourite count updated:", response.data);

      Toastify({
        text: "Lưu thành công!",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#4caf50",
        stopOnFocus: true,
      }).showToast();
    } catch (error) {
      console.error("Error updating favourite count:", error);

      Toastify({
        text: "Đăng nhập để lưu",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#f44336",
        stopOnFocus: true,
      }).showToast();
    }
  };

  return (
    <section className="latest-podcast-section section-padding pb-0" id="section_2">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12 col-12">
            <div className="section-title-wrap mb-5">
              <h4 className="section-title">Bài viết</h4>
            </div>
          </div>

          <div className="row">
            {postsToDisplay.map((post) => (
              <div className="col-lg-12 col-12 mb-4" key={post.id}>
                <div className="custom-block d-flex flex-column flex-md-row">
                  <div className="col-lg-3 col-12">
                    <div className="custom-block-icon-wrap">
                      <div className="section-overlay"></div>
                      <a className="custom-block-image-wrap">
                        <img
                          src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
                          className="custom-block-image img-fluid"
                          alt=""
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
                      </a>
                    </div>
                    <div className="custom-block-bottom justify-content-around d-flex mt-3 ">
                      <p className="bi-headphones me-1">
                        <span>{post.view}</span>
                      </p>
                      <a
                        href="#"
                        className="bi-heart me-1"
                        onClick={(e) => handleLikeClick(e, post.id)}
                      >
                        <span>{post.total_favorites}</span>
                      </a>
                      <Link
                        to={`/getId_post/${post.id}`}
                        className="bi-chat me-1"
                      >
                        <span>{post.total_comments}</span>
                      </Link>
                    </div>
                  </div>
                  <div className="custom-block-info col-lg-8 col-12">
                    <h4 className="mb-2">
                      <Link to={`/getId_post/${post.id}`}>{post.title}</Link>
                    </h4>
                    <div className="profile-block d-flex">
                      <img
                        src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images_customers}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
                        className="profile-block-image"
                        style={{ borderRadius: "50%" }}
                        alt=""
                      />
                      <p>
                        {post.username}
                        {post.isticket === "active" && (
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91"
                            className="verified-image img-fluid"
                            alt="Verified"
                          />
                        )}
                        <strong>Người đăng</strong>
                      </p>
                    </div>
                    <p className="description-text">
                      {expandedPostId === post.id 
                        ? post.description 
                        : truncateText(post.description, 100)} {/* Adjust the 100 to the desired max length */}
                      {post.description.length > 100 && (  /* Show 'Read More' only if text is longer than 100 characters */
                        <span 
                          className="read-more-toggle" 
                          onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                        >
                          {expandedPostId === post.id ? "Ẩn bớt" : "Xem thêm"}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="d-flex flex-column ms-auto">
                    <a
                      href="#"
                      className="badge ms-auto"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFavouriteClick(post.id);
                      }}
                    >
                      <i className="bi bi-bookmark"></i>
                    </a>
                    <a
                      href="#"
                      className="badge ms-auto"
                      onClick={(e) => {
                        e.preventDefault();
                        handleShareClick(post.id);
                      }}
                    >
                      <i className="bi bi-share-fill"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <button className="shadow" onClick={handleLoadMoreToggle}>
          <span className="text-center">
            {isExpanded ? "Ẩn bớt" : "Xem thêm"}
          </span>
        </button>
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

export default Post;
