import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CommentForm from '../comments/CommentForm';
import CommentList from '../comments/CommentList';
import { Link, useNavigate } from "react-router-dom";
import './details.css';

// function formatDate(dateString) {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     const date = new Date(dateString);
//     return date.toLocaleDateString(undefined, options);
// }
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
    const fetchComments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/comments', {
                params: { postId: id }
            });
            setComments(response.data.data);
        } catch (error) {
            console.error("Error loading comments:", error);
        }
    };


    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/getId_post/${id}`);
                const categoryData = response.data.data[0];
                setCategory(categoryData);
                setLoading(false);
            } catch (error) {
                console.error("Error loading data:", error);
                setError('Error loading data');
                setLoading(false);
            }
        };

        fetchCategoryData();
        fetchComments();
    }, [id]);

    useEffect(() => {
        const storedUser = localStorage.getItem('customer');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUserId(parsedUser ? parsedUser[0].id : null);
    }, []);

    const handleCommentSubmit = async (newComment) => {
        try {
            await axios.post('http://localhost:8080/api/comments', newComment);
            fetchComments(); // Update comments after successful submission
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${id}`);
            fetchComments(); // Update comments after successful deletion
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleReply = (commentId) => {
        // Tìm bình luận tương ứng và chuyển đổi trạng thái reply form thành visible
        setComments(comments.map(comment =>
            comment.id === commentId ? { ...comment, showReplyForm: !comment.showReplyForm } : comment
        ));
    };


    const handleLike = async (commentId, userId, postId) => {
        try {
            await axios.post('http://localhost:8080/api/likes', { commentId, userId, postId });
            // Cập nhật số lượng thích bình luận hoặc làm gì đó sau khi thích thành công
        } catch (error) {
            console.error("Error liking comment:", error);
        }
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

            <section className="latest-podcast-section section-padding pb-0" id="section_2">
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
                                                alt=''
                                            />

                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-9 col-12">
                                    <div className="custom-block-info">
                                        <div className="custom-block-top d-flex mb-1">
                                            <small>
                                                <i className="bi-clock-fill custom-icon">

                                                    {formatDate(category.create_date)}

                                                </i>
                                            </small>
                                        </div>
                                        <h2 className="mb-2">{category.title || 'No Title'}</h2>
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
                                                        __html:
                                                            truncateTextWithHtml(
                                                                category.description,
                                                                100
                                                            ),
                                                    }}
                                                />
                                            )}{" "}
                                            {category.description.length >
                                                100 && (
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
                                            <audio className="w-100" controls loop
                                                src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/audio%2F${category.audio}?alt=media&token=3a5d5036-9549-4a5f-9276-853532e74fa4`}>
                                            </audio>
                                        </div>
                                        <div className="profile-block profile-detail-block d-flex flex-wrap align-items-center mt-5">
                                            <div className="d-flex mb-3 mb-lg-0 mb-md-0">
                                                <img
                                                    src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${category.images_customers}?alt=media`}
                                                    className="profile-block-image img-fluid" alt="" />
                                                <p>
                                                    {category.username || 'No Author'}
                                                    <strong>Người đăng</strong>
                                                </p>
                                            </div>
                                            <ul className="social-icon ms-lg-auto ms-md-auto">
                                                <li className="social-icon-item">
                                                    {/* <a href="" className="social-icon-link bi-facebook"></a> */}
                                                    <Link to={profileLink(category.customers_id)} className="social-icon-link bi bi-info-circle-fill">
                                                    </Link>
                                                </li>
                                                {/* <li className="social-icon-item">
                                                    <a href="" className="social-icon-link bi-instagram"></a>
                                                </li>
                                                <li className="social-icon-item">
                                                    <a href="" className="social-icon-link bi-whatsapp"></a>
                                                </li> */}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="related-podcast-section section-padding">
                <div className="container">
                    <div className="row mt-5">
                        <div className="section-title-wrap">
                            <h4 className="section-title">Bình luận của bạn</h4>
                        </div>

                        {userId ? (
                            <div className="col-lg-7 col-7 mt-5">
                                <CommentForm customers_id={userId} postId={id} onSubmit={handleCommentSubmit} />
                            </div>
                        ) : (
                            <div className=" mt-5 text-center">
                                <p>Đăng nhập để bình luận</p>
                            </div>
                        )}

                        <CommentList
                            comments={comments}
                            onEdit={fetchComments}
                            onDelete={handleDelete}
                            onReply={handleReply}
                            onLike={handleLike}
                            userId={userId}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default CategoriesDetail;
