const express = require('express');
const { createProduct, getAllProducts } = require('./products.controller')
const { authenticate } = require('../../helpers/jwt_helper')

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", authenticate, getAllProducts);

module.exports = productRouter;