const Product = require("../models/Product");
const slugify = require("slugify");

class ProductController {
  createProduct(req, res, next) {
    const formData = req.body;
    if (
      !formData.title ||
      !formData.author ||
      !formData.desc ||
      !formData.year ||
      !formData.category ||
      !formData.price
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin!" });
    }
    Product.findOne({ title: formData.title })
      .then((data) => {
        if (data) {
          res.status(400).json({
            success: false,
            message: "Sản phẩm đã tồn tại!",
          });
        } else {
          return Product.create(formData);
        }
      })
      .then((data) =>
        res.status(200).json({
          success: true,
          message: "Tạo mới danh mục thành công !",
          data: data,
        })
      )
      .catch((err) => {
        res.status(400).json(`Lỗi: ${err}`);
      });
  }
  updateProduct(req, res, next) {
    const id = req.params.id;
    const formData = req.body;
    if (
      !formData.title ||
      !formData.author ||
      !formData.desc ||
      !formData.year ||
      !formData.category ||
      !formData.price ||
      !formData.image
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin!",
      });
    }
    const newSlug = slugify(formData.title, { lower: true });
    const data = {
      title: formData.title,
      author: formData.author,
      desc: formData.desc,
      year: formData.year,
      category: formData.category,
      price: formData.price,
      image: formData.image,
      slug: newSlug,
    };
    Product.updateOne({ _id: id }, data)
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Cập nhật danh mục thành công!",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err.message || "Thất bại!",
        });
      });
  }

  deleteProduct(req, res, next) {
    const id = req.params.id;
    Product.deleteOne({ _id: id })
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Xoá sản phẩm thành công",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: `Lỗi : ${err}`,
        });
      });
  }
  getProductByCategory(req, res, next) {
    const category = req.params.category;
    const litmit = req.query.limit ? parseInt(req.query.limit) : 10;
    Product.find({ category: category })
      .limit(litmit)
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: "Không tìm thấy sản phẩm",
          });
        } else {
          res.status(200).json({
            message: "Tìm thấy sản phẩm",
            data: data,
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: "Lỗi",
        });
      });
  }
  getProduct(req, res, next) {
    const slug = req.params.slug;
    Product.findOne({ slug: slug })
      .then((data) => {
        res.status(200).json({
          success: true,
          message: "Thành công",
          data: data,
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: `Lỗi : ${err}`,
        });
      });
  }
  getProductById(req, res, next) {
    const id = req.params.id;
    Product.findOne({ _id: id })
      .then((data) => {
        res.status(200).json({
          success: true,
          message: "Thành công",
          data: data,
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: `Lỗi : ${err}`,
        });
      });
  }

  getProductAll = async (req, res, next) => {
    let { search, page = 1, category = null } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    try {
      if (search && search.length > 0) {
        const query = search.replace(/['"]+/g, "");
        let replace = `${query}`;
        let re = new RegExp(replace, "i");
        const data = await Product.find({ title: re }).limit(limit);
        return res.status(200).jsonp({
          success: true,
          message: `Thành công`,
          data: data,
        });
      }
      const data = await Product.find(category && { category })
        .skip((+page - 1) * +limit)
        .limit(limit);
      const totalProduct = await Product.count(category && { category });
      const totalPage = Math.ceil(totalProduct / +limit);
      return res.status(200).jsonp({
        success: true,
        message: "Good job",
        data,
        totalPage,
      });
    } catch (err) {
      res.status(400).json(`Lỗi: ${err}`);
    }
  };
}
module.exports = new ProductController();
