const Order = require("../models/Order");
const Product = require("../models/Product");
const OrderDetail = require("../models/OrderDetail");
const Comment = require("../models/Comment");
const Category = require("../models/Category");
const User = require("../models/User");

class StatisticalController {
  statistical = async (req, res) => {
    const countProduct = await Product.count();
    const countCategory = await Category.count();
    const countComment = await Comment.count();
    const countUser = await User.count();
    const countOrder = await Order.count();
    const countOrderDetail = await OrderDetail.count();
    const dataOrder = await Order.find({});
    const totalAmount = dataOrder.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    return res.status(200).json({
      countProduct,
      countCategory,
      countComment,
      countUser,
      countUser,
      countOrder,
      countOrderDetail,
      totalAmount,
    });
  };
}
module.exports = new StatisticalController();
