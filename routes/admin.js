const express = require("express");
const Router = express.Router();
const { body } = require("express-validator");
const adminControllers = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

Router.get("/add-product", isAuth, adminControllers.getAddProduct);

Router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price").isFloat(),
    body("description")
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminControllers.postAddProduct
);

Router.get("/products", isAuth, adminControllers.getProducts);

Router.get("/edit-product/:productId", isAuth, adminControllers.getEditProduct);

Router.post(
  "/edit-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price").isFloat(),
    body("description")
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminControllers.postEditProduct
);

Router.delete("/product/:productId", isAuth, adminControllers.deleteProduct);

module.exports = Router;
