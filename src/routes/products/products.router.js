const express = require('express');
const { createProduct, getAllProducts } = require('./products.controller')

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getAllProducts);

module.exports = productRouter;