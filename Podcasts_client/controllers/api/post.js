const Post = require('../../models/post');
const  Cate = require('../../models/categories');
const moment = require('moment-timezone');
// All List 
exports.list = async (req, res, next) => {
    const page = req.query.page || 1;
    const row = 4;
    const from = (page - 1) * row;
    const totalProducts = await Post.coutCustomers();
    if(totalProducts > 0){ 
    const totalPages = Math.ceil(totalProducts / row);
    var post = await Post.fetchAll(from, row);
    res.status(200).json({
        data: post,
        meta: {
            current_page: page,
            last_page: totalPages,
            from: from,
            count: totalProducts
        }
    })
    }else{
        res.status(200).json({
            data: post,
            meta: {
                current_page: page,
                last_page: 1,
                from: from,
                
            }
        })
    }
};
// Create
exports.create = async (req, res, next) => {
    const date_create = moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss');
    let post = {
        title: req.body.title,
        description: req.body.description,
        categories_id: req.body.categories_id,
        customers_id: req.body.customers_id,
        images: req.body.images,
        audio: req.body.audio,
        date: date_create
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
// getIdPost
exports.getPost = async (req, res, next) => {
    try {
        var post = await Post.getIdPost(req.params.id);
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
// get All Post
exports.getAllPost = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const row = 9;
        const from = (page - 1) * row;
        const totalProducts = await Post.coutCustomers();
        if(totalProducts > 0){ 
        const totalPages = Math.ceil(totalProducts / row);
        var post = await Post.getAllPost(from, row);
        res.status(200).json({
            data: post,
            meta: {
                current_page: page,
                last_page: totalPages,
                from: from,
                count: totalProducts
            }
        });
    
    }
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
exports.search = async (req, res, next) => {    
    const key = req.query.messages; 
    try {
        const posts = await Post.search(key);
        res.status(200).json({
            data: posts 
        });
    } catch (error) {
        console.error("Error searching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.suggestKeywords = async (req, res, next) => {    
    let key = req.query.keyword.toLowerCase();
    try {
        const keywords = await Post.suggestKeywords(key);
        res.status(200).json({
            data: keywords
        });
    } catch (error) {
        console.error("Error suggesting keywords:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.data = async (req, res, next) => {    
    
    try {
        
        const data = await Post.getData();
        res.status(200).json({
            data
        });
    } catch (error) {
        console.error("Error suggesting keywords:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.chart = async (req, res, next) => {    
    try {
        const PostStats = await Post.getChart(); 
        res.json(PostStats);
      } catch (error) {
        console.error('Error fetching customer stats:', error);
        res.status(500).json({ error: 'Error fetching customer stats' });
      }
    }
 