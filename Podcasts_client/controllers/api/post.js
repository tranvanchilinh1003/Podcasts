const Post = require('../../models/post');
// All List 
exports.list = async (req, res, next) => {
    var post = await Post.fetchAll();
    res.status(200).json({
        data: post
    })

};
// Create
exports.create = async (req, res, next) => {
    let post = {
        title: req.body.title,
        description: req.body.description,
        categories_id: req.body.categories_id,
        customers_id: req.body.customers_id,
        images: req.body.images,
        audio: req.body.audio,
    };
    let result = await Post.createPost(post);
    res.status(200).json({
        data: result
    })
};
// Update
exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedPost = {
            title: req.body.title,
            description: req.body.description,
            categories_id: req.body.categories_id,
            customers_id: req.body.customers_id,
            images: req.body.images,
            audio: req.body.audio,
        };
        const result = await Post.updatePost( updatedPost, id);
        console.log(result);
        res.status(200).json({
            message: 'Post updated successfully',
            data: result
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};
// Detail 
exports.edit = async (req, res, next) => {
    try {
        var post = await Post.getEdit(req.params.id);
        res.status(200).json({
            data: post
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
        var post = await Post.deletePost(req.params.id);
        if (!post) {
            res.status(404).json({
                error: 'Product not found'
            });
            return;
        }
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
