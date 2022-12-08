const express = require('express');
const { createPromotions, getAllPromotions, updatePromotions, deletePromotions, getOnePromotion } = require('./promotions.controller')
const { authenticate } = require('../../helpers/jwt_helper')

const promotionsRouter = express.Router();

promotionsRouter.post("/", authenticate, createPromotions);
promotionsRouter.get("/", getAllPromotions);
promotionsRouter.get("/:id", getOnePromotion);
promotionsRouter.put("/:id", authenticate, updatePromotions);
promotionsRouter.delete("/:id", authenticate, deletePromotions);

module.exports = promotionsRouter;