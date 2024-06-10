const Shares = require("../../models/shares");

exports.list = async (req, res, next) => {
    const page = req.query.page || 1;
    const row = 5; // Số lượng sản phẩm trên mỗi trang
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
exports.deleteDetail = async (req, res, next) => {
    const detailId = req.params.id;
    try {
        // Gọi phương thức delete từ class Shares, truyền id của chi tiết cần xóa
        await Shares.delete(detailId);

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