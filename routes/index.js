const express = require("express");
const route = express.Router();
const userController = require("../controller/AuthController");
const CategoryController = require("../controller/CategoryController");
const CommentController = require("../controller/CommentController");
const OrderController = require("../controller/OrderController");
const ProductController = require("../controller/ProductController");
const StatisticalController = require("../controller/StatisticalController");
const { verifyTokenAdmin, verifyToken } = require("../middleware/auth");

function router(app) {
  //auth
  route.get("/statistical", StatisticalController.statistical);
  route.post("/register", userController.register);
  route.get("/getUsers", verifyTokenAdmin, userController.getUsers);
  route.get("/getUser/:id", verifyToken, userController.getUser);
  route.post("/login", userController.login);
  route.put("/updateUser/:id", verifyToken, userController.updateUser);
  route.delete("/deleteUser/:id", verifyTokenAdmin, userController.deleteUser);
  route.post("/refreshToken", userController.createNewRefreshToken);
  route.post("/logout", userController.logout);

  //category
  route.post(
    "/create_category",
    verifyTokenAdmin,
    CategoryController.createCate
  );
  route.put(
    "/update_category/:id",
    verifyTokenAdmin,
    CategoryController.updateCate
  );
  route.delete(
    "/delete_category/:id",
    verifyTokenAdmin,
    CategoryController.deleteCate
  );
  route.get("/get_category_all", CategoryController.getCateAll);
  route.get("/get_category/:id", CategoryController.getCateById);

  //product
  route.post(
    "/create_product",
    verifyTokenAdmin,
    ProductController.createProduct
  );
  route.put(
    "/update_product/:id",
    verifyTokenAdmin,
    ProductController.updateProduct
  );
  route.get("/getProductAll", ProductController.getProductAll);
  route.get("/getProduct/:slug", ProductController.getProduct);
  route.get("/getProductById/:id", ProductController.getProductById);
  route.delete(
    "/delete_product/:id",
    verifyTokenAdmin,
    ProductController.deleteProduct
  );
  route.get(
    "/product_of_category/:category",
    ProductController.getProductByCategory
  );

  route.post("/addComment", verifyToken, CommentController.addComment);
  route.get(
    "/getCommentAll",
    verifyTokenAdmin,
    CommentController.getCommentAll
  );
  route.get("/getCommentById/:productId", CommentController.getCommentById);
  route.delete(
    "/deleteComment/:id",
    verifyTokenAdmin,
    CommentController.deleteComment
  );

  route.post("/insertOrder", verifyToken, OrderController.insertOrder);
  route.get("/getOrders", verifyToken, OrderController.getOrders);
  route.get("/getOrderById/:id", verifyToken, OrderController.getOrderById);
  route.get(
    "/getOrderDetail/:order",
    verifyToken,
    OrderController.getOrderDetail
  );
  route.put("/updateOrder/:id", verifyTokenAdmin, OrderController.updateOrder);
  route.delete("/deleteOrder/:id", verifyToken, OrderController.deleteOrder);
  route.get(
    "/getOrderByUser/:username",
    verifyToken,
    OrderController.getOrderByUser
  );

  return app.use(route);
}

module.exports = router;
