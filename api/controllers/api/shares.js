const Shares = require("../../models/shares");

exports.list = async (req, res, next) => {
    const page = req.query.page || 1;
    const row = 5; 
    const from = (page - 1) * row;
    const totalProducts = await Shares.countShare(); 
    if(totalProducts > 0){

    
    const totalPages = Math.ceil(totalProducts / row);
    var shares = await Shares.fetchAll(from, row);
    res.status(200).json({
        data: shares,
        meta: {
            current_page: page,
            last_page: totalPages,
            from: from
        }
    })
}else{
    res.status(200).json({
        data: shares,
        meta: {
            current_page: page,
            last_page: 1,
            from: from
        }
    })
}
};
exports.listDetail = async (req, res, next) => {

    var shares = await Shares.getId(req.params.id)

    res.status(200).json({
        data: shares
    })
};

// controllers/api/shares.js
exports.updateShareCount = async (req, res, next) => {
  const postId = req.body.post_id;
  const customerId = req.body.customers_id; // hoặc lấy từ session hoặc request body tùy theo cách bạn lưu customerId

  try {
      await Shares.createShare(postId, customerId); // Thay vì increment, chúng ta chèn dữ liệu mới vào bảng share
      res.status(200).json({ message: 'Share recorded' });
  } catch (error) {
      res.status(500).json({ error: 'Error recording share', message: error.message });
  }
};

exports.getSharesToday = async (req, res) => {
  try {
      const result = await db.query(`
          SELECT post.id, post.title, COUNT(share.id) AS shares_today
          FROM post
          LEFT JOIN share ON post.id = share.post_id AND DATE(share.date) = CURDATE()
          GROUP BY post.id
      `);
      res.json({ data: result });
  } catch (error) {
      console.error("Error fetching shares today:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteDetail = async (req, res, next) => {
    const detailId = req.params.id;
    try {
        await Shares.delete(detailId);
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