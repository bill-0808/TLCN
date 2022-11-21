const carts = require('../models/carts.model');

async function doesProductInCart(productId, userId, size) {
    const cart = await carts.find({ user_id: userId });
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].product_id == productId && cart[i].size == size && cart[i].status == 1) {
            return cart[i].quantity;
        }
    }
    return false;
}

module.exports = { doesProductInCart }