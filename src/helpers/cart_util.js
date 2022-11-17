const carts = require('../models/carts.model');

function doesProductInCart(productId, userId, size) {
    const cart = carts.find({ user_id: userId });
    for (let i = 0; i < cart.length; i++) {
        if (cart.product_id == productId && cart.size == size && cart.status == 1) {
            return true;
        }
    }
    return false;
}

module.exports = { doesProductInCart }