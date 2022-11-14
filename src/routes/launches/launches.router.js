const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller')

const planetRouter = express.Router();

planetRouter.get("/", httpGetAllLaunches);
planetRouter.post("/", httpAddNewLaunch);
planetRouter.delete("/:id", httpAbortLaunch);

module.exports = planetRouter;