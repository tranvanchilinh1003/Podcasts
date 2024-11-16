import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommentForm from "../comments/CommentForm";
import CommentList from "../comments/CommentList";
import { Link, useNavigate } from "react-router-dom";
import "./details.css";
import { API_ENDPOINT } from "../../../config/api-endpoint.config";
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
function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", options);
}
function CategoriesDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(0);
  const audioRef = React.createRef();
  const [viewUpdated, setViewUpdated] = useState(false);
  const [customer, setCustomer] = useState(null);

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

  const updateTotalComments = useCallback((postId, newTotal) => {
    if (category?.id === postId) {
      setCategory(prevCategory => ({
        ...prevCategory,
        total_comments: newTotal
      }));
    }
  }, []);  

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT.auth.base}/getId_post/${id}`
      );
      const categoryData = response.data.data[0];
      const customer = getUserFromLocalStorage();
      const userId = customer ? customer.id : null;

      if (userId) {
        const likeResponse = await axios.get(
          `${API_ENDPOINT.auth.base}/check-likes`,
          {
            params: { userId, postId: categoryData.id }, // Add the postId if needed
          }
        );

        const likedPostIds = likeResponse.data.map((item) => item.post_id); // Ensure to access the correct data structure

        // Update isLiked based on whether the post is in likedPostIds
        const updatedCategoryData = {
          ...categoryData,
          isLiked: likedPostIds.includes(categoryData.id),
        };
        setCategory(updatedCategoryData);
      } else {
        setCategory(categoryData);
      }
      setLoading(false); // Ensure loading is set to false at the end
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Error loading data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("customer");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUserId(parsedUser ? parsedUser[0].id : null);
  }, []);

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const percentage =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;

      if (percentage >= 80 && !viewUpdated) {
        updateViewCount();
        setViewUpdated(true); // Set the flag to true to prevent further updates
      }
    }
  };

  const updateViewCount = async () => {
    try {
      await axios.post(`${API_ENDPOINT.auth.base}/update_view/${category.id}`);
      fetchCategoryData();
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleAudioTimeUpdate);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "timeupdate",
          handleAudioTimeUpdate
        );
      }
    };
  }, [audioRef]);

  const getUserFromLocalStorage = () => {
    const userArray = JSON.parse(localStorage.getItem("customer"));
    return userArray && userArray.length > 0 ? userArray[0] : null;
  };
  const profileLink = (id) => {
    return id == getUserFromLocalStorage()?.id
      ? `/account/${id}`
      : `/follow/${id}`;
  };
  const roundTo = (num, places) => {
    const factor = Math.pow(10, places);
    return Math.round(num * factor) / factor;
  };

  const handleLikeClick = async (event) => {
    event.preventDefault();

    const customer = getUserFromLocalStorage();
    if (!customer) {
      navigate("/login");
      return;
    }

    const isLiked = category.isLiked;

    const updatedCategory = {
      ...category,
      isLiked: !isLiked,
      data: {
        ...category.data,
        total_likes: isLiked
          ? category.total_likes - 1
          : category.total_likes + 1,
      },
    };
    setCategory(updatedCategory);
    try {
      if (isLiked) {
        if (category.notificationId) {
          await axios.delete(
            `${API_ENDPOINT.auth.base}/notification/${category.notificationId}`
          );
        }

        await axios.delete(`${API_ENDPOINT.auth.base}/like`, {
          data: {
            post_id: category.id,
            customers_id: customer.id,
          },
        });

        updatedCategory.data.notificationId = null;
        setCategory(updatedCategory);
      } else {
        if (customer.id !== category.customers_id) {
          const response = await axios.post(
            `${API_ENDPOINT.auth.base}/notification`,
            {
              user_id: category.customers_id,
              sender_id: customer.id,
              action: "like",
              post_id: category.id,
            }
          );

          const notificationId = response.data.notification_id;

          updatedCategory.notificationId = notificationId;
          setCategory(updatedCategory);
        }

        await axios.post(`${API_ENDPOINT.auth.base}/like`, {
          post_id: category.id,
          customers_id: customer.id,
        });
      }
      fetchCategoryData();
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!category) return <p>No data found</p>;

  return (
    <>
      <header className="site-header d-flex flex-column justify-content-center align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="mb-0">CHI TIẾT</h2>
            </div>
          </div>
        </div>
      </header>

      <section
        className="latest-podcast-section section-padding pb-0 p-0 mt-3"
        id="section_2"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              <div className="section-title-wrap mb-5">
                <h4 className="section-title">Bài đăng</h4>
              </div>

              <div className="row">
                <div className="col-lg-3 col-12">
                  <div className="custom-block-icon-wrap">
                    <div className="custom-block-image-wrap custom-block-image-detail-page">
                      <img
                        src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${category.images}?alt=media`}
                        className="custom-block-image img-fluid"
                        alt=""
                      />
                      <div className="custom-block-bottom justify-content-around d-flex mt-3 ">
                        <p className="bi-headphones me-1">
                          <span>{category.view}</span>
                        </p>

                        <a
                          href="#"
                          id="like-icon"
                          className={
                            category.isLiked
                              ? "bi-heart-fill fs-6"
                              : "bi-heart me-1 fs-6"
                          }
                          onClick={(e) => handleLikeClick(e, category.id)}
                        >
                          <span>{category.total_likes}</span>
                        </a>

                        <span
                          className="bi-chat me-1"
                          style={{ cursor: "pointer" }}
                        >
                          <span className="me-1">
                            {category.total_comments}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-9 col-12">
                  <div className="custom-block-info">
                    <div className="custom-block-top d-flex ">
                      <small>{formatDate(category.create_date)}</small>
                      <label href="#" className=" ms-auto">
                        {roundTo(category.average_comment_rating, 1)}/5{" "}
                        <StarRating rating={category.average_comment_rating} />
                      </label>
                    </div>
                    <h2 className="mb-2">{category.title || "No Title"}</h2>

                    <p className="description-text">
                      {expandedPostId === category.id ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: category.description,
                          }}
                        />
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: truncateTextWithHtml(
                              category.description,
                              100
                            ),
                          }}
                        />
                      )}{" "}
                      {category.description.length > 100 && (
                        <span
                          className="read-more-toggle"
                          onClick={() =>
                            setExpandedPostId(
                              expandedPostId === category.id
                                ? null
                                : category.id
                            )
                          }
                        >
                          {expandedPostId === category.id
                            ? "Ẩn bớt"
                            : "Xem thêm"}
                        </span>
                      )}
                    </p>
                    <div className="mt-5">
                      <audio
                        className="w-100"
                        controls
                        loop
                        ref={audioRef}
                        src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/audio%2F${category.audio}?alt=media`}
                      />
                    </div>
                    <div className="profile-block profile-detail-block d-flex flex-wrap align-items-center mt-5 rounded-3">
                      <div className="d-flex mb-3 mb-lg-0 mb-md-0">
                        <img
                          src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${category.images_customers}?alt=media`}
                          className="profile-block-image img-fluid"
                          alt=""
                        />
                        <p>
                          {category.username || "No Author"}
                          <strong>Người đăng</strong>
                        </p>
                      </div>
                      <ul className="social-icon ms-lg-auto ms-md-auto">
                        <li className="social-icon-item">
                          {/* <a href="" className="social-icon-link bi-facebook"></a> */}
                          <Link
                            to={profileLink(category.customers_id)}
                            className="social-icon-link bi bi-info-circle-fill"
                          ></Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="related-podcast-section section-padding pt-1">
        <div className="container">
          <div className="row mt-5">
            <div className="section-title-wrap">
            </div>
           <div className="mb-3">
           </div>
            <CommentList postId={category.id} customer={customer}  onUpdateTotalComments={updateTotalComments} totalComments={category.total_comments}/>
          </div>
        </div>
      </section>
    </>
  );
}

export default CategoriesDetail;
