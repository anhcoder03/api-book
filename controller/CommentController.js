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
  getCommentAll = (req, res) => {
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
}
module.exports = new CommentController();
