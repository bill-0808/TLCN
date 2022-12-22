const express = require('express');
const { createRatings, updateRatings, getOneRate } = require('./ratings.controller')
const { authenticate } = require('../../helpers/jwt_helper')
const { upload } = require('../../helpers/upload_file_helper')

const ratingsRouter = express.Router();

ratingsRouter.post("/", authenticate, upload.any('image'), createRatings);
ratingsRouter.put("/", authenticate, upload.any('image'), updateRatings);
ratingsRouter.get("/:order_detail_id/:product_id", authenticate, getOneRate);

module.exports = ratingsRouter;