import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { DialogService } from "../../../services/common/DialogService";
import { storage } from '../firebase/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { useForm } from 'react-hook-form';

function Shares() {
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
    const [userId, setUserId] = useState(null);
    const [fileImg, setFileImg] = useState(null);
    const [fileAudio, setFileAudio] = useState(null);
    const [songTitle, setSongTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [albumCover, setAlbumCover] = useState("");
    const [isAudioVisible, setIsAudioVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [viewUpdated, setViewUpdated] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);
    const [userInfo, setUserInfo] = useState(null);
    const [oldImage, setOldImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [visibleCommentBox, setVisibleCommentBox] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const [Delete, onDelete] = useState(null);
    // Hàm để toggle mở/đóng dropdown
    const toggleDropdown = (sharesId) => {
        setIsDropdownOpen(isDropdownOpen === sharesId ? null : sharesId);
    };
    // Hàm xử lý khi click "Xóa"
    const handleDelete = async (sharesId) => {
        const confirmed = await DialogService.showConfirmationDialog('shares', sharesId);
        if (confirmed) {
            await onDelete(sharesId);
        }
        fetchShare();
    };
    function formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', options);
    }
    function formatTimeDate(dateString) {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', options);
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
    const handleCloseAudio = () => {
        setIsAudioVisible(false);
        setAudioUrl(null);
        setSongTitle("");
        setArtist("");
        setAlbumCover("");
        setIsPlaying(false);
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
    const handleVolumeChange = (event) => {
        const volume = parseFloat(event.target.value);
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    };
    const updateViewCount = async (postId) => {
        try {
            await axios.post(`http://localhost:8080/api/update_view/${postId}`);
        } catch (error) {
            console.error("Error updating view count:", error);
        }
    };

    const fetchShare = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/shares/${id}`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchShare();
    }, [id]);
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
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/customers/${id}`);
                const user = response.data.data[0];
                setUserInfo(user);
                setOldImage(user.images);
                setValue('username', user.username);
                setValue('full_name', user.full_name);
                setValue('email', user.email);
            } catch (err) {
                console.error('Failed to fetch user info:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [id, setValue]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const onFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            if (name === 'images') {
                setFileImg(files[0]);
            } else if (name === 'audio') {
                setFileAudio(files[0]);
            }
        }
    };
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };
    const onSubmit = async (formData) => {
        try {
            if (fileImg) {
                const imgExtension = fileImg.name.split('.').pop();
                const currentDate = new Date();
                const imgFileName = `${currentDate.toISOString().trim()}.${imgExtension}`;
                const imgPath = `upload/${imgFileName}`;
                const imgRef = ref(storage, imgPath);
                await uploadBytes(imgRef, fileImg);
                const imgFileNameFromUrl = imgPath.split('/').pop();
                formData.images = imgFileNameFromUrl;
            }

            if (fileAudio) {
                const audioExtension = fileAudio.name.split('.').pop();
                const currentDate = new Date();
                const audioFileName = `${currentDate.toISOString().trim()}.${audioExtension}`;
                const audioPath = `audio/${audioFileName}`;
                const audioRef = ref(storage, audioPath);
                await uploadBytes(audioRef, fileAudio);
                const audioFileNameFromUrl = audioPath.split('/').pop();
                formData.audio = audioFileNameFromUrl;
            }

            formData.customers_id = userId; // Use userId from localStorage
            delete formData.confirm_password;

            await axios.post('/api/post', formData);
            DialogService.success('Thêm thành công');
            fetchShare(); // Fetch updated data
            reset(); // Reset the form
        } catch (error) {
            console.error('Upload failed:', error);
            DialogService.error('Thêm thất bại');
        }
    };

    const handleCommentClick = (postId) => {
        setVisibleCommentBox(visibleCommentBox === postId ? null : postId);
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div id="content" className="content content-full-width">
                            <div className="profile-content">
                                <div className="tab-content p-0">
                                    <div className="tab-pane fade active show" id="profile-post">
                                        <ul className="timeline">
                                            {data.length > 0 ? (
                                                data.map(shares => (
                                                    <li key={shares.id}>
                                                        <div className="timeline-time">
                                                            <span className="time text-center">{formatTimeDate(shares.create_date)}</span>
                                                            <span className="time">{formatDate(shares.create_date)}</span>
                                                        </div>
                                                        <div className="timeline-icon">
                                                            <a href="javascript:;">&nbsp;</a>
                                                        </div>
                                                        <div className="timeline-body border">
                                                            <div className="timeline-header">
                                                                <div className="col-md-12 d-flex justify-content-between align-items-center">
                                                                    <div className="d-flex align-items-center">
                                                                        <span className="userimage">
                                                                            <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`} alt="Hồ sơ" />
                                                                        </span>
                                                                        <span className="username mx-1">
                                                                            <a href="javascript:;" className='d-flex'>{userInfo?.username}{userInfo.isticket === "active" && (
                                                                                <img
                                                                                    src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91"
                                                                                    className="verified-image img-fluid mx-1 h-75 mt-1"
                                                                                    alt="Verified"
                                                                                />
                                                                            )}</a>
                                                                        </span>
                                                                        {/* <span className="text-muted">{shares.so_luong} Lượt xem</span> */}
                                                                        <span className="time mx-2">{formatDate(shares.create_date)}</span>
                                                                    </div>

                                                                    <div style={{ position: 'relative', display: 'inline-block' }} className='mx-2'>
                                                                        {/* Dropdown Button */}
                                                                        <button
                                                                            onClick={() => toggleDropdown(shares.id)}
                                                                            style={{
                                                                                background: 'none',
                                                                                border: 'none',
                                                                                fontSize: '25px',
                                                                                cursor: 'pointer',
                                                                                padding: '0',
                                                                                margin: '0',
                                                                            }}
                                                                            className='rounded-circle'
                                                                        >
                                                                            &#x2022;&#x2022;&#x2022;
                                                                        </button>
                                                                        {/* Dropdown Menu */}
                                                                        {isDropdownOpen === shares.id && (
                                                                            <ul
                                                                                style={{
                                                                                    position: 'absolute',
                                                                                    top: '100%',
                                                                                    left: '0',
                                                                                    backgroundColor: 'white',
                                                                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                                                                    listStyle: 'none',
                                                                                    padding: '10px',
                                                                                    margin: '0',
                                                                                    borderRadius: '4px',
                                                                                    zIndex: 1000,
                                                                                }}
                                                                                className="border"
                                                                            >
                                                                                <li style={{ padding: '5px 0', cursor: 'pointer' }} onClick={() => handleDelete(shares.id)}>
                                                                                    <a class="dropdown-item" >Xóa</a>
                                                                                </li>
                                                                            </ul>
                                                                        )}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="timeline-content">

                                                                <div className="timeline-header">
                                                                    <div className="d-flex">
                                                                        <img className="mx-1 ml-3" src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${shares.post_customer_image}?alt=media`} alt="Hồ sơ"
                                                                            style={{ width: '25px', height: '25px' }} />
                                                                        <h4>{shares.post_customer_username}</h4>
                                                                    </div>
                                                                </div>
                                                                <h4 className='ml-3'>{shares.title}</h4>
                                                                <p className="description-text ml-3">
                                                                    {expandedPostId === shares.id
                                                                        ? shares.description
                                                                        : truncateText(shares.description, 100)}
                                                                    {shares.description.length > 100 && (
                                                                        <span
                                                                            className="read-more-toggle"
                                                                            onClick={() => setExpandedPostId(expandedPostId === shares.id ? null : shares.id)}
                                                                        >
                                                                            {expandedPostId === shares.id ? "Ẩn bớt" : "Xem thêm"}
                                                                        </span>
                                                                    )}
                                                                </p>

                                                                <div className="image-container">
                                                                    <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${shares.post_images}?alt=media`} alt="Your image description" className="border rounded" />
                                                                    <span
                                                                        className="custom-block-icon"
                                                                        onClick={() =>
                                                                            handlePlayAudio(
                                                                                shares.audio,
                                                                                shares.title,
                                                                                shares.username,
                                                                                shares.images,
                                                                                shares.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi-play-fill fs-2"></i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="timeline-likes">
                                                                <div className="stats-right">
                                                                    <a href='#'>
                                                                        <span className="stats-text">{shares.so_luong} Bình luận</span>
                                                                    </a>
                                                                </div>
                                                                <div className="stats">
                                                                    <span className="fa-stack fa-fw stats-icon">
                                                                        <i className="fa fa-circle fa-stack-2x text-danger"></i>
                                                                        <i className="fa fa-heart fa-stack-1x fa-inverse t-plus-1"></i>
                                                                    </span>
                                                                    <span className="stats-total">{shares.total_favorites}</span>
                                                                    <span className="stats-total ms-3"><label className="bi-headphones me-1 fs-5"></label>{shares.so_luong}</span>
                                                                </div>
                                                            </div>
                                                            <div className="timeline-footer">
                                                                <a href="javascript:;" className="bi-heart me-4 mx-1 m-r-15 text-inverse-lighter mx-1"></a>
                                                                <a
                                                                    href="javascript:;"
                                                                    className="bi-chat me-1 mx-4 m-r-15 text-inverse-lighter mx-1"
                                                                    onClick={() => handleCommentClick(shares.id)}
                                                                ></a>
                                                                <a href="javascript:;" className="m-r-15 text-inverse-lighter mx-1">
                                                                    <i className="bi bi-share"></i>
                                                                </a>
                                                            </div>
                                                            {visibleCommentBox === shares.id && (
                                                                <div className="timeline-comment-box">
                                                                    <div className="user">
                                                                        <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`} alt="Hồ sơ" />
                                                                    </div>
                                                                    <div className="input">
                                                                        <form>
                                                                            <div className="input-group">
                                                                                <input type="text" className="form-control rounded-corner" placeholder="Viết một bình luận..." />
                                                                                <span className="input-group-btn p-l-10">
                                                                                    <button className="btn btn-primary f-s-12 rounded-corner" type="button">Bình luận</button>
                                                                                </span>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))) : (
                                                <p className='text-center mt-1 p-lg-5'>Không có bài chia sẻ nào!</p>
                                            )}
                                        </ul>
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
                                    className={`bi ${isMuted ? "bi-volume-mute volume" : "bi-volume-up volume"
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

export default Shares;
