import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from '../firebase/axiosConfig';
import { DialogService } from "../../../services/common/DialogService";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './account.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase';

function Account() {
  const { id } = useParams();
  const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm();
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
  const [oldImage, setOldImage] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [visibleCommentBox, setVisibleCommentBox] = useState(null);

  const handleCommentClick = (postId) => {
    // Toggle the visibility of the comment box for the clicked post
    setVisibleCommentBox(visibleCommentBox === postId ? null : postId);
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
  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/post-customer/${id}`);
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
  const onSubmit = async (data) => {
    setIsUploading(true);
    if (file) {
      const fileExtension = file.name.split('.').pop();
      const currentDate = new Date();
      const newFileName = `${currentDate.toISOString().replace(/[:.]/g, '-')}.${fileExtension}`;
      const path = `upload/${newFileName}`;
      const storageRef = ref(storage, path);

      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        data.images = newFileName; // Set the new image URL
      } catch (error) {
        console.error('Upload failed:', error);
        DialogService.error('Upload failed. Please try again.');
        setIsUploading(false);
        return;
      }
    } else {
      data.images = oldImage;
    }
    data.isticket = 'inactive';
    data.date = new Date().toISOString();
    data.password = data.password || oldPassword;
    console.log('Data to submit:', data);

    try {
      data.role = 'user';
      // data.gender = 0;
      const response = await axiosInstance.patch(`/api/customers/${id}`, data);
      if (response.status === 200) {
        DialogService.success('Cập nhật tài khoản thành công');
      }
    } catch (error) {
      console.error('Update failed:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 400) {
        DialogService.error('Username or email already exists.');
      } else {
        DialogService.error('Update failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching user info...");
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customers/${id}`);
        console.log("User info received:", response.data.data);
        const user = response.data.data[0];
        setUserInfo(user);
        setOldImage(user.images);
        setOldPassword(user.password);
        setValue('username', user.username);
        setValue('full_name', user.full_name);
        setValue('email', user.email);
        setValue('gender', user.gender.toString());
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

  return (
    <section className="latest-podcast-section section-padding pb-0" id="section_2">
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
                        alt="Hồ sơ"
                        style={{maxWidth: 'auto', height: '100%', borderRadius: '50%'}}
                      />
                    </div>
                    <div className="profile-header-info">
                      <h4 className="m-t-10 m-b-5">{userInfo?.username}</h4>
                      <p className="m-b-10 text-white">Frontend</p>
                    </div>
                  </div>
                  <ul className="profile-header-tab nav nav-tabs mt-5">
                    <li className="nav-item">
                      <a id="posts-tab" data-bs-toggle="tab" href="#posts" role="tab" aria-controls="posts" aria-selected="false" className="nav-link ">BÀI VIẾT</a>
                    </li>
                    <li className="nav-item">
                      <a id="info-tab" data-bs-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true" target="__blank" className="nav-link show active">THÔNG TIN</a>
                    </li>
                    <li className="nav-item">
                      <a id="shares-tab" data-bs-toggle="tab" href="#shares" role="tab" aria-controls="shares" aria-selected="false" className="nav-link">CHIA SẺ</a>
                    </li>
                    <li className="nav-item">
                      <a id="favorites-tab" data-bs-toggle="tab" href="#favorites" role="tab" aria-controls="favorites" aria-selected="false" className="nav-link">YÊU THÍCH</a>
                    </li>
                  </ul>

                </div>
              </div>
              <div className="profile-content">
                <div className="tab-content p-0">
                  <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                    <div className="row gutters">
                      <div className="col-md-12">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                              <div className="mb-3">
                                <label htmlFor="username" className="form-label">Tên Người Dùng:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="username"
                                  disabled
                                  value={userInfo ? userInfo.username : 'Đang Tải...'}
                                />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="full_name" className="form-label">Họ Tên:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="full_name"
                                  {...register('full_name', { required: 'Họ tên là bắt buộc' })}
                                />
                                {errors.full_name && <span className="text-danger">{errors.full_name.message}</span>}
                              </div>
                              <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  id="email"
                                  {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Địa chỉ email không hợp lệ' } })}
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                              </div>
                              <div className="mb-3">
                                <label htmlFor="password" className="form-label">Mật Khẩu:</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="password"
                                  {...register('password')}
                                />
                                {errors.password && <span className="text-danger">{errors.password.message}</span>}
                              </div>
                              <div className="mb-3">
                                <label htmlFor="confirm_password" className="form-label">Xác Nhận Mật Khẩu:</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="confirm_password"
                                  {...register('confirm_password', { validate: value => value === watch('password') || 'Mật khẩu không khớp' })}
                                />
                                {errors.confirm_password && <span className="text-danger">{errors.confirm_password.message}</span>}
                              </div>
                              <div className="mb-3">
                                <label htmlFor="images" className="form-label">Hình Đại Diện:</label>
                                <input
                                  type="file"
                                  className="form-control"
                                  id="images"
                                  accept="image/*"
                                  onChange={(e) => setFile(e.target.files[0])}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Giới Tính:</label><br />
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="male"
                                    value="0"
                                    {...register('gender')}
                                    defaultChecked={userInfo && userInfo.gender === '0'}
                                  />
                                  <label className="form-check-label" htmlFor="male">Nam</label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="female"
                                    value="1"
                                    {...register('gender')}
                                    defaultChecked={userInfo && userInfo.gender === '1'}
                                  />
                                  <label className="form-check-label" htmlFor="female">Nữ</label>
                                </div>
                              </div>
                              <div className="text-end">
                                <button type="submit" className="btn btn-primary" disabled={isUploading}>Cập Nhật Hồ Sơ</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* nội dung thông tin */}
                  <div className="tab-pane fade" id="info" role="tabpanel" aria-labelledby="info-tab">
                    <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                      <div className="row gutters">
                        <div className="col-md-12">
                          <div className="card border-0 shadow-sm">
                            <div className="card-body">
                              <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                  <label htmlFor="username" className="form-label">Tên Người Dùng:</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    disabled
                                    value={userInfo ? userInfo.username : 'Đang Tải...'}
                                  />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="full_name" className="form-label">Họ Tên:</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="full_name"
                                    {...register('full_name', { required: 'Họ tên là bắt buộc' })}
                                  />
                                  {errors.full_name && <span className="text-danger">{errors.full_name.message}</span>}
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="email" className="form-label">Email:</label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Địa chỉ email không hợp lệ' } })}
                                  />
                                  {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="password" className="form-label">Mật Khẩu:</label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    {...register('password')}
                                  />
                                  {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="confirm_password" className="form-label">Xác Nhận Mật Khẩu:</label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="confirm_password"
                                    {...register('confirm_password', { validate: value => value === watch('password') || 'Mật khẩu không khớp' })}
                                  />
                                  {errors.confirm_password && <span className="text-danger">{errors.confirm_password.message}</span>}
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="images" className="form-label">Hình Đại Diện:</label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    id="images"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Giới Tính:</label><br />
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id="male"
                                      value="0"
                                      {...register('gender')}
                                      defaultChecked={userInfo && userInfo.gender === '0'}
                                    />
                                    <label className="form-check-label" htmlFor="male">Nam</label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id="female"
                                      value="1"
                                      {...register('gender')}
                                      defaultChecked={userInfo && userInfo.gender === '1'}
                                    />
                                    <label className="form-check-label" htmlFor="female">Nữ</label>
                                  </div>
                                </div>
                                <div className="text-end">
                                  <button type="submit" className="btn btn-primary" disabled={isUploading}>Cập Nhật Hồ Sơ</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* nôi dung bài đăng */}
                  <div className="tab-pane fade" id="posts" role="tabpanel" aria-labelledby="posts-tab">
                    <div className="row">
                      <div className="col-md-12">
                        <div id="content" className="content content-full-width">
                          <div className="profile-content">
                            {/* bắt đầu nội dung tab */}
                            <div className="tab-content p-0">
                              {/* bắt đầu tab #profile-post */}
                              <div className="tab-pane fade active show" id="profile-post">
                                {/* bắt đầu timeline */}

                                <ul className="timeline">
                                  <div className="timeline-body rounded">
                                    <div className="timeline-comment-box">
                                      <div className="user">
                                        <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`} alt="Hồ sơ" />
                                      </div>
                                      <div className="input">
                                        <form action="">
                                          <div className="input-group">
                                            <input type="text" className="form-control rounded-corner" onClick={handleShow} placeholder="Thêm một bài viết..." />
                                            <span className="input-group-btn p-l-10">
                                              <button className="btn btn-primary f-s-12 rounded-corner" type="button" onClick={handleShow}>Thêm bài viết</button>
                                            </span>
                                          </div>
                                        </form>
                                      </div>
                                    </div>

                                    {/* Component Modal */}
                                    <Modal show={showModal} onHide={handleClose} size="lg">
                                      <Modal.Header closeButton>
                                        <Modal.Title>Thêm bài viết</Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        {/* Nội dung của Modal */}
                                        {/* <p>Hãy nhập nội dung bài viết của bạn ở đây.</p> */}
                                        <div className='row'>
                                          <div className='col-6'>
                                            <label>Tiêu đề</label>
                                            <input type='text' className='form-control' />
                                          </div>
                                          <div className='col-6'>
                                            <label>Hình ảnh</label>
                                            <input type='file' className='form-control' />
                                          </div>
                                          <div className='col-6'>
                                            <label>Audio</label>
                                            <input type='file' className='form-control' />
                                          </div>
                                          <div className='col-6'>
                                            <label>Thể loại</label>
                                            <select className='form-control' style={{ width: '100%', height: '2.5rem', fontSize: '1rem' }}>
                                              <option disabled selected>Vui lòng chọn loại!</option>
                                            </select>
                                          </div>
                                          <div className='col-12'>
                                            <label>Audio</label>
                                            <textarea className='form-control' placeholder='Mô tả...'></textarea>
                                          </div>
                                        </div>
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                          Hủy
                                        </Button>
                                        <Button variant="primary" onClick={handleClose}>
                                          Thêm
                                        </Button>
                                      </Modal.Footer>
                                    </Modal>
                                  </div>
                                  {data.map(post => (
                                    <li key={post.id}>
                                      {/* Bắt đầu thời gian trên timeline */}
                                      <div className="timeline-time">
                                        <span className="time text-center">{formatTimeDate(post.create_date)}</span>
                                        <span className="time">{formatDate(post.create_date)}</span>
                                      </div>
                                      {/* Bắt đầu biểu tượng timeline */}
                                      <div className="timeline-icon">
                                        <a href="javascript:;">&nbsp;</a>
                                      </div>
                                      {/* Bắt đầu nội dung timeline */}
                                      <div className="timeline-body border">
                                        <div className="timeline-header">
                                          <span className="userimage">
                                            <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`} alt="Hồ sơ" />
                                          </span>
                                          <span className="username mx-1">
                                            <a href="javascript:;">{userInfo?.username}</a>
                                          </span>
                                          <span className="pull-right text-muted">{post.view} Lượt xem</span>
                                        </div>
                                        <div className="timeline-content">
                                          <h4>{post.title}</h4>
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
                                          <div className="image-container">
                                            <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`} alt="Your image description" className="border rounded" />
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
                                            <span className="stats-text mx-1">259 Chia sẻ</span>
                                            <a href='#'>
                                              <span className="stats-text">{post.total_comments} Bình luận</span>
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
                                            <span className="stats-total">{post.total_favorites}</span>
                                          </div>
                                        </div>
                                        <div className="timeline-footer">
                                          <a href="javascript:;" className="m-r-15 text-inverse-lighter mx-1">
                                            <i className="bi bi-hand-thumbs-up"></i> Thích
                                          </a>
                                          <a
                                            href="javascript:;"
                                            className="m-r-15 text-inverse-lighter mx-1"
                                            onClick={() => handleCommentClick(post.id)}
                                          >
                                            <i className="bi bi-chat"></i> Bình luận
                                          </a>
                                          <a href="javascript:;" className="m-r-15 text-inverse-lighter mx-1">
                                            <i className="bi bi-share"></i> Chia sẻ
                                          </a>
                                        </div>
                                        {/* Khu vực nhập bình luận */}
                                        {visibleCommentBox === post.id && (
                                          <div className="timeline-comment-box">
                                            <div className="user">
                                              <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`} alt="Hồ sơ" />
                                            </div>
                                            <div className="input">
                                              <form action="">
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
                                  ))}


                                </ul>

                              </div>

                            </div>

                          </div>

                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="tab-pane fade" id="shares" role="tabpanel" aria-labelledby="shares-tab">
                    <h3 className="mb-4">Chia sẻ</h3>
                    <p>hihi1</p>
                  </div>

                  <div className="tab-pane fade" id="favorites" role="tabpanel" aria-labelledby="favorites-tab">
                    <h3 className="mb-4">Yêu thích</h3>
                    <p>hihi?</p>
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
    </section>
  );
}

export default Account;
