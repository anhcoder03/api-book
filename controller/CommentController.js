const Comment = require("../models/Comment");
const Product = require("../models/Product");

class CommentController {
  addComment = (req, res) => {
    const { username, productId } = req.body;
    Comment.findOne({ productId: productId, username: username })
      .then((data) => {
        if (data) {
          res.status(400).json({
            success: false,
            message: "Bạn đã đánh giá sản phẩm này rồi",
          });
        } else {
          return Comment.create(req.body);
        }
      })
      .then((data) => {
        Comment.find({ productId: productId }).then((data) => {
          const totalScore = data.reduce(
            (sum, comment) => sum + comment.rating,
            0
          );
          const reviewCount = data.length;
          const averageScore = totalScore / reviewCount;
          Product.findOne({ _id: productId }).then((data) => {
            data.review_count = reviewCount;
            data.average_score = averageScore;
            return data.save();
          });
        });
        res.status(200).json({
          message: "Đánh giá sản phẩm thành công",
          data,
        });
      })
      .catch((err) => {
        res.status(403).json({
          message: "Lỗi:" + err,
          success: false,
        });
      });
  };
  getCommentById = (req, res) => {
    const productId = req.params.productId;
    Comment.find({ productId: productId })
      .then((data) => {
        if (!data) {
          return res.status(404).json({
            message: "Không có đánh giá nào cho sản phẩm này",
          });
        }
        return res.status(200).json({
          data: data,
          message: "Tìm thấy dữ liệu",
        });
      })
      .catch((err) => {
        res.status(403).json("Lỗi " + err);
      });
  };

  getCommentAll = async (req, res) => {
    let { page = 1 } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    try {
      const data = await Comment.find({})
        .skip((+page - 1) * +limit)
        .limit(limit);
      const totalComment = await Comment.count({});
      const totalPage = Math.ceil(totalComment / +limit);
      if (data) {
        res.status(200).json({
          data,
          totalPage,
          message: "Oke lala",
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };
  deleteComment = async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      req.status(200).json({
        message: "Xoá comment thành công!",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  };
}
module.exports = new CommentController();
