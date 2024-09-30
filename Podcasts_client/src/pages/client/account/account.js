import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { Progress } from "antd";
import axiosInstance from "../firebase/axiosConfig";
import { DialogService } from "../../../services/common/DialogService";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./account.css";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase/firebase";
import PostUser from "../post-user/post-user";
import Shares from "../shares/shares";
import EditPassword from "../edit-password/edit-password";
import InFoUser from "../info-user/info-user";
import Spinner from "../Spinner/Spinner";
import InfoUser from "../follower/follower";
import MyEditor from "../tinymce/tinymce";
function Account() {
  const { id } = useParams();
  const {
    control,
    watch,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [userInfo, setUserInfo] = useState(null);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [fileImg, setFileImg] = useState(null);
  const [fileAudio, setFileAudio] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
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
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [Delete, onDelete] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  const getUserFromLocalStorage = () => {
    const userArray = JSON.parse(localStorage.getItem("customer"));
    return userArray && userArray.length > 0 ? userArray[0] : null;
  };

  const handleEditorChange = (content) => {
    if (content !== editorContent) {
      setEditorContent(content);
      setValue("description", content);
    
    }
  };
  const descriptionValue = watch("description");
  // Hàm để toggle mở/đóng dropdown
  const toggleDropdown = (postId) => {
    setIsDropdownOpen(isDropdownOpen === postId ? null : postId);
  };

  // Open modal and set form data
  const handleEdit = (post) => {
    setEditPost(post);
    // Populate form fields with existing data
    setValue("id", post.id);
    setValue("title", post.title);
    setValue("description", post.description);
    setValue("categories_id", post.categories_id);
    setValue("images", post.images);
    setValue("audio", post.audio);
    setShowModal(true);
  };

  // Hàm xử lý khi click "Xóa"
  const handleDelete = async (postId) => {
    const confirmed = await DialogService.showConfirmationDialog(
      "post",
      postId
    );
    if (confirmed) {
      await onDelete(postId);
    }
    fetchPost();
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/categories_All"
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const [visibleCommentBox, setVisibleCommentBox] = useState(null);

  const handleCommentClick = (postId) => {
    // Toggle the visibility of the comment box for the clicked post
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
  const fetchPost = async () => {
    try {
      const customer = getUserFromLocalStorage();
      const userId = customer ? customer.id : null;
      const response = await axios.get(
        `http://localhost:8080/api/post-customer/${id}`
      );

      if (userId) {
        const likeResponse = await axios.get(
          "http://localhost:8080/api/check-likes",
          {
            params: { userId },
          }
        );

        
        const likedPostIds = likeResponse.data.map((item) => item.post_id);


        const updatedData = response.data.data.map((post) => ({
          ...post,
          isLiked: likedPostIds.includes(post.id),
        }));

        setData(updatedData);
      } else {
        setData(response.data.data);
      }
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
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const onFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "images") {
        setFileImg(files[0]);
      } else if (name === "audio") {
        setFileAudio(files[0]);
      }
    }
  };

  const uploadFile = async (file, path, setProgress) => {
    const fileRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
    });

    await uploadTask;
    setProgress(100); // Ensure progress is set to 100 after successful upload
    return path.split("/").pop();
  };
  const onSubmit = async (data) => {
    try {
      if (fileImg) {
        const imgExtension = fileImg.name.split(".").pop();
        const imgFileName = `${Date.now()}.${imgExtension}`;
        const imgPath = `upload/${imgFileName}`;
        data.images = await uploadFile(fileImg, imgPath, setImgUploadProgress);
      }

      if (fileAudio) {
        const audioExtension = fileAudio.name.split(".").pop();
        const audioFileName = `${Date.now()}.${audioExtension}`;
        const audioPath = `audio/${audioFileName}`;
        data.audio = await uploadFile(
          fileAudio,
          audioPath,
          setAudioUploadProgress
        );
      }

      data.customers_id = id;

      await axiosInstance.patch(`/api/post/${editPost.id}`, data);
      DialogService.success("Cập nhập bài đăng thành công");
      await fetchPost();
      handleClose();
      setImgUploadProgress(0);
      setAudioUploadProgress(0);
    } catch (error) {
      console.error("Upload failed:", error);
      DialogService.error("Thêm thất bại");
    }
  };

  useEffect(() => {
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
        setValue("gender", user.gender.toString());
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [id, setValue]);

  const handleLikeClick = async (event, postId) => {
    event.preventDefault();

    const customer = getUserFromLocalStorage();
    if (!customer) {
      navigate("/login");
      return;
    }

    const post = data.find((post) => post.id === postId);
    const isLiked = post?.isLiked;

    // Update state immediately
    const updatedData = data.map((p) =>
      p.id === postId
        ? {
            ...p,
            isLiked: !isLiked,
            total_likes: isLiked ? p.total_likes - 1 : p.total_likes + 1,
          }
        : p
    );

    setData(updatedData);

    try {
      if (isLiked) {
        await axios.delete("http://localhost:8080/api/like", {
          data: {
            post_id: postId,
            customers_id: customer.id,
          },
        });
      } else {
        await axios.post("http://localhost:8080/api/like", {
          post_id: postId,
          customers_id: customer.id,
        });
      }
    } catch (error) {
      console.error("Error updating like status:", error);

      setData(data);
    }
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

  if (loading) return <Spinner />;
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
                        alt="Hồ sơ"
                        // className='w-100'
                        style={{
                          maxWidth: "auto",
                          height: "100%",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                    <div className="profile-header-info">
                      <h4 className="m-t-10 m-b-5">
                        {userInfo?.username}
                        {userInfo.isticket === "active" && (
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91"
                            className="verified-image img-fluid"
                            alt="Verified"
                          />
                        )}
                      </h4>
                      <p className="m-b-10 mt-2 ">
                        Số người theo dõi:{" "}
                        <label className="text-white fw-bold">
                          {userInfo?.followersCount}
                        </label>
                      </p>
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
                        aria-selected="false"
                        className="nav-link show active"
                      >
                        BÀI VIẾT
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        id="info-tab"
                        data-bs-toggle="tab"
                        href="#info"
                        role="tab"
                        aria-controls="info"
                        aria-selected="true"
                        target="__blank"
                        className="nav-link "
                      >
                        THÔNG TIN
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        id="shares-tab"
                        data-bs-toggle="tab"
                        href="#shares"
                        role="tab"
                        aria-controls="shares"
                        aria-selected="false"
                        className="nav-link"
                      >
                        CHIA SẺ
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        id="follow-tab"
                        data-bs-toggle="tab"
                        href="#follow"
                        role="tab"
                        aria-controls="follow"
                        aria-selected="false"
                        className="nav-link"
                      >
                        THEO DÕI
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="profile-content">
                <div className="tab-content p-0">
                  <div
                    className="tab-pane fade"
                    id="info"
                    role="tabpanel"
                    aria-labelledby="info-tab"
                  >
                    <div className="row gutters">
                      <div className="row gutters">
                        <div className="col-md-12">
                          <div className="card border shadow-sm">
                            <div className="card-body">
                              <div className="row">
                                <InFoUser />
                                <div className="col-md-6">
                                  <EditPassword />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  <div
                    className="tab-pane fade show active"
                    id="posts"
                    role="tabpanel"
                    aria-labelledby="posts-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <div
                          id="content"
                          className="content content-full-width"
                        >
                          <div className="profile-content">
                            {/* bắt đầu nội dung tab */}
                            <div className="tab-content p-0">
                              {/* bắt đầu tab #profile-post */}
                              <div
                                className="tab-pane fade active show"
                                id="profile-post"
                              >
                                {/* bắt đầu timeline */}
                                <ul className="timeline">
                                  <PostUser fetchPost={fetchPost} />
                                  {data.length > 0 ? (
                                    data.map((post) => (
                                      <li key={post.id}>
                                        <div className="timeline-body border">
                                          <div className="timeline-header">
                                            <div className=" text-centercol-md-12 d-flex justify-content-between align-items-center">
                                              <div className="d-flex align-items-center ">
                                                <span className="userimage ">
                                                  <img
                                                    src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`}
                                                    alt="Hồ sơ"
                                                  />
                                                </span>
                                                <span className="username mx-1">
                                                  <a
                                                    href="#"
                                                    className="d-flex "
                                                  >
                                                    {userInfo?.username}
                                                    {userInfo.isticket ===
                                                      "active" && (
                                                      <img
                                                        src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91"
                                                        className="verified-image img-fluid mx-1 h-75 mt-1"
                                                        alt="Verified"
                                                      />
                                                    )}
                                                  </a>
                                                </span>
                                                {/* <span className="text-muted">{post.view} Lượt xem</span> */}
                                                <span className="time mx-2">
                                                  {formatDate(post.create_date)}
                                                </span>
                                              </div>

                                              <div
                                                style={{
                                                  position: "relative",
                                                  display: "inline-block",
                                                }}
                                                className=" mx-2"
                                              >
                                                {/* Dropdown Button */}
                                                <button
                                                  onClick={() =>
                                                    toggleDropdown(post.id)
                                                  }
                                                  style={{
                                                    background: "none",
                                                    border: "none",
                                                    fontSize: "25px",
                                                    cursor: "pointer",
                                                    padding: "0",
                                                    margin: "0",
                                                  }}
                                                  className="rounded-circle"
                                                >
                                                  {/* &#x2022;&#x2022;&#x2022; */}
                                                  <i className="bi bi-three-dots"></i>
                                                </button>
                                                {/* Dropdown Menu */}
                                                {isDropdownOpen === post.id && (
                                                  <ul
                                                    style={{
                                                      position: "absolute",
                                                      top: "100%",
                                                      left: "0",
                                                      backgroundColor: "white",
                                                      boxShadow:
                                                        "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                      listStyle: "none",
                                                      padding: "10px",
                                                      margin: "0",
                                                      borderRadius: "4px",
                                                      zIndex: 1000,
                                                    }}
                                                    className="border"
                                                  >
                                                    <li
                                                      style={{
                                                        padding: "5px 0",
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleEdit(post)
                                                      }
                                                    >
                                                      <a class="dropdown-item">
                                                        Sửa
                                                      </a>
                                                    </li>
                                                    {/* Modal */}
                                                    <Modal
                                                      show={showModal}
                                                      onHide={handleClose}
                                                      size="lg"
                                                      className=""
                                                    >
                                                      <Modal.Header closeButton>
                                                        <Modal.Title>
                                                          Chỉnh sửa bài viết
                                                        </Modal.Title>
                                                      </Modal.Header>
                                                      <Modal.Body>
                                                        <form
                                                          onSubmit={handleSubmit(
                                                            onSubmit
                                                          )}
                                                        >
                                                          <div className="row">
                                                            <div className="col-6">
                                                              <input
                                                                type="hidden"
                                                                className="form-control"
                                                                id="id"
                                                                name="id"
                                                                {...register(
                                                                  "id"
                                                                )}
                                                              />
                                                              <label>
                                                                Tiêu đề
                                                              </label>
                                                              <input
                                                                type="text"
                                                                className="form-control"
                                                                id="title"
                                                                name="title"
                                                                placeholder="Tiêu đề..."
                                                                {...register(
                                                                  "title",
                                                                  {
                                                                    required: true,
                                                                  }
                                                                )}
                                                              />
                                                              {errors.title && (
                                                                <span className="text-danger">
                                                                  Vui lòng nhập
                                                                  tiêu đề!
                                                                </span>
                                                              )}
                                                            </div>
                                                            <div className="col-6">
                                                              <label>
                                                                Hình ảnh
                                                              </label>
                                                              <input
                                                                type="file"
                                                                className="form-control"
                                                                id="images"
                                                                name="images"
                                                                accept="image/*"
                                                                onChange={
                                                                  onFileChange
                                                                }
                                                              />
                                                              <Progress
                                                                percent={
                                                                  imgUploadProgress
                                                                }
                                                              />
                                                            </div>
                                                            <div className="col-6">
                                                              <label>
                                                                Audio
                                                              </label>
                                                              <input
                                                                type="file"
                                                                className="form-control"
                                                                id="audio"
                                                                name="audio"
                                                                accept="audio/*"
                                                                onChange={
                                                                  onFileChange
                                                                }
                                                              />
                                                              <Progress
                                                                percent={
                                                                  audioUploadProgress
                                                                }
                                                              />
                                                            </div>
                                                            <div className="col-6">
                                                              <label>
                                                                Thể loại
                                                              </label>
                                                              <select
                                                                name="categories_id"
                                                                id="categories_id"
                                                                className="form-control"
                                                                {...register(
                                                                  "categories_id",
                                                                  {
                                                                    required: true,
                                                                  }
                                                                )}
                                                              >
                                                                <option value="">
                                                                  Vui lòng chọn
                                                                  loại!
                                                                </option>
                                                                {categories.map(
                                                                  (
                                                                    category
                                                                  ) => (
                                                                    <option
                                                                      key={
                                                                        category.id
                                                                      }
                                                                      value={
                                                                        category.id
                                                                      }
                                                                    >
                                                                      {
                                                                        category.name
                                                                      }
                                                                    </option>
                                                                  )
                                                                )}
                                                              </select>
                                                              {errors.categories_id && (
                                                                <span className="text-danger">
                                                                  Vui lòng chọn
                                                                  loại!
                                                                </span>
                                                              )}
                                                            </div>
                                                            <div className="col-12">
                                                              <label>
                                                                Mô tả
                                                              </label>
                                                              {/* <textarea className='form-control' placeholder='Mô tả...'
                                                                id="description"
                                                                name="description"
                                                                {...register('description')}
                                                              ></textarea> */}
                                                              <Controller
                                                                name="description"
                                                                control={
                                                                  control
                                                                }
                                                                render={({
                                                                  field,
                                                                }) => (
                                                                  <MyEditor
                                                                    value={
                                                                      descriptionValue
                                                                    } // Pass the current value
                                                                    onEditorChange={
                                                                      handleEditorChange
                                                                    } // Handle changes
                                                                    {...field} // Spread other props if needed
                                                                  />
                                                                )}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="row">
                                                            <div className="col text-end">
                                                              <Button
                                                                variant="secondary"
                                                                className="mt-5 mx-1"
                                                                onClick={
                                                                  handleClose
                                                                }
                                                              >
                                                                Hủy
                                                              </Button>
                                                              <Button
                                                                variant="primary"
                                                                type="submit"
                                                                className="mt-5"
                                                              >
                                                                Lưu
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        </form>
                                                      </Modal.Body>
                                                    </Modal>
                                                    <li
                                                      style={{
                                                        padding: "5px 0",
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleDelete(post.id)
                                                      }
                                                    >
                                                      <a class="dropdown-item">
                                                        Xóa
                                                      </a>
                                                    </li>
                                                  </ul>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="timeline-content ">
                                            <h4>{post.title}</h4>
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
                                                    __html:
                                                      truncateTextWithHtml(
                                                        post.description,
                                                        100
                                                      ),
                                                  }}
                                                />
                                              )}{" "}
                                              {post.description.length >
                                                100 && (
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
                                            <div className="image-container  d-flex justify-content-center">
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
                                                {post.total_shares} Chia sẻ
                                              </span>
                                              <span className="stats-text">
                                                {post.total_comments} Bình luận
                                              </span>
                                            </div>
                                            <div className="stats">
                                              <span className="fa-stack fa-fw stats-icon">
                                                <i className="fa fa-circle fa-stack-2x text-danger"></i>
                                                <i className="fa fa-heart fa-stack-1x fa-inverse t-plus-1"></i>
                                              </span>
                                              <span className="stats-total ">
                                                {post.total_likes}
                                              </span>
                                              <span className="stats-total ms-3">
                                                {" "}
                                                <label className="bi-headphones me-1 fs-5"></label>
                                                {post.view}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="timeline-footer">
                                            <a
                                              href="#"
                                              id="like-icon"
                                              className={
                                                post.isLiked
                                                  ? "bi-heart-fill text-danger fs-6"
                                                  : "bi-heart me-1 fs-6"
                                              }
                                              onClick={(e) =>
                                                handleLikeClick(e, post.id)
                                              }
                                            ></a>
                                            <a
                                            
                                              className="bi-chat me-1 mx-4 m-r-15 text-inverse-lighter mx-1"
                                              onClick={() =>
                                                handleCommentClick(post.id)
                                              }
                                            ></a>
                                            <a
                                          
                                              className="m-r-15 text-inverse-lighter mx-1"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleShareClick(post.id);
                                              }}
                                            >
                                              <i className="bi bi-share"></i>
                                            </a>
                                          </div>
                                          {/* Comment Box */}
                                          {visibleCommentBox === post.id && (
                                            <div className="timeline-comment-box">
                                              <div className="user mt-1">
                                                <img
                                                  src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`}
                                                  alt="Hồ sơ"
                                                />
                                              </div>
                                              <div className="input row">
                                                <form action="">
                                                  <div className="input-group-user input-group-post">
                                                    <input
                                                      type="text"
                                                      className="input-post rounded-corner col-md-12 col-12 col-lg-10"
                                                      placeholder="Bình luận bài viết..."
                                                    />
                                                    <button
                                                      className="button--submit col-md-12 col-12 col-lg-2"
                                                      type="button"
                                                    >
                                                      Bình luận
                                                    </button>
                                                  </div>
                                                </form>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </li>
                                    ))
                                  ) : (
                                    <p className="text-center ">
                                      Không có bài viết nào!
                                    </p>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <section
                    className="tab-pane fade"
                    id="shares"
                    role="tabpanel"
                    aria-labelledby="shares-tab"
                  >
                    <Shares />
                  </section>
                  <div
                    className="tab-pane fade"
                    id="follow"
                    role="tabpanel"
                    aria-labelledby="follow-tab"
                  >
                    <InfoUser id={id} />
                  </div>
                  {/* nôi dung bài đăng */}
                  <div
                    className="tab-pane fade"
                    id="posts"
                    role="tabpanel"
                    aria-labelledby="posts-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <div
                          id="content"
                          className="content content-full-width"
                        >
                          <div className="profile-content">
                            {/* bắt đầu nội dung tab */}
                            <div className="tab-content p-0">
                              {/* bắt đầu tab #profile-post */}
                              <div
                                className="tab-pane fade active show"
                                id="profile-post"
                              >
                                <ul className="timeline">
                                  <div className="timeline-body rounded">
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
                                              onClick={handleShow}
                                              placeholder="Thêm một bài viết..."
                                            />
                                            <span className="input-group-btn p-l-10">
                                              <button
                                                className="btn btn-primary f-s-12 rounded-corner"
                                                type="button"
                                                onClick={handleShow}
                                              >
                                                Thêm bài viết
                                              </button>
                                            </span>
                                          </div>
                                        </form>
                                      </div>
                                    </div>

                                    {/* Component Modal */}
                                    <Modal
                                      show={showModal}
                                      onHide={handleClose}
                                      size="lg"
                                    >
                                      <Modal.Header closeButton>
                                        <Modal.Title>Thêm bài viết</Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        {/* Nội dung của Modal */}
                                        {/* <p>Hãy nhập nội dung bài viết của bạn ở đây.</p> */}
                                        <div className="row">
                                          <div className="col-6">
                                            <label>Tiêu đề</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                            />
                                          </div>
                                          <div className="col-6">
                                            <label>Hình ảnh</label>
                                            <input
                                              type="file"
                                              className="form-control"
                                            />
                                          </div>
                                          <div className="col-6">
                                            <label>Audio</label>
                                            <input
                                              type="file"
                                              className="form-control"
                                            />
                                          </div>
                                          <div className="col-6">
                                            <label>Thể loại</label>
                                            <select
                                              className="form-control"
                                              style={{
                                                width: "100%",
                                                height: "2.5rem",
                                                fontSize: "1rem",
                                              }}
                                            >
                                              <option disabled selected>
                                                Vui lòng chọn loại!
                                              </option>
                                            </select>
                                          </div>
                                          <div className="col-12">
                                            <label>Audio</label>
                                            <textarea
                                              className="form-control"
                                              placeholder="Mô tả..."
                                            ></textarea>
                                          </div>
                                        </div>
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button
                                          variant="secondary"
                                          onClick={handleClose}
                                        >
                                          Hủy
                                        </Button>
                                        <Button
                                          variant="primary"
                                          onClick={handleClose}
                                        >
                                          Thêm
                                        </Button>
                                      </Modal.Footer>
                                    </Modal>
                                  </div>
                                  {data.map((post) => (
                                    <li key={post.id}>
                                      {/* Bắt đầu thời gian trên timeline */}
                                      <div className="timeline-time">
                                        <span className="time text-center">
                                          {formatTimeDate(post.create_date)}
                                        </span>
                                        <span className="time">
                                          {formatDate(post.create_date)}
                                        </span>
                                      </div>
                                      {/* Bắt đầu biểu tượng timeline */}
                                      <div className="timeline-icon">
                                        <a href="#">&nbsp;</a>
                                      </div>
                                      {/* Bắt đầu nội dung timeline */}
                                      <div className="timeline-body border">
                                        <div className="timeline-header">
                                          <span className="userimage">
                                            <img
                                              src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`}
                                              alt="Hồ sơ"
                                            />
                                          </span>
                                          <span className="username mx-1">
                                            <a >
                                              {userInfo?.username}
                                            </a>
                                          </span>
                                          <span className="pull-right text-muted">
                                            {post.view} Lượt xem
                                          </span>
                                        </div>
                                        <div className="timeline-content">
                                          <h4>{post.title}</h4>
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
                                            
                                            className="m-r-15 text-inverse-lighter mx-1"
                                          >
                                            <i className="bi bi-hand-thumbs-up"></i>{" "}
                                            Thích
                                          </a>
                                          <a
                                            
                                            className="m-r-15 text-inverse-lighter mx-1"
                                            onClick={() =>
                                              handleCommentClick(post.id)
                                            }
                                          >
                                            <i className="bi bi-chat"></i> Bình
                                            luận
                                          </a>
                                          <a
                                            
                                            className="m-r-15 text-inverse-lighter mx-1"
                                          >
                                            <i className="bi bi-share"></i> Chia
                                            sẻ
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="shares"
                    role="tabpanel"
                    aria-labelledby="shares-tab"
                  >
                    <h3 className="mb-4">Chia sẻ</h3>
                    <p>hihi1</p>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="favorites"
                    role="tabpanel"
                    aria-labelledby="favorites-tab"
                  >
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

export default Account;
