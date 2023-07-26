const Order = require("../models/Order");
const Product = require("../models/Product");
const OrderDetail = require("../models/OrderDetail");

class OrderController {
  insertOrder = async (req, res) => {
    try {
      const { userId, username, email, address, phone, totalAmount, products } =
        req.body;
      const order = new Order({
        userId,
        username,
        email,
        address,
        phone,
        totalAmount,
      });
      await order.save();
      // Lưu chi tiết đơn hàng
      for (let i = 0; i < products.length; i++) {
        const product = await Product.findById(products[i].id);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        const orderDetail = new OrderDetail({
          order: order._id,
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity: products[i].quantity,
          price: products[i].price,
        });
        await orderDetail.save();
      }

      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  getOrders = async (req, res) => {
    let { page = 1 } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    try {
      const data = await Order.find({})
        .skip((+page - 1) * +limit)
        .limit(limit);
      const totalOrder = await Order.count({});
      const totalPage = Math.ceil(totalOrder / +limit);
      return res.status(200).json({
        success: true,
        message: "Good job",
        data,
        totalPage,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  };
  getOrderDetail = (req, res) => {
    const order = req.params.order;
    OrderDetail.find({ order: order })
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  getOrderById = async (req, res) => {
    try {
      const data = await Order.findById(req.params.id);
      res.status(200).json({
        data,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  };
  updateOrder = async (req, res) => {
    const id = req.params.id;
    const formData = req.body;
    try {
      const data = await Order.findById(id);
      if (data) {
        const order = {
          status: formData.status,
        };
        const newOrder = await Order.updateOne({ _id: id }, order);
        res.status(200).json({
          message: "Cập nhật thành công!",
          newOrder,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  deleteOrder = async (req, res) => {
    const id = req.params.id;
    try {
      await Order.findByIdAndDelete(id);
      await OrderDetail.deleteOne({ order: id });
      res.status(200).json({
        message: "Xoá đơn hàng thành công!",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  getOrderByUser = async (req, res) => {
    const username = req.params.username;
    try {
      const data = await Order.find({ username: username });
      if (data) {
        res.status(200).json({
          message: "Oke lala!",
          data,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };
}
module.exports = new OrderController();
