const express = require('express');
const { createNews, getAllNews, getOneNews, updateNews, deleteNews } = require('./news.controller')
const { authenticate } = require('../../helpers/jwt_helper')
const { upload } = require('../../helpers/upload_file_helper')

const newsRouter = express.Router();

newsRouter.post("/", authenticate, upload.single('thumbnail'), createNews);
newsRouter.get("/", getAllNews);
newsRouter.get("/:id", getOneNews);
newsRouter.put("/:id", authenticate, upload.single('thumbnail'), updateNews);
newsRouter.delete("/:id", authenticate, upload.single('thumbnail'), deleteNews);

module.exports = newsRouter;