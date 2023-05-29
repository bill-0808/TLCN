const express = require('express');
const { createChat, getAllChat, getListUserChat } = require('./chats.controller')
const { authenticate } = require('../../helpers/jwt_helper')
// const { upload } = require('../../helpers/upload_file_helper')

const chatsRouter = express.Router();

chatsRouter.post("/", authenticate, createChat);
chatsRouter.get("/", authenticate, getAllChat);
chatsRouter.get("/userList", authenticate, getListUserChat);

module.exports = chatsRouter;