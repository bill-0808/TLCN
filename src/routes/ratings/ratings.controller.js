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
                let orderDetail = await orderDetails.findOne({ order_id: ObjectId(order._id), product_id: ObjectId(req.body.product_id) })
                if (!order || !orderDetail) {
                    await session.abortTransaction();
                    session.endSession();
                    res.status(500).send({ message: "Not found in order" });
                    return
                } else {
                    await orderDetails.findOneAndUpdate({ order_id: ObjectId(order._id), product_id: ObjectId(req.body.product_id) }, { status: 2 }, { opts })
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
                    }).save(opts);
                }
                else {
                    await ratings({
                        product_id: ObjectId(req.body.product_id),
                        image: null,
                        comment: req.body.comment,
                        rate: req.body.rate,
                        user_id: ObjectId(loginUserInfo._id),
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

module.exports = {
    createRatings,
};