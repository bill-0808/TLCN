const express = require('express');
const { register, login } = require('./login.controller')

const loginRouter = express.Router();

loginRouter.post("/", login);
loginRouter.post("/register", register);

module.exports = loginRouter;