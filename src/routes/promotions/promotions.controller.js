const promotions = require('../../models/promotions.model')
const accounts = require('../../models/accounts.model')

async function createPromotions(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (loginUser.is_seller !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            }
            else {
                const promotion = new promotions({
                    code: req.body.code,
                    min_order: req.body.min_order,
                    discount_price: req.body.discount_price,
                    use_date_from: req.body.use_date_from,
                    use_date_to: req.body.use_date_to,
                    amount: req.body.amount
                })
                promotion.save(promotion).then(data => {
                    res.status(201).send(data);
                }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
            }
        }
    }
}

function getAllPromotions(req, res) {
    promotions.find({}, function (err, promotions) {
        if (!err) {
            let count = promotions.length;
            res.status(200).send({ count: count, promotions: promotions });
        } else {
            res.status(500).send(err);
        }
    })
}

function getOnePromotion(req, res) {
    let id = req.params.id;
    promotions.findById(id, function (err, promotions) {
        if (!err) {
            res.status(200).send({ promotion: promotions });
        } else {
            res.status(500).send(err);
        }
    })
}

async function updatePromotions(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (loginUser.is_seller !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            } else {
                let id = req.params.id;
                promotions.findByIdAndUpdate(id, {
                    code: req.body.code,
                    min_order: req.body.min_order,
                    discount_price: req.body.discount_price,
                    use_date_from: req.body.use_date_from,
                    use_date_to: req.body.use_date_to,
                    amount: req.body.amount
                })
                    .then(data => {
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

async function deletePromotions(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (loginUser.is_seller !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            } else {
                let id = req.params.id;
                promotions.findByIdAndDelete(id, function (err, promotions) {
                    if (!err) {
                        res.status(200).send({ message: "delete complete!!" });
                    } else {
                        res.status(500).send(err);
                    }
                })
            }
        }
    }
}

module.exports = {
    createPromotions,
    updatePromotions,
    deletePromotions,
    getAllPromotions,
    getOnePromotion
};