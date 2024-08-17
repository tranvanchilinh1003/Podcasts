import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments, onEdit, onDelete, onReply, onLike, userId }) => (
    <div className="col-lg-12 col-12 mt-5">
        <div className="section-title-wrap mt-5 mb-5">
            <h4 className="section-title">Danh sách bình luận</h4>
        </div>
        {comments.length > 0 ? (
            comments.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReply={onReply}
                    onLike={onLike}
                    userId={userId}
                />
            ))
        ) : (
            <p className="text-center">Không có bình luận nào cho bài viết này.</p>
        )}
    </div>
);

export default CommentList;
