const Order = require("../models/Order");
const Product = require("../models/Product");

class OrderController {
  insertOrder = async (req, res) => {
    try {
      const { userId, username, email, address, totalAmount, products } =
        req.body;
      const order = new Order({
        userId,
        username,
        email,
        address,
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
}
module.exports = new OrderController();
