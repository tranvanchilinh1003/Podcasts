import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Spinner from "../Spinner/Spinner";

const StarRating = ({ rating }) => {
  const percent = (rating / 5) * 100;
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "35px",
        height: "35px",
      }}
    >
      <svg width="35" height="35" fill="lightgray" viewBox="0 0 25 25">
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
      </svg>
      {percent > 0 && (
        <svg
          width="35"
          height="35"
          fill="gold"
          viewBox="0 0 25 25"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            clipPath: `inset(0 ${100 - percent}% 0 0)`,
          }}
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
        </svg>
      )}
    </div>
  );
};

function Post() {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
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
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const fetchPost = async () => {
    try {
      const customer = getUserFromLocalStorage();
      const userId = customer ? customer.id : null;
      const response = await axios.get(
        "http://localhost:5000/api/top_podcasts"
      );
      const data = response.data.data || [];

      if (userId) {
    
        const likeResponse = await axios.get(
          "http://localhost:8080/api/check-likes",
          {
            params: { userId },
          }
        );

        const likedPostIds = likeResponse.data.map((item) => item.post_id);

        const updatedData = data.map((post) => ({
          ...post,
          isLiked: likedPostIds.includes(post.data.id),
        }));

        setData(updatedData);
      } else {
        setData(data);
      }
    } catch (error) {
      console.error("Error fetching all posts:", error);
    } finally {
      setLoading(false);
    }
  };

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
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    const loadMoreProducts = async () => {
      setLoadingMore(true);
      const newVisibleCount = visibleCount + 6;
      setVisibleCount(newVisibleCount);
    if(newVisibleCount >= data.length){
      setLoadingMore(false);
      return;
    }
    };
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50; // Tải khi gần đến footer
      if (bottom) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll); // Dọn dẹp
    };
  }, [visibleCount, loadingMore]);

  const postsToDisplay = data.slice(0, visibleCount);


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

  const truncateTextWithHtml = (html, maxLength) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;

    const text = tempElement.innerText || tempElement.textContent;
    if (text.length <= maxLength) return html;

    let truncatedText = text.substr(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      truncatedText = truncatedText.substr(0, lastSpaceIndex);
    }
    const truncatedHtml = document.createElement("div");
    truncatedHtml.innerHTML = tempElement.innerHTML;
    const trimmedHtml = truncatedHtml.innerHTML.substr(0, truncatedText.length);

    return trimmedHtml + "...";
  };

  const handleShareClick = async (postId) => {
    try {
      const customer = getUserFromLocalStorage();
      if (!customer) {
        navigate("/login");
        return;
      }
      const response = await axios.post("http://localhost:8080/api/shares", {
        post_id: postId,
        customers_id: customer.id,
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

  const handleLikeClick = async (event, postId) => {
    event.preventDefault();

    const customer = getUserFromLocalStorage();
    if (!customer) {
        navigate("/login");
        return;
    }

    const post = data.find((post) => post.data.id === postId);
    const isLiked = post?.isLiked;

    const updatedData = data.map((p) => {
        if (p.data.id === postId) {
            return {
                ...p,
                isLiked: !isLiked,
                data: {
                    ...p.data,
                    total_likes: isLiked ? p.data.total_likes - 1 : p.data.total_likes + 1,
                },
            };
        }
        return p;
    });

    setData(updatedData);

    try {
        if (isLiked) {
            const notificationId = post.data.notificationId;
            if(notificationId){
              await axios.delete(`http://localhost:8080/api/notification/${notificationId}`);
            }
        
            await axios.delete("http://localhost:8080/api/like", {
              data: {
                  post_id: postId,
                  customers_id: customer.id,
              },
          });
            const updatedDataWithoutNotification = updatedData.map((p) => {
                if (p.data.id === postId) {
                    return {
                        ...p,
                        data: {
                            ...p.data,
                            notificationId: null,
                        },
                    };
                }
                return p;
            });
            setData(updatedDataWithoutNotification);
        } else {
            if (customer.id !== post.data.customers_id) {
                const response = await axios.post("http://localhost:8080/api/notification", {
                    user_id: post.data.customers_id,
                    sender_id: customer.id,
                    action: "like",
                    post_id: postId,
                });

                const notificationId = response.data.notification_id;
                const updatedDataWithNotification = updatedData.map((p) => {
                    if (p.data.id === postId) {
                        return {
                            ...p,
                            data: {
                                ...p.data,
                                notificationId: notificationId,
                            },
                        };
                    }
                    return p;
                });
                setData(updatedDataWithNotification);
            }
            await axios.post("http://localhost:8080/api/like", {
                post_id: postId,
                customers_id: customer.id,
            });
        }

        fetchPost();
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái thích:", error);
    }
};


const roundTo = (num, places) => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};



  const getUserFromLocalStorage = () => {
    const userArray = JSON.parse(localStorage.getItem("customer"));
    return userArray && userArray.length > 0 ? userArray[0] : null;
  };
  const profileLink = (id) => {
    return id == getUserFromLocalStorage()?.id
      ? `/account/${id}`
      : `/follow/${id}`;
  };

  // Usage

  if (loading) {
    return <Spinner />;
  }
  return (
    <section
      className="latest-podcast-section section-padding pb-0"
      id="section_2"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12 col-12">
            <div className="section-title-wrap mb-5">
              <h4 className="section-title">Bài viết</h4>
            </div>
          </div>

          <div className="row">
            {postsToDisplay.map((post) => (
              <div
                className="col-lg-12 col-12 col-md-12 mb-4"
                key={post.data.id}
              >
                <div
                  className="custom-block d-flex flex-column flex-md-row"
                  style={{ display: "flex", flexWrap: "wrap" }}
                >
                  <div className="col-lg-3 col-md-12 ">
                    <div className="custom-block-icon-wrap">
                      <div className="section-overlay"></div>
                      <a className="custom-block-image-wrap">
                        <img
                          src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.data.images}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
                          className="custom-block-image img-fluid"
                          alt=""
                        />
                        <span
                          className="custom-block-icon"
                          onClick={() =>
                            handlePlayAudio(
                              post.data.audio,
                              post.data.title,
                              post.data.username,
                              post.data.images,
                              post.data.id
                            )
                          }
                        >
                          <i className="bi-play-fill fs-2"></i>
                        </span>
                      </a>
                    </div>
                    <div className="custom-block-bottom justify-content-around d-flex mt-3 ">
                      <p className="bi-headphones me-1">
                        <span>{post.data.view}</span>
                      </p>

                      <a
                        href="#"
                        id="like-icon"
                        className={
                          post.isLiked
                            ? "bi-heart-fill fs-6"
                            : "bi-heart me-1 fs-6"
                        }
                        onClick={(e) => handleLikeClick(e, post.data.id)}
                      >
                        <span>{post.data.total_likes}</span>
                      </a>

                      <Link
                        to={`/getId_post/${post.data.id}`}
                        className="bi-chat me-1"
                      >
                        <span className="me-1">{post.data.total_comments}</span>
                      </Link>
                    </div>
                  </div>
                  <div className="custom-block-info col-lg-8 col-md-12">
                    <h4 className="mb-2">
                      <Link to={`/getId_post/${post.data.id}`}>
                        {post.data.title}
                      </Link>
                    </h4>
                    <div className="profile-block d-flex">
                      <Link to={profileLink(post.data.customers_id)}>
                        <img
                          src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.data.images_customers}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
                          className="profile-block-image"
                          style={{ borderRadius: "50%" }}
                          alt=""
                        />
                      </Link>
                      <p>
                        <Link to={profileLink(post.data.customers_id)}>
                          {post.data.username}
                        </Link>
                        {post.data.isticket === "active" && (
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
                      {expandedPostId === post.data.id ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: post.data.description,
                          }}
                        />
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: truncateTextWithHtml(
                              post.data.description,
                              100
                            ),
                          }}
                        />
                      )}{" "}
                      {post.data.description.length > 100 && (
                        <span
                          className="read-more-toggle"
                          onClick={() =>
                            setExpandedPostId(
                              expandedPostId === post.data.id
                                ? null
                                : post.data.id
                            )
                          }
                        >
                          {expandedPostId === post.data.id
                            ? "Ẩn bớt"
                            : "Xem thêm"}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="d-flex flex-column ms-auto">
                    <label href="#" className=" ms-auto">
                      {roundTo(post.data.average_comment_rating, 1)}/5{" "}
                      <StarRating rating={post.data.average_comment_rating} />
                    </label>
                    <a
                      href="#"
                      className="badge ms-auto"
                      onClick={(e) => {
                        e.preventDefault();
                        handleShareClick(post.data.id);
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
      {loadingMore && (
        <p>
           Đang tải thêm sản phẩm...
        </p>
      )}
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
