const accounts = require('../../models/accounts.model')
const carts = require('../../models/carts.model');
const products = require('../../models/products.model');
const { doesProductInCart } = require('../../helpers/cart_util')
const { ObjectId } = require('mongodb');

async function addToCart(req, res) {
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id, is_active: true })
        let checkExist = await doesProductInCart(req.body.product_id, loginUser._id, req.body.size);
        if (checkExist) {
            if (checkExist == 1 && req.body.quantity == -1) {
                carts.findOneAndDelete({ product_id: ObjectId(req.body.product_id), size: req.body.size, account_id: loginUser._id })
                    .then(data => {
                        if (!data) {
                            res.status(404).send({ message: "Not found!!" });
                        } else {
                            res.status(200).send({ message: "remove from cart success!!" });
                        }
                    }).catch(err => {
                        res.status(500).send(err);
                    })
            } else {
                carts.findOneAndUpdate({ product_id: ObjectId(req.body.product_id), size: req.body.size, account_id: loginUser._id }, { $inc: { quantity: req.body.quantity } })
                    .then(data => {
                        if (!data) {
                            res.status(404).send({ message: "Not found!!" });
                        } else {
                            res.status(200).send({ message: "Add to cart success!!" });
                        }
                    }).catch(err => {
                        res.status(500).send(err);
                    })
            }
        } else {
            const cart = new carts({
                product_id: ObjectId(req.body.product_id),
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

async function getAllCart(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id, is_active: true })
        let cartResult = [];
        const cartItems = await carts.find({ account_id: loginUser._id })
        for (let i = 0; i < cartItems.length; i++) {
            let product = await products.findOne({ _id: cartItems[i].product_id });
            let cartItem = await {
                product: product,
                quantity: cartItems[i].quantity,
                status: cartItems[i].status,
                size: cartItems[i].size,
            }
            cartResult.push(cartItem);
        }
        res.status(200).send({ count: cartItems.length, cartItems: cartResult });
        return;
    }
}

async function removeFromCart(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        let checkExist = await doesProductInCart(req.body.product_id, loginUser._id, req.body.size);
        if (!checkExist) {
            res.status(404).send({ message: "product not exist" });
        } else {
            carts.findOneAndDelete({ product_id: ObjectId(req.body.product_id), size: req.body.size, account_id: loginUser._id })
                .then(data => {
                    if (!data) {
                        res.status(404).send({ message: "Not found!!" });
                    } else {
                        res.status(200).send({ message: "remove from cart success!!" });
                    }
                }).catch(err => {
                    res.status(500).send(err);
                })
        }
    }
}

module.exports = {
    addToCart,
    getAllCart,
    removeFromCart,
};