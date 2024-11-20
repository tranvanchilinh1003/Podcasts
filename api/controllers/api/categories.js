const Category = require("../../models/categories");
const moment = require('moment-timezone');

exports.list = async (req, res, next) => {
    const page = req.query.page || 1;
    const row = 5; 
    const from = (page - 1) * row;
    const totalProducts = await Category.countCategories();
    if(totalProducts > 0) {
    const totalPages = Math.ceil(totalProducts / row);
    var categories = await Category.fetchAll(from, row);


    res.status(200).json({
        data: categories,
        meta: {
            current_page: page,
            last_page: totalPages,
            from: from,
            count: totalProducts
        }
    })
}else {
    res.status(200).json({
        data: categories,
        meta: {
            current_page: page,
            last_page: 1,
            from: from
        }
    })
}
};
exports.listall = async (req, res, next) => {

    var categories = await Category.fetchAllCate();

    res.status(200).json({
        data: categories,
        
    })

    

};

exports.create = async (req, res, next) => {
    try {
    const date_create = moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss');

        const category = {
            name: req.body.name,
            images: req.body.images,
            create_date: date_create,
            description: req.body.description,
        };

        // Kiểm tra tên thể loại đã tồn tại
        const existingCategory = await Category.checkCategoryExists(req.body.name);
        if (existingCategory.length > 0) {
            return res.status(400).json({ error: 'Tên thể loại đã tồn tại' });
        }

        const addedCategory = await Category.createCategories(category);
        res.status(201).json({
            data: addedCategory,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.detail = async (req, res, next) => {
    let category_id = req.params.id;

    let result = await Category.getUpdateCategories(category_id);

    res.status(201).json({
        data: result,
    })

};
exports.getId = async (req, res, next) => {
    var category_id = await Category.getCateId(req.params.id);
    res.status(200).json({
        data: category_id,
    })

};

exports.update = async (req, res, next) => {
    let category_id = req.params.id;
    let name = req.body.name;
    const date_create = moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss');
    let category = {
        name: name,
        images: req.body.images,
        description: req.body.description,
        update_date: date_create
    }
    let result = await Category.updateCategories(category, category_id);



    res.status(201).json({
        result: result,
        data: category

    })
};
exports.delete = async (req, res, next) => {
    let category_id = req.params.id;
    try {
        let result = await Category.deleteCategories(category_id);
        res.status(201).json({
            result: result
        });
    } catch (error) {
        console.error("Không thể xóa danh mục:", error);
        res.status(500).json({
            error: "Không thể xóa danh mục."
        });
    }
};


exports.order = async (req, res, next) => {
    const categories = req.body; // Nhận mảng danh mục từ request body
  
    try {
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (!category.id) {
          return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
        }
        const updateResult = await Category.findByIdAndUpdate(category.id, i.toString());
        if (updateResult === 0) {
          console.warn(`Danh mục với ID ${category.id} không được cập nhật`);
        }
      }
  
      // Trả về phản hồi thành công
      res.status(200).json({ message: 'Cập nhật thứ tự thành công' });
    } catch (error) {
      console.error('Cập nhật thứ tự thất bại', error);
      res.status(500).json({ message: 'Cập nhật thứ tự thất bại', error });
    }
  };
