import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchStyle.css'
import { API_ENDPOINT } from '../../../config/api-endpoint.config';
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
    const query = new URLSearchParams(location.search).get('messages');

    const fetchPost = async () => {
        try {
          const response = await axios.get(`${API_ENDPOINT.auth.base}/get_All`);
          setData(response.data.data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`${API_ENDPOINT.auth.base}/post_search?messages=${query}`);
                setResults(response.data.data);
            } catch (error) {
                console.error('Lỗi khi lấy kết quả tìm kiếm:', error);
            }
        };

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
          await axios.post(`${API_ENDPOINT.auth.base}/update_view/${postId}`);
        } catch (error) {
          console.error("Error updating view count:", error);
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
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
                                <div className="col-lg-3 col-md-4 col-6 product-item" key={post.id}>
                                    <div className="custom-block custom-block-full position-relative p-3">
                                        <div className="custom-block-image-wrap">
                                            <Link to={`/getId_post/${post.id}`}>
                                                <img
                                                    src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images}?alt=media`}
                                                    className="custom-block-image img-fluid"
                                                    alt={post.title}
                                                />
                                            </Link>
                                            <div className="play-button-container">
                                                <a href="#" className="play-button" onClick={() => handlePlayAudio(post.audio, post.title, post.artist, post.images, post.id)}>
                                                    <i className="bi bi-play-circle"></i>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="custom-block-info">
                                            <h5 className="product-title mb-2">
                                                <Link to={`/getId_post/${post.id}`}>
                                                    {post.title}
                                                </Link>
                                            </h5>

                                            <div className="profile-block d-flex align-items-center mb-2">
                                                <img
                                                    src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images_customers}?alt=media`}
                                                    style={{ height: '50px', width: '50px', borderRadius: '50%' }}
                                                    className="profile-block-image img-fluid"
                                                    alt={post.username}
                                                />
                                                <p className="ms-2 mb-0">
                                                    {post.username}
                                                    <br />
                                                    <small>Chuyên gia</small>
                                                </p>
                                            </div>

                                            <div className="custom-block-bottom d-flex justify-content-between mt-3">
                                                <a href="#" className="bi-headphones me-1">
                                                    <span>{post.view}</span>
                                                </a>
                                                <a href="#" className="bi-heart me-1">
                                                    <span>{post.likes}</span>
                                                </a>
                                                <a href="#" className="bi-chat me-1">
                                                    <span>{post.total_comments}</span>
                                                </a>
                                            </div>
                                        </div>

                                      
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