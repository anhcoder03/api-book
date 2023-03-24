const express = require("express");
const route = express.Router();
const userController = require("../controller/AuthController");
const CategoryController = require("../controller/CategoryController");
const CommentController = require("../controller/CommentController");
const ProductController = require("../controller/ProductController");
const { verifyTokenAdmin, verifyToken } = require("../middleware/auth");

function router(app) {
  //auth
  route.post("/register", userController.register);
  route.get("/getUsers", userController.getUsers);
  route.get("/getUser/:id", userController.getUser);
  route.post("/login", userController.login);
  route.put("/updateUser/:id", verifyToken, userController.updateUser);
  route.delete("/deleteUser/:id", verifyTokenAdmin, userController.deleteUser);
  route.post("/refreshToken", userController.createNewRefreshToken);
  route.post("/logout", userController.logout);

  //category

  route.post("/create_category", CategoryController.createCate);
  route.put("/update_category/:id", CategoryController.updateCate);
  route.delete("/delete_category/:id", CategoryController.deleteCate);
  route.get("/get_category_all", CategoryController.getCateAll);
  route.get("/get_category/:id", CategoryController.getCateById);

  //product
  route.post("/create_product", ProductController.createProduct);
  route.put("/update_product/:id", ProductController.updateProduct);
  route.get("/getProductAll", ProductController.getProductAll);
  route.get("/getProduct/:slug", ProductController.getProduct);
  route.get("/getProductById/:id", ProductController.getProductById);
  route.delete("/delete_product/:id", ProductController.deleteProduct);
  route.get(
    "/product_of_category/:category",
    ProductController.getProductByCategory
  );

  route.post("/addComment", verifyToken, CommentController.addComment);
  route.get("/getCommentAll/:productId", CommentController.getCommentAll);
  return app.use(route);
}

module.exports = router;
