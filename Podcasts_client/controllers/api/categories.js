const Category = require("../../models/categories");

exports.list = async (req, res, next) => {
    const page = req.query.page || 1;
    const row = 5; // Số lượng sản phẩm trên mỗi trang
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

exports.create = async (req, res, next) => {
    try {
        const categoties = {
            name: req.body.name,
            images: req.body.images,
            description: req.body.description,
        };
        const addedCategory = await Category.createCategories(categoties);
        res.status(200).json({
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

    let category = {
        name: name,
        images: req.body.images,
        description: req.body.description,
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
