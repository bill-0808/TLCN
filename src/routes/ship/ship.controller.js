const ships = require('../../models/ship.model')
const accounts = require('../../models/accounts.model')

async function createShips(req, res) {
    //Check if user have permission
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
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            }
            else {
                //create ship
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
    //get all ship
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
    //get ship by id
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
    //Request missing header Authorization
    if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id, is_active: true })
        //Check if user have permission
        if (loginUser.is_seller !== true) {
            res.status(401).send({ message: "Unauthorized!!" })
        } else {
            //Request missing body
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            } else {
                //get ship by id
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
            if (!req.body) {
                res.status(500).send({ message: "Missing body!" });
                return;
            } else {
                //delete ship
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