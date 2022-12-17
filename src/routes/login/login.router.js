const express = require('express');
const { register, login, verify, resetPassword, verifyResetPassword } = require('./login.controller')

const loginRouter = express.Router();

loginRouter.post("/", login);
loginRouter.post("/register", register);
loginRouter.post("/verify/:id", verify);
loginRouter.post("/resetPassword", resetPassword);
loginRouter.post("/resetPassword/verify/", verifyResetPassword);

module.exports = loginRouter;