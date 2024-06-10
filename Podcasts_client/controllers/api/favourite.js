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
exports.deleteDetail = async (req, res, next) => {
    const detailId = req.params.id;
    try {
        // Gọi phương thức delete từ class Shares, truyền id của chi tiết cần xóa
        await Favourite.delete(detailId);

        // Trả về phản hồi thành công nếu xóa thành công
        res.status(200).json({
            message: 'Detail deleted successfully'
        });
    } catch (error) {
        // Nếu có lỗi xảy ra, trả về phản hồi lỗi
        res.status(500).json({
            error: 'Error deleting detail',
            message: error.message // Thông điệp lỗi cụ thể
        });
    }
};