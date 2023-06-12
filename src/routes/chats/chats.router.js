const express = require('express');
const { createChat, getAllChat, getListUserChat, IsAdminChat } = require('./chats.controller')
const { authenticate } = require('../../helpers/jwt_helper')
// const { upload } = require('../../helpers/upload_file_helper')

const chatsRouter = express.Router();

chatsRouter.post("/", authenticate, upload.any('image'), createChat);
chatsRouter.get("/", authenticate, getAllChat);
chatsRouter.get("/userList", authenticate, getListUserChat);
chatsRouter.get("/isRead", authenticate, IsAdminChat);

module.exports = chatsRouter;