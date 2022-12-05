const express = require('express');
const { authenticate } = require('../../helpers/jwt_helper');
const { firstLogin, getUser, updateUser } = require('./users.controller')
const { upload } = require('../../helpers/upload_file_helper')

const userRouter = express.Router();

userRouter.post("/", authenticate, upload.single('avatar'), firstLogin);
userRouter.get("/", authenticate, getUser);
userRouter.put("/", authenticate, upload.single('avatar'), updateUser);

module.exports = userRouter;