const brands = require('../../models/brands.model')
const accounts = require('../../models/accounts.model')

async function createBrands(req, res) {
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
            }
            else {
                const brand = new brands({
                    name: req.body.name,
                })
                brand.save(brand).then(data => {
                    res.status(201).send(data);
                }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
            }
        }
    }
}


function getAllBrands(req, res) {
    brands.find({}, function (err, brands) {
        if (!err) {
            let count = brands.length;
            res.status(200).send({ count: count, brands: brands });
        } else {
            res.status(500).send(err);
        }
    })
}

async function updateBrands(req, res) {
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
                brands.findByIdAndUpdate(id, { name: req.body.name })
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


async function deleteBrands(req, res) {
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
                brands.findByIdAndDelete(id, function (err, brands) {
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
    createBrands,
    updateBrands,
    deleteBrands,
    getAllBrands
};