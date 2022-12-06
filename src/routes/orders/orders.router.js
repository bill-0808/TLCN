const express = require('express');
const { authenticate } = require('../../helpers/jwt_helper');
const { createOrder, getAllOrder, getOneOrder, getOrderByUser, updateOrderStatus } = require('./orders.controller')

const orderRouter = express.Router();

orderRouter.post("/", authenticate, createOrder);
orderRouter.put("/:id", authenticate, updateOrderStatus);
orderRouter.get("/", authenticate, getAllOrder);
orderRouter.get("/user", authenticate, getOrderByUser);
orderRouter.get("/:id", authenticate, getOneOrder);

module.exports = orderRouter;