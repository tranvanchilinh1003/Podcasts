const RepComment = require('../../models/repComment');

// Tạo một phản hồi mới
exports.createRepComment = (req, res) => {
    const newRepComment = req.body;
    // Tính toán level dựa trên parent_reply_id
    if (newRepComment.parent_reply_id) {
        newRepComment.level = 1;
    } else {
        newRepComment.level = 0;
    }

    RepComment.create(newRepComment, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Reply created successfully', data: result });
    });
};

// Lấy các phản hồi của một bình luận gốc
exports.getRepCommentsByCommentId = (req, res) => {
    const commentId = parseInt(req.params.commentId);
    RepComment.findByCommentId(commentId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ data: result });
    });
};

// Lấy tất cả các phản hồi và các phản hồi con
exports.getAllReplies = (req, res) => {
    RepComment.findAllReplies((err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ data: result });
    });
};

// Xóa phản hồi theo ID
exports.deleteRepComment = (req, res) => {
    const id = parseInt(req.params.id);
    RepComment.deleteById(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Reply deleted successfully' });
    });
};

// Chỉnh sửa phản hồi theo ID
exports.editRepComment = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedContent = req.body.contents;

    RepComment.updateById(id, updatedContent, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Reply updated successfully' });
    });
};
