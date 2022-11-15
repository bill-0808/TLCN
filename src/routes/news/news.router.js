const express = require('express');
const { createNews, getAllNews } = require('./news.controller')
const { authenticate } = require('../../helpers/jwt_helper')
const { upload } = require('../../helpers/upload_file_helper')

const newsRouter = express.Router();

newsRouter.post("/", authenticate, upload.single('thumbnail'), createNews);
newsRouter.get("/", getAllNews);

module.exports = newsRouter;