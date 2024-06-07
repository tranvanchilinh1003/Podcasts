const Comment = require('../../models/comment');
// All List 
exports.list = async (req, res, next) => {
    var comment = await Comment.getList();
    res.status(200).json({
        data: comment
    })

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