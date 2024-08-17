const Favourite = require("../../models/favourite");

exports.list = async (req, res, next) => {
    const page = req.query.page || 1;
    const row = 5; 
    const from = (page - 1) * row;
    const totalProducts = await Favourite.countFavourite(); 
    if(totalProducts > 0) {

    const totalPages = Math.ceil(totalProducts / row);
    var favourite = await Favourite.fetchAll(from, row);
    res.status(200).json({
        data: favourite,
        meta: {
            current_page: page,
            last_page: totalPages,
            from: from
        }
    })
}else {
    res.status(200).json({
        data: favourite,
        meta: {
            current_page: page,
            last_page: 1,
            from: from
        }
    })
}
};
exports.listDetail = async (req, res, next) => {

    var favourite = await Favourite.getId(req.params.id);

    res.status(200).json({
        data: favourite
    })
};



exports.updateFavouriteCount = async (req, res, next) => {
    const postId = req.body.post_id;
    const customerId = req.body.customers_id; // hoặc lấy từ session hoặc request body tùy theo cách bạn lưu customerId
  
    try {
        await Favourite.createFavourite(postId, customerId); // Thay vì increment, chúng ta chèn dữ liệu mới vào bảng favourite
        res.status(200).json({ message: 'Favourite recorded' });
    } catch (error) {
        res.status(500).json({ error: 'Error recording favourite', message: error.message });
    }
  };
// controllers/api/favourites.js
exports.getFavouriteToday = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT post.id, post.title, COUNT(favourite.id) AS favourite_today
            FROM post
            LEFT JOIN favourite ON post.id = favourite.post_id AND DATE(favourite.date) = CURDATE()
            GROUP BY post.id
        `);
        res.json({ data: result });
    } catch (error) {
        console.error("Error fetching favourite today:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.deleteDetail = async (req, res, next) => {
    const detailId = req.params.id;
    try {
        await Favourite.delete(detailId);
        res.status(200).json({
            message: 'Detail deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error deleting detail',
            message: error.message
        });
    }
};