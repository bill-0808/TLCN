const express = require('express');
const { createShips, getAllShips, updateShips, deleteShips } = require('./ship.controller')
const { authenticate } = require('../../helpers/jwt_helper')

const shipsRouter = express.Router();

shipsRouter.post("/", authenticate, createShips);
shipsRouter.get("/", getAllShips);
shipsRouter.put("/:id", authenticate, updateShips);
shipsRouter.delete("/:id", authenticate, deleteShips);

module.exports = shipsRouter;