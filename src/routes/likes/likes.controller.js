const likes = require('../../models/likes.model')
const accounts = require('../../models/accounts.model')
const { ObjectId } = require('mongodb');

async function addToLikeList(req, res) {
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
            let isUserLike = await likes.findOne({ product_id: ObjectId(req.body.product_id), account_id: ObjectId(loginUser._id) });
            if (!isUserLike) {
                const like = new likes({
                    product_id: ObjectId(req.body.product_id),
                    account_id: ObjectId(loginUser._id)
                })
                like.save(like).then(data => {
                    res.status(201).send(data);
                }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
            } else {
                res.status(500).send({message: "Product already in list"});
            }
        }
    }
}

async function getLikeList(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        likes.find({ account_id: ObjectId(loginUser._id) }, function (err, likes) {
            if (!err) {
                let count = likes.length;
                res.status(200).send({ count: count, likes: likes });
            } else {
                res.status(500).send(err);
            }
        })
    }
}

async function removeFromLikeList(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (!req.body) {
            res.status(500).send({ message: "Missing body!" });
            return;
        } else {
            let id = req.body.product_id;
            likes.findOneAndDelete({ product_id: ObjectId(id), account_id: ObjectId(loginUser._id) }, function (err, likes) {
                if (!err) {
                    res.status(200).send({ message: "delete complete!!" });
                } else {
                    res.status(500).send(err);
                }
            })
        }
    }
}

module.exports = {
    addToLikeList,
    removeFromLikeList,
    getLikeList
};