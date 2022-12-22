const { cloudinary, options } = require('../../helpers/cloudinary_helper');
const ratings = require('../../models/ratings.model');
const accounts = require('../../models/accounts.model');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const orders = require('../../models/orders.model');
const orderDetails = require('../../models/orderDetails.model');
const users = require('../../models/users.model');

async function createRatings(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        let loginUserInfo = await users.findOne({ _id: loginUser.user_id })
        if (!req.body) {
            res.status(500).send({ message: "Missing body!" });
            return;
        }
        else {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const opts = { session };
                let order = await orders.findOne({ user_id: ObjectId(loginUser._id), status: 3 });
                let orderDetail = await orderDetails.findOne({ _id: ObjectId(req.body.order_detail_id), product_id: ObjectId(req.body.product_id) })
                if (!order || !orderDetail) {
                    await session.abortTransaction();
                    session.endSession();
                    res.status(500).send({ message: "Not found in order" });
                    return
                } else {
                    await orderDetails.findOneAndUpdate({ _id: ObjectId(req.body.order_detail_id), product_id: ObjectId(req.body.product_id) }, { status: 2 }, { opts })
                }
                if (req.files) {
                    let image = [];
                    for (let i = 0; i < req.files.length; i++) {
                        await cloudinary.uploader.upload(req.files[i].path, options).then(result => {
                            image.push(result.secure_url);
                        }).catch(err => {
                            console.log(err);
                        })
                    }

                    await ratings({
                        product_id: ObjectId(req.body.product_id),
                        image: image,
                        comment: req.body.comment,
                        rate: req.body.rate,
                        user_id: ObjectId(loginUserInfo._id),
                        order_detail_id: ObjectId(req.body.order_detail_id)
                    }).save(opts);
                }
                else {
                    await ratings({
                        product_id: ObjectId(req.body.product_id),
                        image: null,
                        comment: req.body.comment,
                        rate: req.body.rate,
                        user_id: ObjectId(loginUserInfo._id),
                        order_detail_id: ObjectId(req.body.order_detail_id)
                    }).save(opts);
                }
                await session.commitTransaction();
                session.endSession();
                res.status(200).send({ message: "rating created" })
            } catch (error) {
                // If an error occurred, abort the whole transaction and
                // undo any changes that might have happened
                await session.abortTransaction();
                session.endSession();
                res.status(500).send(error);
            }
        }
    }
}

async function updateRatings(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        let loginUserInfo = await users.findOne({ _id: loginUser.user_id })
        if (!req.body) {
            res.status(500).send({ message: "Missing body!" });
            return;
        }
        else {
            let order = await orders.findOne({ user_id: ObjectId(loginUser._id), status: 3 });
            let orderDetail = await orderDetails.findOne({ _id: ObjectId(req.body.order_detail_id), product_id: ObjectId(req.body.product_id) })
            if (!order || !orderDetail) {
                res.status(500).send({ message: "Not found in order" });
                return
            } else {
                if (req.files) {
                    let image = [];
                    for (let i = 0; i < req.files.length; i++) {
                        await cloudinary.uploader.upload(req.files[i].path, options).then(result => {
                            image.push(result.secure_url);
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                    await ratings.findOneAndUpdate({
                        order_detail_id: ObjectId(req.body.order_detail_id),
                        product_id: ObjectId(req.body.product_id)
                    }, {
                        image: image,
                        comment: req.body.comment,
                        rate: req.body.rate
                    }).then(rating => {
                        if (rating) {
                            res.status(200).send({ ratings: rating })
                            return;
                        } else {
                            res.status(500).send({ message: "update fail" })
                            return;
                        }
                    })
                }
                else {
                    await ratings.findOneAndUpdate({
                        order_detail_id: ObjectId(req.body.order_detail_id),
                        product_id: ObjectId(req.body.product_id)
                    }, {
                        comment: req.body.comment,
                        rate: req.body.rate
                    }).then(rating => {
                        if (rating) {
                            res.status(200).send({ ratings: rating })
                            return;
                        } else {
                            res.status(500).send({ message: "update fail" })
                            return;
                        }
                    })
                }
            }
        }
    }
}

async function getOneRate(req, res) {
    let order_detail_id = req.params.order_detail_id;
    let product_id = req.params.product_id;
    ratings.findOne({
        order_detail_id: ObjectId(order_detail_id),
        product_id: ObjectId(product_id)
    }, function (err, ratings) {
        if (!err) {
            res.status(200).send({ ratings: ratings });
        } else {
            res.status(500).send(err);
        }
    })
}

module.exports = {
    createRatings,
    updateRatings,
    getOneRate
};