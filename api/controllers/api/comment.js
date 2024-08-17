const Comment = require('../../models/comment');
exports.listcomment = async (req, res, next) => {
    const page = req.query.page || 1;
    const row = 5; // Số lượng sản phẩm trên mỗi trang
    const from = (page - 1) * row;
    const totalProducts = await Comment.countComment();
    if(totalProducts > 0) {
    const totalPages = Math.ceil(totalProducts / row);
    var comment = await Comment.getList(from, row);
    res.status(200).json({
        data: comment,
        meta: {
            current_page: page,
            last_page: totalPages,
            from: from,
            count: totalProducts
        }
    })
    }else{
        res.status(200).json({
            data: comment,
            meta: {
                current_page: page,
                last_page: 1,
                from: from
            }
        })
    }
};
// Lấy danh sách bình luận cho một bài viết cụ thể
exports.list = async (req, res, next) => {
    const postId = req.query.postId;
    const page = req.query.page || 1;
    const row = 5; // Số lượng bình luận trên mỗi trang
    const from = (page - 1) * row;
    
    try {
        const totalComments = await Comment.countComment(); // Tổng số bình luận
        const totalPages = Math.ceil(totalComments / row); // Tổng số trang
        const comments = await Comment.getByPostId(postId); // Lấy bình luận theo postId
        
        res.status(200).json({
            data: comments,
            meta: {
                current_page: page,
                last_page: totalPages,
                from: from,
                count: totalComments
            }
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

// Thêm mới bình luận
exports.create = async (req, res, next) => {
    const { postId, customers_id, contents, rating } = req.body;

    if (!postId || !customers_id || !contents) {
        return res.status(400).json({
            error: 'Post ID, User ID và Content là bắt buộc'
        });
    }

    const newComment = {
        post_id: postId,
        customers_id: customers_id,
        contents: contents,
        rating: rating || 0, // Giá trị mặc định của rating là 0 nếu không có
        date: new Date()
    };

    try {
        const result = await Comment.createComment(newComment);
        res.status(201).json({
            message: 'Comment created successfully',
            data: { id: result.insertId, ...newComment }
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


// Xem chi tiết bình luận theo id
exports.getEdit = async (req, res, next) => {
    const commentId = req.params.id;
    try {
        const comment = await Comment.getByPostId(commentId);
        res.status(200).json({
            data: comment
        });
    } catch (error) {
        console.error('Error fetching comment details:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }   
};

// Cập nhật bình luận theo id
exports.update = async (req, res, next) => {
    const commentId = req.params.id;
    const { contents } = req.body;

    if (!contents) {
        return res.status(400).json({
            error: 'Content is required'
        });
    }

    try {
        const result = await Comment.updateComment(commentId, contents);
        if (result.affectedRows > 0) {
            res.status(200).json({
                message: 'Comment updated successfully'
            });
        } else {
            res.status(404).json({
                error: 'Comment not found'
            });
        }
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

// Xóa bình luận theo id
exports.delete = async (req, res, next) => {
    const commentId = req.params.id;
    try {
        await Comment.deleteComment(commentId);
        res.status(200).json({
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};
