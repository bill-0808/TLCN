const accounts = require('../../models/accounts.model')
const { cloudinary, options } = require('../../helpers/cloudinary_helper');
const chatsModel = require('../../models/chats.model');
const usersModel = require('../../models/users.model');
const { ObjectId } = require('mongodb');

async function createChat(req, res) {
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        //Request missing body
        if (!req.body) {
            res.status(500).send({ message: "Missing body!" });
            return;
        }
        else {
            let isSeller;
            //detect who send message
            if (loginUser.is_seller) {
                isSeller = true;
            } else {
                isSeller = false;
            }
            //upload image to cloudinary
            let thumbnail = [];
            if (req.files.length != 0) {
                for (let i = 0; i < req.files.length; i++) {
                    await cloudinary.uploader.upload(req.files[i].path, options).then(result => {
                        thumbnail.push(result.secure_url);
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
            //create chat
            if (isSeller) {
                let user = await usersModel.findOne({ _id: req.body.user_id })
                let account = await accounts.findOne({ user_id: user._id });
                const achat = new chatsModel({
                    user_id: ObjectId(user._id),
                    account_id: ObjectId(account._id),
                    is_admin: isSeller,
                    message: req.body.message,
                    is_read: true,
                    is_user_read: false,
                    image: thumbnail ? thumbnail : []
                })
                achat.save(achat).then(data => {
                    res.status(201).send(data);
                }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
            } else {
                let user = await usersModel.findOne({ _id: loginUser.user_id });
                let thumbnail = [];
                if (req.files.length != 0) {
                    for (let i = 0; i < req.files.length; i++) {
                        await cloudinary.uploader.upload(req.files[i].path, options).then(result => {
                            thumbnail.push(result.secure_url);
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                }
                const achat = new chatsModel({
                    user_id: ObjectId(user._id),
                    account_id: ObjectId(loginUser._id),
                    is_admin: isSeller,
                    message: req.body.message,
                    is_read: false,
                    is_user_read: true,
                    image: thumbnail ? thumbnail : []
                })
                achat.save(achat).then(data => {
                    res.status(201).send(data);
                }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
            }
        }
    }
}

async function getAllChat(req, res) {
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id });
        //Get chat and update is read flag
        if (loginUser.is_seller) {
            chatsModel.updateMany({ user_id: ObjectId(req.query.user_id), $sort: { created_at: -1 } }, { is_read: true }, function (err, chats) {
                if (!err) {
                    return chatsModel.find({ user_id: ObjectId(req.query.user_id), $sort: { created_at: -1 } }, function (err, chats) {
                        if (!err) {
                            res.status(200).send({ chats: chats });
                        } else {
                            res.status(500).send(err);
                        }
                    });
                } else {
                    res.status(500).send(err);
                }
            })
        } else {
            chatsModel.updateMany({ account_id: ObjectId(loginUser._id), $sort: { created_at: -1 } }, { is_user_read: true }, function (err, chats) {
                if (!err) {
                    return chatsModel.find({ account_id: ObjectId(loginUser._id), $sort: { created_at: -1 } }, function (err, chats) {
                        if (!err) {
                            res.status(200).send({ chats: chats });
                        } else {
                            res.status(500).send(err);
                        }
                    });
                } else {
                    res.status(500).send(err);
                }
            })
        }
    }
}

async function getListUserChat(req, res) {
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id });
        //get list user who chat with shop
        if (loginUser.is_seller) {
            chatsModel.find({}, async function (err, chats) {
                if (!err) {
                    let listUser = new Set();
                    let users = [];
                    let isRead = [];
                    let tempUser = {};
                    let userId = [];
                    let user;
                    for (let i = 0; i < chats.length; i++) {
                        listUser.add(chats[i].account_id.toString());
                    }
                    listUser = Array.from(listUser);
                    for (let i = 0; i < listUser.length; i++) {
                        let account = await accounts.findOne({ _id: listUser[i] });
                        let tempUser = await usersModel.findOne({ _id: account.user_id });
                        userId.push(tempUser);
                    }
                    for (let j = 0; j < chats.length; j++) {
                        if (chats[j].is_read == false) {
                            let tempIsRead = {};
                            tempIsRead.is_read = false;
                            tempIsRead.user = chats[j].account_id;
                            isRead.push(tempIsRead);
                        }
                    }
                    isRead = [...new Set(isRead.map(JSON.stringify))].map(JSON.parse);

                    for (let i = 0; i < isRead.length; i++) {
                        let account = await accounts.findOne({ _id: isRead[i].user });
                        tempUser = await usersModel.findOne({ _id: account.user_id });
                        tempUser.is_read = false;
                        user = { tempUser: tempUser, is_read: false }
                        users.push(user);
                    }
                    res.status(200).send({ users: userId, is_read: users });
                } else {
                    res.status(500).send(err);
                }
            })
        } else {
            res.status(401).send({ message: "Unauthorized!!" })
        }
    }
}

async function IsAdminChat(req, res) {
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        //check if admin read chat
        let loginUser = await accounts.findOne({ _id: req.user._id });
        chatsModel.find({ account_id: ObjectId(loginUser._id), is_user_read: false, $sort: { created_at: -1 } }, function (err, chats) {
            if (!err) {
                let is_read;
                if (chats.length > 0) {
                    is_read = false;
                } else {
                    is_read = true;
                }
                res.status(200).send({ is_read: is_read });
            } else {
                res.status(500).send(err);
            }
        });
    }
}

module.exports = {
    getListUserChat,
    getAllChat,
    createChat,
    IsAdminChat,
};