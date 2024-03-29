const users = require('../../models/users.model')
const accounts = require('../../models/accounts.model')
const mongoose = require('mongoose');
const { cloudinary, options } = require('../../helpers/cloudinary_helper');

async function firstLogin(req, res) {
    //Request missing body
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
        //Request missing header Authorization
    } else if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        //create user info 1st time login
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (loginUser.user_id !== null) {
            res.status(500).send({ message: "User infomation alr registed" });
        } else {
            let id = new mongoose.Types.ObjectId();
            if (req.file) {
                let avtUrl;
                await cloudinary.uploader.upload(req.file.path, options).then(result => {
                    avtUrl = result.secure_url
                }).catch(err => {
                    console.log(err);
                })

                const session = await mongoose.startSession();
                session.startTransaction();
                try {
                    const opts = { session };
                    const account = await accounts.findByIdAndUpdate(loginUser._id, { user_id: id }, opts);
                    const user = await users({
                        _id: id,
                        name: req.body.name,
                        age: req.body.age,
                        gender: req.body.gender,
                        address: req.body.address,
                        phone: req.body.phone,
                        avatar: avtUrl
                    }).save(opts);

                    await session.commitTransaction();
                    session.endSession();
                    res.status(200).send({ user: user })
                } catch (error) {
                    // If an error occurred, abort the whole transaction and
                    // undo any changes that might have happened
                    await session.abortTransaction();
                    session.endSession();
                    res.status(500).send(error);
                }
            } else {
                const session = await mongoose.startSession();
                session.startTransaction();
                try {
                    const opts = { session };
                    const account = await accounts.findByIdAndUpdate(loginUser._id, { user_id: id }, opts);
                    const user = await users({
                        _id: id,
                        name: req.body.name,
                        age: req.body.age,
                        gender: req.body.gender,
                        address: req.body.address,
                        phone: req.body.phone,
                        avatar: null
                    }).save(opts);

                    await session.commitTransaction();
                    session.endSession();
                    res.status(200).send({ user: user })
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
}

async function getUser(req, res) {
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        //get user info
        let loginUser = await accounts.findOne({ _id: req.user, is_active: true });
        let id = await loginUser.user_id;
        users.findById(id, function (err, users) {
            if (!err) {
                res.status(200).send({ user: users });
            } else {
                res.status(500).send(err);
            }
        })
    }
}

async function getAllAccount(req, res) {
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id, is_active: true })
        //Check if user have permission
        if (loginUser.is_admin !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            //Get all login account
            accounts.find({}, function (err, accounts) {
                if (!err) {
                    res.status(200).send({ account: accounts });
                } else {
                    res.status(500).send(err);
                }
            })
        }
    }
}

async function deleteAccount(req, res) {
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        //Check if user have permission
        if (loginUser.is_admin !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            //Request missing body
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            } else {
                //soft delete user
                let id = req.params.id;
                accounts.findByIdAndUpdate(id, { is_active: false }, function (err, products) {
                    if (!err && products) {
                        res.status(200).send({ message: "delete complete!!" });
                    } else {
                        res.status(500).send(err);
                    }
                })
            }
        }
    }
}

async function updateUser(req, res) {
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        //Request missing body
        if (!req.body) {
            res.status(500).send({ message: "Missing body!" });
            return;
        } else {
            //update user info
            let loginUser = await accounts.findOne({ _id: req.user, is_active: true });
            let id = await loginUser.user_id;
            if (req.file) {
                cloudinary.uploader.upload(req.file.path, options)
                    .then(result => {
                        users.findByIdAndUpdate(id, {
                            name: req.body.name,
                            age: req.body.age,
                            gender: req.body.gender,
                            address: req.body.address,
                            phone: req.body.phone,
                            avatar: result.secure_url
                        }).then(data => {
                            if (!data) {
                                res.status(404).send({ message: "Not found!!" });
                            } else {
                                res.status(200).send({ message: "Updated!!" });
                            }
                        }).catch(err => {
                            res.status(500).send(err);
                        })
                    })
            } else {
                users.findByIdAndUpdate(id, {
                    name: req.body.name,
                    age: req.body.age,
                    gender: req.body.gender,
                    address: req.body.address,
                    phone: req.body.phone,
                }).then(data => {
                    if (!data) {
                        res.status(404).send({ message: "Not found!!" });
                    } else {
                        res.status(200).send({ message: "Updated!!" });
                    }
                }).catch(err => {
                    res.status(500).send(err);
                })
            }
        }
    }
}

async function searchAccount(req, res) {
    //get account by search condition
    let search = req.query.search;
    let rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    let searchRgx = await rgx(search);
    accounts.find({ email: { $regex: searchRgx, $options: 'i' }, is_active: true })
        .then(accounts => {
            if (accounts) {
                res.status(200).send({ accounts: accounts })
            } else {
                res.status(500).send({ message: "Not found!!" })
            }
        })

}

module.exports = {
    firstLogin,
    getUser,
    updateUser,
    getAllAccount,
    deleteAccount,
    searchAccount
};