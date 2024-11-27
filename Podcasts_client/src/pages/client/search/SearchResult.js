import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchStyle.css'
import { API_ENDPOINT } from '../../../config/api-endpoint.config';
import CommentList from '../comments/CommentList';
import { addNotification, deleteNotification, findNotificationIdByPostId } from "../firebase/NotificationHandler";
import { database } from "../firebase/firebase";
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
function SearchResults() {
    const [results, setResults] = useState([]);
    const [isAudioVisible, setIsAudioVisible] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [viewUpdated, setViewUpdated] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [albumCover, setAlbumCover] = useState('');
    const [songTitle, setSongTitle] = useState('');
    const [artist, setArtist] = useState('');
    const audioRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [commentBoxVisibility, setCommentBoxVisibility] = useState({});
    const [expandedPostId, setExpandedPostId] = useState(null);
    const query = new URLSearchParams(location.search).get('messages');
    const fetchResults = async () => {
      try {
        const customer = getUserFromLocalStorage();
        const userId = customer ? customer.id : null;
        const response = await axios.get(`${API_ENDPOINT.auth.base}/post_search?messages=${query}`);
        if (userId) {
          const likeResponse = await axios.get(
            `${API_ENDPOINT.auth.base}/check-likes`,
            {
              params: { userId },
            }
          );
  
          const likedPostIds = likeResponse.data.map((item) => item.post_id);
  
          const updatedData = response.data.data.map((post) => ({
            ...post,
            isLiked: likedPostIds.includes(post.id),
          }));
  
          setResults(updatedData);
        } else {
          setResults(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    

      useEffect(() => {
        const customers = localStorage.getItem("customer");
        if (customers) {
          try {
            const parsedCustomer = JSON.parse(customers);
            setCustomer(parsedCustomer[0]);
          } catch (err) {
            console.error("Lỗi phân tích dữ liệu khách hàng:", err);
          }
        }
      }, []);
    useEffect(() => {
      

        if (query) {
            fetchResults();
        }
    }, [query]);

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
      const handleCommentClick = useCallback((postId) => {
        setCommentBoxVisibility((prevState) => {
          const newState = { ...prevState, [postId]: !prevState[postId] };
          return newState;
        });
      }, []);

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
    const updateTotalComments = useCallback((postId, newTotal) => {
      setResults((prevData) =>
        prevData.map((post) =>
          post.id === postId
            ? {
                ...post,
                data: {
                  ...post.data,
                  total_comments: newTotal,
                },
              }
            : post
        )
      );
    }, []);
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
          await axios.post(`${API_ENDPOINT.auth.base}/update_view/${postId}`);
        } catch (error) {
          console.error("Error updating view count:", error);
        }
      };
      useEffect(() => {
        fetchResults();
      }, []);

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

      const handleLikeClick = async (event, postId) => {
        event.preventDefault();
    
        const customer = getUserFromLocalStorage();
        if (!customer) {
          navigate("/login");
          return;
        }
    
        const post = results.find((post) => post.id === postId);
        const isLiked = post?.isLiked;
    
        const updatedData = results.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked: !isLiked,
              total_likes: isLiked ? p.total_likes - 1 : p.total_likes + 1,
            };
          }
          return p;
        });
    
        setResults(updatedData);
    
        try {
          if (isLiked) {
            console.log(`Checking notification ID for post ID: ${postId}`);
            const notificationId = await findNotificationIdByPostId(postId); // Tìm notificationId bằng postId
        
            if (notificationId) {
              console.log(`Found notification ID: ${notificationId}`); // Log notificationId nếu tìm thấy
              await deleteNotification(notificationId, database, null);
            } else {
              console.log(`Notification ID not found for post ID: ${postId}`); // Log nếu không tìm thấy
            }
        
            await axios.delete(`${API_ENDPOINT.auth.base}/like`, {
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
                  },
                };
              }
              return p;
            });
            setResults(updatedDataWithoutNotification);
          }
        
        else {
            // Nếu chưa thích, thêm thông báo vào Firebase và thêm lượt thích
            if (customer.id !== post.customers_id) {
              await addNotification(
                post.customers_id,
                customer.id,
                postId,
                "like",
                database
              );
    
              const updatedDataWithNotification = updatedData.map((p) => {
                if (p.id === postId) {
                  return {
                    ...p,
                    data: {
                      ...p.data,
                    },
                  };
                }
                return p;
              });
              setResults(updatedDataWithNotification);
            }
    
            await axios.post(`${API_ENDPOINT.auth.base}/like`, {
              post_id: postId,
              customers_id: customer.id,
            });
          }
    
      await    fetchResults(); // Làm mới bài viết sau khi cập nhật
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái thích:", error);
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
                    fetchResults();
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

    const roundTo = (num, places) => {
      const factor = Math.pow(10, places);
      return Math.round(num * factor) / factor;
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
    return (
        <>
            <section className="product-list-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-12 mt-5">
                            <div className="section-title-wrap mb-5 mt-5">
                                <h4 className="section-title">Tìm kiếm</h4>
                            </div>
                            {query && <p className="search-results-info mt-3">Kết quả tìm kiếm cho "{query}"</p>}
                        </div>
                        {results.length > 0 ? (
                          results.map((post) => (
                            <div
                              className="col-lg-12 col-12 col-md-12 mb-4"
                              key={post.id}
                            >
                              <div
                                className="custom-block"
                                style={{ display: "flex", flexWrap: "wrap" }}
                              >
                                <div className=" d-flex flex-column flex-md-row">
                                  <div className="col-lg-3 col-md-12 ">
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
                                        id="like-icon"
                                        className={
                                          post.isLiked
                                            ? "bi-heart-fill fs-6"
                                            : "bi-heart me-1 fs-6"
                                        }
                                        onClick={(e) => handleLikeClick(e, post.id)}
                                      >
                                        <span>{post.total_likes}</span>
                                      </a>
              
                                      <span
                                        className="bi-chat me-1"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleCommentClick(post.id)}
                                      >
                                        <span className="me-1 ms-1">
                                          {post.total_comments}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="custom-block-info col-lg-8 col-md-12">
                                    <h4 className="mb-2">
                                      <Link to={`/getId_post/${post.id}`}>
                                        {post.title}
                                      </Link>
                                    </h4>
                                    <div className="profile-block d-flex">
                                      <Link to={profileLink(post.customers_id)}>
                                        <img
                                          src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images_customers}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
                                          className="profile-block-image"
                                          style={{ borderRadius: "50%" }}
                                          alt=""
                                        />
                                      </Link>
                                      <p>
                                        <Link to={profileLink(post.customers_id)}>
                                          {post.username}
                                        </Link>
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
                                      {expandedPostId === post.id ? (
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: post.description,
                                          }}
                                        />
                                      ) : (
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: truncateTextWithHtml(
                                              post.description,
                                              100
                                            ),
                                          }}
                                        />
                                      )}{" "}
                                      {post.description.length > 100 && (
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
                                  </div>
                                  <div className="d-flex flex-column ms-auto">
                                    <label href="#" className=" ms-auto">
                                      {roundTo(post.average_comment_rating, 1)}/5{" "}
                                      <StarRating rating={post.average_comment_rating} />
                                    </label>
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
                                {commentBoxVisibility[post.id] && (
                                  <CommentList
                                    postId={post.id}
                                    customer={customer}
                                    onUpdateTotalComments={updateTotalComments}
                                    totalComments={post.total_comments}
                                  />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                            <p>Không tìm thấy kết quả</p>
                        )}
                    </div>
                </div>
            </section>

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
        </>
    );
}

export default SearchResults;