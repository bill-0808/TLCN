const express = require('express');
const { createProduct,
    getAllProducts,
    getOneProducts,
    updateProducts,
    deleteProducts,
    getPaggingProduct,
    searchProduct
} = require('./products.controller')
const { authenticate } = require('../../helpers/jwt_helper')
const { upload } = require('../../helpers/upload_file_helper')

const productRouter = express.Router();

productRouter.post("/", authenticate, upload.any('image'), createProduct);
productRouter.get("/all", getAllProducts);
productRouter.get("/", getPaggingProduct);
productRouter.get("/search", searchProduct);
productRouter.get("/:id", getOneProducts);
productRouter.put("/:id", authenticate, upload.any('thumbnail'), updateProducts);
productRouter.delete("/:id", authenticate, deleteProducts);

module.exports = productRouter;