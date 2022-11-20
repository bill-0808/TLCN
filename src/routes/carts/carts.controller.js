const accounts = require('../../models/accounts.model')
const mongoose = require('mongoose');
const carts = require('../../models/carts.model');
const { doesProductInCart } = require('../../helpers/cart_util')

async function addToCart(req, res) {
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        let userCart = await carts.find({ account_id: loginUser._id })
        if (doesProductInCart(req.body.product_id, loginUser._id, req.body.size)) {
            carts.findOneAndUpdate({ product_id: req.body.product_id, size: req.body.size }, { $inc: { quantity: req.body.quantity } })
                .then(data => {
                    if (!data) {
                        res.status(404).send({ message: "Not found!!" });
                    } else {
                        res.status(200).send({ message: "Add to cart success!!" });
                    }
                }).catch(err => {
                    res.status(500).send(err);
                })
        } else {
            const cart = new carts({
                product_id: req.body.product_id,
                account_id: loginUser._id,
                quantity: req.body.quantity,
                status: 1,
                size: req.body.size,
            })
            cart.save(cart).then(data => {
                res.status(201).send(data);
            }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
        }
    }
}


module.exports = {
    addToCart,
};