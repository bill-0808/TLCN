const express = require('express');
const { addToLikeList, removeFromLikeList, getLikeList } = require('./likes.controller')
const { authenticate } = require('../../helpers/jwt_helper')

const likesRounter = express.Router();

likesRounter.post("/", authenticate, addToLikeList);
likesRounter.delete("/:product_id", authenticate, removeFromLikeList);
likesRounter.get("/", authenticate, getLikeList);

module.exports = likesRounter;