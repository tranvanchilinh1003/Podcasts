// src/components/comments/CommentList.js
import React, { useState } from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments = [], onEdit, userId, onReply, fetchPost, fetchComments }) => {
    const [visibleCount, setVisibleCount] = useState(1);

    const handleShowMore = () => {
        setVisibleCount(prevCount => prevCount + 5);
    };

    return (
        <div className="col-lg-12 col-12">
            {comments.length > 0 ? (
                <>
                    {comments.slice(0, visibleCount).map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onEdit={onEdit}
                            userId={userId}
                            onReply={onReply}
                            fetchPost={fetchPost}
                            fetchComments={fetchComments}
                        />
                    ))}
                    {comments.length > visibleCount && (
                        <div className="text-center mt-3 pb-3">
                            <strong
                                className="ml-3"
                                style={{ fontSize: '16px', color: '#65676B', cursor: 'pointer' }}
                                onClick={handleShowMore}
                            >
                                Xem thêm bình luận
                            </strong>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center">Không có bình luận nào cho bài viết này.</p>
            )}
        </div>
    );
};

export default CommentList;
