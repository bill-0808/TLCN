const express = require('express');
const { authenticate } = require('../../helpers/jwt_helper');
const { addToCart } = require('./carts.controller')

const cartRouter = express.Router();

cartRouter.post("/", authenticate, addToCart);

module.exports = cartRouter;