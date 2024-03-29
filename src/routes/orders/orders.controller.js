const accounts = require('../../models/accounts.model')
const carts = require('../../models/carts.model');
const products = require('../../models/products.model');
const orderDetails = require('../../models/orderDetails.model');
const { doesProductInCart } = require('../../helpers/cart_util')
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const orders = require('../../models/orders.model');
const promotions = require('../../models/promotions.model');
const usersModel = require('../../models/users.model');

async function createOrder(req, res) {
    //Request missing body
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        //Request missing header Authorization
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        //Remove item in cart if exist and create order
        let loginUser = await accounts.findOne({ _id: req.user._id })
        let id = new mongoose.Types.ObjectId();
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts = { session };
            for (let i = 0; i < req.body.items.length; i++) {
                let checkExist = await doesProductInCart(req.body.items[i].product_id, loginUser._id, req.body.items[i].size);
                if (req.body.is_fast_buy != true) {
                    if (checkExist) {
                        await orderDetails({
                            product_id: req.body.items[i].product_id,
                            quantity: req.body.items[i].quantity,
                            size: req.body.items[i].size,
                            order_id: id,
                            status: 1
                        }).save(opts);
                        await carts.findOneAndDelete({ product_id: ObjectId(req.body.items[i].product_id), size: req.body.items[i].size, account_id: loginUser._id }, opts)
                    } else {
                        await session.abortTransaction();
                        session.endSession();
                        res.status(500).send({ message: `product ${req.body.items[i].product_id} is not in cart` });
                        return;
                    }
                } else {
                    await orderDetails({
                        product_id: req.body.items[i].product_id,
                        quantity: req.body.items[i].quantity,
                        size: req.body.items[i].size,
                        order_id: id,
                        status: 1
                    }).save(opts);
                }
                let product = await products.findOne({ _id: ObjectId(req.body.items[i].product_id) });
                if (parseInt(product.size[req.body.items[i].size]) >= parseInt(req.body.items[i].quantity)) {
                    let sizeBody = await product.size;
                    sizeBody[req.body.items[i].size] -= await req.body.items[i].quantity
                    await products.findByIdAndUpdate(ObjectId(req.body.items[i].product_id), { size: sizeBody })
                } else {
                    await session.abortTransaction();
                    session.endSession();
                    res.status(500).send({ message: `product ${req.body.items[i].product_id} is out of stock` });
                    return;
                }
            }
            if (req.body.promotion_id) {
                const order = await orders({
                    _id: id,
                    total: req.body.total,
                    status: 1,
                    ship_id: ObjectId(req.body.ship_id),
                    payment_method: 1,
                    complete_date: null,
                    account_id: ObjectId(loginUser._id),
                    promotion_id: ObjectId(req.body.promotion_id),
                    location: req.body.location,
                    receiver_name: req.body.receiver_name,
                    receiver_phone: req.body.receiver_phone
                }).save(opts);
                await promotions.findByIdAndUpdate(req.body.promotion_id, { $inc: { amount: -1 } })
            } else {
                const order = await orders({
                    _id: id,
                    total: req.body.total,
                    status: 1,
                    ship_id: ObjectId(req.body.ship_id),
                    payment_method: 1,
                    complete_date: null,
                    account_id: ObjectId(loginUser._id),
                    promotion_id: null,
                    location: req.body.location,
                    receiver_name: req.body.receiver_name,
                    receiver_phone: req.body.receiver_phone
                }).save(opts);
            }
            await session.commitTransaction();
            session.endSession();
            res.status(200).send({ message: "Order created" })
        } catch (error) {
            // If an error occurred, abort the whole transaction and
            // undo any changes that might have happened
            await session.abortTransaction();
            session.endSession();
            res.status(500).send(error);
        }
    }
}

async function updateOrderStatus(req, res) {
    //Request missing body
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        //Request missing header Authorization
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        // let loginUser = await accounts.findOne({ _id: req.user._id })
        //Update order status
        let id = await req.params.id;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts = { session };
            const order = await orders.findByIdAndUpdate(id, { $inc: { status: 1 } }, { opts });
            if (order.status == 2) {
                await orders.findByIdAndUpdate(id, { complete_date: new Date() }, { opts });
            }
            await session.commitTransaction();
            session.endSession();
            res.status(200).send({ message: "Order updated" })
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).send(err);
        }
    }
}

async function deleteOrder(req, res) {
    //Request missing body
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        //Request missing header Authorization
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        // let loginUser = await accounts.findOne({ _id: req.user._id });
        //Update order status to deleted
        let id = await req.params.id;

        const order = await orders.findByIdAndUpdate(id, { status: 500 }).then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found!!" });
            } else {
                res.status(200).send({ message: "Order updated" });
            }
        }).catch(err => {
            res.status(500).send(err);
        });
    }
}

async function getAllOrder(req, res) {
    //Request missing body
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        //Request missing header Authorization
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        //Get all order by search condition
        let dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null;
        let dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null;
        let search = req.query.search;
        let rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        let searchRgx = await rgx(search);
        let dateFilter = {};
        if (search) {
            dateFilter.receiver_name = { $regex: searchRgx, $options: 'i' };
        }
        if (dateFrom && dateTo) {
            dateFilter.created_at = {
                $gte: dateFrom,
                $lte: dateTo
            }
        }
        orders.find(dateFilter, function (err, orders) {
            if (!err) {
                let count = orders.length;
                res.status(200).send({ count: count, orders: orders });
            } else {
                res.status(500).send(err);
            }
        })
    }
}

async function getOrderByUser(req, res) {
    //Request missing body
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        //Request missing header Authorization
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        //Get all order of user
        let loginUser = await accounts.findOne({ _id: req.user._id })
        let orderList = [];
        let dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null;
        let dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null;
        let dateFilter = {
            account_id: ObjectId(loginUser._id)
        };
        if (dateFrom && dateTo) {
            dateFilter.created_at = {
                $gte: dateFrom,
                $lte: dateTo
            }
        }
        orders.find(dateFilter, null, { sort: { created_at: -1 } }, async function (err, orders) {
            if (!err) {
                let count = orders.length;
                for (let i = 0; i < count; i++) {
                    let listProductInOrder = [];
                    let orderDetail = await orderDetails.find({ order_id: ObjectId(orders[i]._id) });
                    for (let j = 0; j < orderDetail.length; j++) {
                        let product = await products.findById(orderDetail[j].product_id);
                        let orderDetailResult = await { status: orderDetail[j].status, quantity: orderDetail[j].quantity, id: orderDetail[j]._id, size: orderDetail[j].size, product: product };
                        await listProductInOrder.push(orderDetailResult);
                    }
                    let orderInList = await { orderId: orders[i]._id, orderStatus: orders[i].status, orderCreateDay: orders[i].created_at, orderTotal: orders[i].total, orderDetail: listProductInOrder }
                    await orderList.push(orderInList);
                }
                res.status(200).send({ count: count, orders: orderList });
            } else {
                res.status(500).send(err);
            }
        })
    }
}

async function getOneOrder(req, res) {
    //Request missing body
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        //Request missing header Authorization
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        //Get order by id
        let id = await req.params.id;
        orders.findById(id, async function (err, orders) {
            if (!err) {
                let productInOrder = [];
                let orderDetail = await orderDetails.find({ order_id: ObjectId(orders._id) });
                for (let i = 0; i < orderDetail.length; i++) {
                    let product = await products.findById(orderDetail[i].product_id);
                    let orderDetailResult = await { status: orderDetail[i].status, quantity: orderDetail[i].quantity, id: orderDetail[i]._id, size: orderDetail[i].size, product: product };
                    await productInOrder.push(orderDetailResult);
                }
                let count = orderDetail.length;
                res.status(200).send({ count: count, order: orders, orderDetail: productInOrder });
            } else {
                res.status(500).send(err);
            }
        })
    }
}

module.exports = {
    createOrder,
    updateOrderStatus,
    getAllOrder,
    getOneOrder,
    getOrderByUser,
    deleteOrder
};