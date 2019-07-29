const express = require("express");
const Router = express.Router();
const shopControllers = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

Router.get("/", shopControllers.getIndex);

Router.get("/products", shopControllers.getProducts);

Router.get("/products/:productId", shopControllers.getProduct);

Router.get("/cart", isAuth, shopControllers.getCart);

Router.post("/cart", isAuth, shopControllers.postCart);

Router.post("/cart-delete-item", isAuth, shopControllers.postCartDeleteProduct);

Router.get("/checkout", isAuth, shopControllers.getCheckout);

Router.get("/orders", isAuth, shopControllers.getOrders);

Router.get("/orders/:orderId", isAuth, shopControllers.getInvoice);

module.exports = Router;
