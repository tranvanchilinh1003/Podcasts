const Comment = require('../../models/comment');
// All List 
exports.list = async (req, res, next) => {
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
// Detail 
exports.edit = async (req, res, next) => {
    try {
        var comment = await Comment.getId(req.params.id);
        res.status(200).json({
            data: comment
        });
    } catch (error) {
        console.error('Error updating users:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }   
};
// Delete 
exports.delete = async (req, res, next) => {
    try {
        var comment = await Comment.deleteComment(req.params.id);
        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Product:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};