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
          product: product._id,
          quantity: products[i].quantity,
          price: product.price,
        });
        await orderDetail.save();
      }

      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  getOrders = (req, res) => {
    const litmit = req.query.limit ? parseInt(req.query.limit) : 10;
    Order.find({})
      .limit(litmit)
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
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
}
module.exports = new OrderController();
