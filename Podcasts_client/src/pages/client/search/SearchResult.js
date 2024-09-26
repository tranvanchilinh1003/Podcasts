import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchStyle.css'
function SearchResults() {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('messages');
    const [isAudioVisible, setIsAudioVisible] = useState(false);
  
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/post_search?messages=${query}`);
                setResults(response.data.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    return (
      <>
          <section className="product-list-section">
              <div className="container">
                  <div className="row">
                      <div className="col-lg-12 col-12">
                          <div className="section-title-wrap mb-5 mt-5">
                              <h4 className="section-title">Chủ đề thịnh hành</h4>
                          </div>
                      </div>
                      {results.length > 0 ? (
                          results.map((post) => (
                              <div className="col-lg-3 col-md-4 col-6 product-item" key={post.id}>
                                  <div className="custom-block custom-block-full position-relative">
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

                                      <div className="social-share d-flex flex-column ms-auto">
                                          <a href="#" className="badge ms-auto">
                                              <i className="bi-heart"></i>
                                          </a>
                                          <a href="#" className="badge ms-auto">
                                              <i className="bi bi-share-fill"></i>
                                          </a>
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