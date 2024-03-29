const orders = require('../../models/orders.model')
const accounts = require('../../models/accounts.model')

async function getStaticsByMonth(req, res) {
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        //Check if user have permission
        if (loginUser.is_seller !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            //Request missing body
            if (!req.query) {
                res.status(500).send({ message: "Missing body!" });
                return;
            } else {
                //get static by month
                orders.aggregate([{
                    $group: {
                        _id: { year: { $year: "$complete_date" }, month: { $month: "$complete_date" }, day: { $dayOfMonth: "$complete_date" } },
                        total_day: { $sum: "$total" }
                    }
                }]).then(async data => {
                    result = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i]._id.month == req.query.month && data[i]._id.year == req.query.year) {
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
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        //Check if user have permission
        if (loginUser.is_seller !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            //Request missing body
            if (!req.query) {
                res.status(500).send({ message: "Missing body!" });
                return;
            } else {
                //get static by year
                orders.aggregate([{
                    $group: {
                        _id: { year: { $year: "$complete_date" }, month: { $month: "$complete_date" } },
                        total_month: { $sum: "$total" }
                    }
                }]).then(async data => {
                    result = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i]._id.year == req.query.year) {
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