const express = require('express');
const { getStaticsByMonth, getStaticsByYear } = require('./statics.controller')
const { authenticate } = require('../../helpers/jwt_helper')

const staticsRouter = express.Router();

staticsRouter.get("/month", authenticate, getStaticsByMonth);
staticsRouter.get("/year", authenticate, getStaticsByYear);

module.exports = staticsRouter;