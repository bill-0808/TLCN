const express = require('express');
const { createRatings } = require('./ratings.controller')
const { authenticate } = require('../../helpers/jwt_helper')
const { upload } = require('../../helpers/upload_file_helper')

const newsRouter = express.Router();

newsRouter.post("/", authenticate, upload.any('image'), createRatings);

module.exports = newsRouter;