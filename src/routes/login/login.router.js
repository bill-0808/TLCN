const express = require('express');
const { register, login, verify } = require('./login.controller')

const loginRouter = express.Router();

loginRouter.post("/", login);
loginRouter.post("/register", register);
loginRouter.get("/verify/:id", verify)

module.exports = loginRouter;