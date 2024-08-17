import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentItem.css';
import { DialogService } from '../../../services/common/DialogService';

const API_BASE_URL = 'http://localhost:8080/api';

const Star = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill={filled ? "gold" : "lightgray"}>
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
    </svg>
);

const Rating = ({ value }) => {
    const maxRating = 5;
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
        stars.push(<Star key={i} filled={i <= value} />);
    }

    return <div className="d-flex mt-1">{stars}</div>;
};

const CommentItem = ({ comment = {}, onEdit, onDelete, onLike, userId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replies, setReplies] = useState([]);
    const [replyFormVisibleFor, setReplyFormVisibleFor] = useState(null);
    const [replyDropdownOpen, setReplyDropdownOpen] = useState({});
    const [replyToEdit, setReplyToEdit] = useState(null);
    const [editedReplyContent, setEditedReplyContent] = useState('');
    const [visibleReplies, setVisibleReplies] = useState(0);

    const organizeReplies = (replies) => {
        const map = {};
        const result = [];

        replies.forEach(reply => {
            map[reply.id] = { ...reply, replies: [] };
        });

        replies.forEach(reply => {
            if (reply.parent_reply_id) {
                const parent = map[reply.parent_reply_id];
                if (parent) {
                    parent.replies.push(map[reply.id]);
                }
            } else {
                result.push(map[reply.id]);
            }
        });

        return result;
    };

    const fetchReplies = async () => {
        if (comment.id) {
            try {
                const response = await axios.get(`${API_BASE_URL}/repcomments/${comment.id}`);
                const organizedReplies = organizeReplies(response.data.data || []);
                setReplies(organizedReplies);
            } catch (error) {
                console.error('Error fetching replies:', error);
                alert('Có lỗi xảy ra khi tải phản hồi. Vui lòng thử lại.');
            }
        }
    };

    useEffect(() => {
        fetchReplies();
    }, [comment.id]);

    const handleEdit = async () => {
        if (comment.id && editedMessage) {
            try {
                await axios.patch(`${API_BASE_URL}/comments/${comment.id}`, {
                    contents: editedMessage
                });
                await fetchReplies(); // Refresh replies after editing
                setIsEditing(false);
                onEdit();
            } catch (error) {
                console.error('Error updating comment:', error);
                alert('Có lỗi xảy ra khi cập nhật bình luận. Vui lòng thử lại.');
            }
        }
    };

    const handleLike = () => {
        if (comment.id && comment.post_id) {
            onLike(comment.id, userId, comment.post_id);
        }
    };

    const handleReplySubmit = async (parentId = null) => {
        if (replyContent) {
            try {
                const currentDate = new Date();
                const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

                await axios.post(`${API_BASE_URL}/repcomments`, {
                    contents: replyContent,
                    date: formattedDate,
                    customers_id: userId,
                    original_comment_id: comment.id,
                    parent_reply_id: parentId
                });

                await fetchReplies(); // Refresh replies
                setReplyContent('');
                setReplyFormVisibleFor(null); // Reset after submission
            } catch (error) {
                console.error('Error creating reply:', error);
                alert('Có lỗi xảy ra khi tạo phản hồi. Vui lòng thử lại.');
            }
        }
    };

    const handleReplyToReply = (replyId) => {
        setReplyFormVisibleFor(replyId); // Set the reply we're responding to
    };

    const toggleReplyForm = () => {
        setReplyFormVisibleFor(replyFormVisibleFor === comment.id ? null : comment.id); // Toggle form visibility
    };

    const toggleReplyDropdown = (replyId) => {
        setReplyDropdownOpen((prev) => ({ ...prev, [replyId]: !prev[replyId] }));
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen); // Toggle main comment dropdown visibility
    };

    const handleEditReply = async () => {
        if (replyToEdit && editedReplyContent) {
            try {
                await axios.patch(`${API_BASE_URL}/repcomments/${replyToEdit.id}`, {
                    contents: editedReplyContent
                });

                await fetchReplies(); // Refresh replies
                setReplyToEdit(null);
                setEditedReplyContent('');
            } catch (error) {
                console.error('Error updating reply:', error);
                alert('Có lỗi xảy ra khi cập nhật phản hồi. Vui lòng thử lại.');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmed = await DialogService.showConfirmationDialog('comments', commentId);
        if (confirmed) {
            onDelete(commentId); // Gọi hàm xóa từ props
        }
    };

    const handleDeleteReply = async (replyId) => {
        const confirmed = await DialogService.showConfirmationDialog('repcomments', replyId);
        if (confirmed) {
            await fetchReplies(); // Làm mới phản hồi sau khi xóa
        }
    };

    const loadMoreReplies = () => {
        const remainingReplies = replies.length - visibleReplies;
        const repliesToShow = Math.min(remainingReplies, 5); // Hiển thị tối đa 5 reply mỗi lần
        setVisibleReplies(visibleReplies + repliesToShow);
    };

    const renderReplies = (replies, level = 1) => {
        return (
            <div className="mt-2">
                 {replies.slice(0, visibleReplies).map(reply => (
                    <div key={reply.id} className={`reply-container rounded pl-4 mb-2 ${level > 1 ? 'reply-nested' : ''}`}>
                        <div className="d-flex mb-2">
                            <img
                                src={reply.images ? `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${reply.images}?alt=media` : 'default-avatar.png'}
                                alt={reply.username || 'Anonymous'}
                                className="comment-item-pic rounded-5"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div className="bg_Contens ml-3 pt-2 px-3 rounded-4">
                                <strong>{reply.username || 'Anonymous'}</strong>
                                <span className="ml-2 text-muted">{reply.date ? new Date(reply.date).toLocaleDateString() : ''}</span>
                                <p>{reply.contents || ''}</p>
                            </div>
                            <div className="position-relative">
                                <button onClick={() => toggleReplyDropdown(reply.id)} className="mt-3 ml-2 btn btn-link"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        padding: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <i className="bi bi-three-dots" style={{ fontSize: '24px', color: 'black' }}></i>
                                </button>
                                {replyDropdownOpen[reply.id] && (
                                    <div className="dropdown-menu dropdown-menu-right show position-absolute">
                                        {reply.customers_id === userId ? (
                                            <>
                                                <button onClick={() => {
                                                    setReplyToEdit(reply);
                                                    setEditedReplyContent(reply.contents);
                                                    setReplyDropdownOpen(false); 
                                                }} className="dropdown-item">Chỉnh sửa</button>
                                                <button onClick={() => handleDeleteReply(reply.id)} className="dropdown-item">Xóa</button>
                                            </>
                                        ) : (
                                            <button className="dropdown-item">Báo cáo</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="reply-options d-flex justify-content-start mt-2 ml-5">
                            <p className='btn-link mx-3' onClick={() => handleLike(reply.id)} style={{ fontSize: '14px', color: 'black' }}>Thích</p>
                            <p className='btn-link mx-3' onClick={() => handleReplyToReply(reply.id)} style={{ fontSize: '14px', color: 'black' }}>Trả lời</p>
                        </div>
                        {replyToEdit && replyToEdit.id === reply.id && (
                            <div className="edit-form mt-2 ml-5">
                                <textarea
                                    value={editedReplyContent}
                                    onChange={(e) => setEditedReplyContent(e.target.value)}
                                    rows="2"
                                    className="form-control"
                                />
                                <button onClick={handleEditReply} className="btn btn-primary mt-2">Lưu</button>
                            </div>
                        )}
                        {replyFormVisibleFor === reply.id && (
                            <div className="reply-form mt-2 ml-5">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    rows="2"
                                    className="form-control"
                                    placeholder="Viết phản hồi..."
                                />
                                <button onClick={() => handleReplySubmit(reply.id)} className="btn btn-primary mt-2">Gửi</button>
                            </div>
                        )}

                        {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies, level + 1)}
                    </div>
                ))}
                    {visibleReplies < replies.length && (
                        <div className='d-flex justify-content-around'>
                            <strong onClick={loadMoreReplies} className=" btn-link" style={{ fontSize: '16px', color: '#65696B', textDecoration: 'none', fontWeight: '700' }}>Xem thêm</strong>
                        </div>
                )}
            </div>          
        );
    };

    return (
        <div className="comment-item rounded p-3">
            <div className="d-flex">
                <img
                    src={comment.images ? `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${comment.images}?alt=media` : 'default-avatar.png'}
                    alt={comment.username || 'Anonymous'}
                    className="comment-item-pic rounded-5"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                <div className="bg_Contens ml-3 pt-2 px-3 rounded-4">
                    <strong>{comment.username || 'Anonymous'}</strong>
                    <span className="ml-2 text-muted">{comment.date ? new Date(comment.date).toLocaleDateString() : ''}</span>
                    <Rating value={comment.rating || 0} />
                    <p>{comment.contents || ''}</p>
                </div>
                {userId && (  // Kiểm tra nếu userId tồn tại
                    <div className="position-relative ml-2">
                        <button onClick={toggleDropdown} className="mt-4 ml-2 btn btn-link"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <i className="bi bi-three-dots" style={{ fontSize: '24px', color: 'black' }}></i>
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu dropdown-menu-right show position-absolute">
                                {comment.customers_id === userId ? (
                                    <>
                                        <button onClick={() => {
                                            setIsEditing(true);
                                            setEditedMessage(comment.contents);
                                            setDropdownOpen(false);
                                        }} className="dropdown-item">Chỉnh sửa</button>
                                        <button onClick={() => handleDeleteComment(comment.id)} className="dropdown-item">Xóa</button>
                                    </>
                                ) : (
                                    <button className="dropdown-item">Báo cáo</button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {userId && (  // Kiểm tra nếu userId tồn tại
                <div className="comment-options d-flex justify-content-start mt-2 ml-5">
                    <p className='btn-link mx-3' onClick={handleLike} style={{ fontSize: '14px', color: 'black' }}>Thích</p>
                    <p className='btn-link mx-3' onClick={toggleReplyForm} style={{ fontSize: '14px', color: 'black' }}>Trả lời</p>
                </div>
            )}
            {isEditing && (
                <div>
                    <textarea
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        rows="3"
                        className="form-control"
                    />
                    <button onClick={handleEdit} className="btn btn-primary mt-2">Lưu</button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary mt-2">Hủy</button>
                </div>
            )}
            {replyFormVisibleFor === comment.id && (
                <div className="reply-form mt-2">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows="3"
                        className="form-control"
                        placeholder="Viết phản hồi..."
                    />
                    <button onClick={() => handleReplySubmit()} className="btn btn-primary mt-2">Gửi</button>
                </div>
            )}
            {replies.length > 0 && (
                <>
                    {visibleReplies === 0 ? (
                        <div onClick={loadMoreReplies} className=" mt-2 ml-5" >
                          <strong className='ml-3' style={{ fontSize: '16px', color: '#65676B' }}> Xem tất cả {replies.length} phản hồi</strong>
                        </div>
                    ) : (
                        renderReplies(replies)
                    )}
                </>
            )}
        </div>
    );
};

export default CommentItem;
