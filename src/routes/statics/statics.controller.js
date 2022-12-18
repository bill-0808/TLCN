const orders = require('../../models/orders.model')
const accounts = require('../../models/accounts.model')

async function getStaticsByMonth(req, res) {
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
                orders.aggregate([{
                    $group: {
                        _id: { year: { $year: "$complete_date" }, month: { $month: "$complete_date" }, day: { $dayOfMonth: "$complete_date" } },
                        total_day: { $sum: "$total" }
                    }
                }]).then(async data => {
                    result = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i]._id.month == req.body.month && data[i]._id.year == req.body.year) {
                            await result.push(data[i]);
                        }
                    }
                    return res.status(200).send({ statics: result });
                }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
            }
        }
    }
}

async function getStaticsByYear(req, res) {
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
                orders.aggregate([{
                    $group: {
                        _id: { year: { $year: "$complete_date" }, month: { $month: "$complete_date" } },
                        total_month: { $sum: "$total" }
                    }
                }]).then(async data => {
                    result = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i]._id.year == req.body.year) {
                            await result.push(data[i]);
                        }
                    }
                    return res.status(200).send({ statics: result });
                }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
            }
        }
    }
}

module.exports = {
    getStaticsByMonth,
    getStaticsByYear,
};