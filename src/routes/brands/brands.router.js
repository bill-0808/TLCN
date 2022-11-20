const express = require('express');
const { createBrands, getAllBrands, updateBrands, deleteBrands } = require('./brands.controller')
const { authenticate } = require('../../helpers/jwt_helper')

const brandsRouter = express.Router();

brandsRouter.post("/", authenticate, createBrands);
brandsRouter.get("/", getAllBrands);
brandsRouter.put("/:id", authenticate, updateBrands);
brandsRouter.delete("/:id", authenticate, deleteBrands);

module.exports = brandsRouter;