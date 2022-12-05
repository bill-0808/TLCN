const express = require('express');
const { authenticate } = require('../../helpers/jwt_helper');
const { createOrder } = require('./orders.controller')

const orderRouter = express.Router();

orderRouter.post("/", authenticate, createOrder);

module.exports = orderRouter;