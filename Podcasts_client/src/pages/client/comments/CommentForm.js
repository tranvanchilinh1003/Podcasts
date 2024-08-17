import React, { useState } from 'react';

const CommentForm = ({ customers_id, postId, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [contents, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (contents.trim()) {
            const data = {
                customers_id,
                postId: parseInt(postId), // Chuyển đổi postId thành số nguyên
                rating,
                contents
            };
            onSubmit(data);
            setMessage('');
        }
    };
    

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <div className="rating d-flex justify-content-center mb-3">
                {[...Array(5)].map((_, index) => (
                    <React.Fragment key={index}>
                        <input
                            type="radio"
                            id={`star-${index + 1}`}
                            name="rating"
                            value={5 - index}
                            checked={rating === 5 - index}
                            onChange={() => setRating(5 - index)}
                        />
                        <label htmlFor={`star-${index + 1}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                            </svg>
                        </label>
                    </React.Fragment>
                ))}
            </div>
            <textarea
                value={contents}
                onChange={(e) => setMessage(e.target.value)}
                className="form-control mb-3"
                rows="3"
                placeholder="Bình luận của bạn"
            />
            <button type="submit" className="btn btn-primary">Gửi</button>
        </form>
    );
};

export default CommentForm;
