const ships = require('../../models/ship.model')
const accounts = require('../../models/accounts.model')

async function createShips(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (loginUser.is_admin !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            }
            else {
                const ship = new ships({
                    type: req.body.type,
                    price: req.body.price,
                    description: req.body.description
                })
                ship.save(ship).then(data => {
                    res.status(201).send(data);
                }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
            }
        }
    }
}

function getAllShips(req, res) {
    ships.find({}, function (err, ships) {
        if (!err) {
            let count = ships.length;
            res.status(200).send({ count: count, ships: ships });
        } else {
            res.status(500).send(err);
        }
    })
}

function getOneShip(req, res) {
    let id = req.params.id;
    ships.findById(id, function (err, ships) {
        if (!err) {
            res.status(200).send({ ship: ships });
        } else {
            res.status(500).send(err);
        }
    })
}

async function updateShips(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id, is_active: true })
        if (loginUser.is_admin !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            } else {
                let id = req.params.id;
                ships.findByIdAndUpdate(id, {
                    type: req.body.type,
                    price: req.body.price,
                    description: req.body.description
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

async function deleteShips(req, res) {
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (loginUser.is_admin !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            } else {
                let id = req.params.id;
                ships.findByIdAndDelete(id, function (err, ships) {
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
    createShips,
    updateShips,
    deleteShips,
    getAllShips,
    getOneShip
};