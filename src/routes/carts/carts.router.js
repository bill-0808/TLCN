const express = require('express');
const { authenticate } = require('../../helpers/jwt_helper');
const { addToCart, getAllCart } = require('./carts.controller')

const cartRouter = express.Router();

cartRouter.post("/", authenticate, addToCart);
cartRouter.get("/", authenticate, getAllCart);

module.exports = cartRouter;