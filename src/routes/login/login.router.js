const express = require('express');
const { register } = require('./login.controller')

const loginRouter = express.Router();

loginRouter.post("/register", register);

module.exports = loginRouter;