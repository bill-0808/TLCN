const accounts = require('../../models/accounts.model')
// const { cloudinary, options } = require('../../helpers/cloudinary_helper');
const chatsModel = require('../../models/chats.model');
const { ObjectId } = require('mongodb');

async function createChat(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (!req.body) {
            res.status(500).send({ message: "Missing body!" });
            return;
        }
        else {
            const achat = new chatsModel({
                sender_id: ObjectId(loginUser._id),
                receiver_id: ObjectId(req.body.receiver_id),
                message: req.body.message,
                is_read: false
            })
            achat.save(achat).then(data => {
                res.status(201).send(data);
            }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
        }
    }
}

async function getAllChat(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id });
        if (loginUser.is_seller) {
            let condition = [{ sender_id: ObjectId(req.query.user_id) }, { receiver_id: ObjectId(loginUser._id) }]
            chatsModel.find({ $or: condition, $sort: { created_at: -1 } }, function (err, chats) {
                if (!err) {
                    res.status(200).send({ chats: chats });
                } else {
                    res.status(500).send(err);
                }
            })
        } else {
            let condition = [{ sender_id: ObjectId(loginUser._id) }, { receiver_id: ObjectId(req.query.user_id) }]
            chatsModel.find({ $or: condition, $sort: { created_at: -1 } }, function (err, chats) {
                if (!err) {
                    res.status(200).send({ chats: chats });
                } else {
                    res.status(500).send(err);
                }
            })
        }
    }
}

async function getListUserChat(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id });
        if (loginUser.is_seller) {
            chatsModel.find({ receiver_id: ObjectId(loginUser._id) }, async function (err, chats) {
                if (!err) {
                    let listUser = new Set();
                    for (let i = 0; i < chats.length; i++) {
                        listUser.add(chats[i].sender_id.toString());
                    }
                    listUser = Array.from(listUser);
                    res.status(200).send({ users: listUser });
                } else {
                    res.status(500).send(err);
                }
            })
        } else {
            res.status(401).send({ message: "Unauthorized!!" })
        }
    }
}

module.exports = {
    getListUserChat,
    getAllChat,
    createChat,
};