const express = require('express');
const { authenticate } = require('../../helpers/jwt_helper');
const { firstLogin } = require('./users.controller')

const userRouter = express.Router();

userRouter.post("/", authenticate, firstLogin);

module.exports = userRouter;