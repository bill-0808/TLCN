const products = require('../../models/products.model')
const accounts = require('../../models/accounts.model')
const { cloudinary, options } = require('../../helpers/cloudinary_helper')

async function createProduct(req, res) {
    console.log(req.files, req.body, JSON.parse(req.body.size));
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
                if (req.files) {
                    let productImage = [];
                    for (let i = 0; i < req.files.length; i++) {
                        await cloudinary.uploader.upload(req.files[i].path, options).then(result => {
                            productImage.push(result.secure_url);
                        }).catch(err => {
                            console.log(err);
                        })
                    }

                    const product = new products({
                        product_image: productImage,
                        name: req.body.name,
                        price: req.body.price,
                        type: req.body.type,
                        brand: req.body.brand,
                        description: req.body.description,
                        gender: req.body.gender,
                        color: req.body.color,
                        size: JSON.parse(req.body.size),
                        is_active: true,
                        discount: 0
                    })
                    product.save(product).then(data => {
                        res.status(201).send(data);
                    }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
                }
                else {
                    res.status(500).send({ message: "Missing body!" });
                    return;
                }
            }
        }
    }
}

function getAllProducts(req, res) {
    products.find({}, function (err, products) {
        if (!err) {
            let count = products.length;
            res.status(200).send({ count: count, products: products });
        } else {
            res.status(500).send(err);
        }
    })
}

function getOneProducts(req, res) {
    let id = req.params.id;
    products.findById(id, function (err, products) {
        if (!err) {
            res.status(200).send({ products: products });
        } else {
            res.status(500).send(err);
        }
    })
}

async function updateProducts(req, res) {
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
                if (req.files) {
                    let productImage = [];
                    for (let i = 0; i < req.files.length; i++) {
                        await cloudinary.uploader.upload(req.files[i].path, options).then(result => {
                            productImage.push(result.secure_url);
                        }).catch(err => {
                            console.log(err);
                        })
                    }

                    let bodyData = {
                        product_image: productImage,
                        name: req.body.name,
                        price: req.body.price,
                        type: req.body.type,
                        brand: req.body.brand,
                        description: req.body.description,
                        gender: req.body.gender,
                        color: req.body.color,
                        size: JSON.parse(req.body.size),
                        is_active: true,
                        discount: req.body.discount
                    }
                    products.findByIdAndUpdate(id, bodyData)
                        .then(data => {
                            if (!data) {
                                res.status(404).send({ message: "Not found!!" });
                            } else {
                                res.status(200).send({ products: bodyData });
                            }
                        }).catch(err => {
                            res.status(500).send(err);
                        })
                }
                else {
                    let bodyData = {
                        name: req.body.name,
                        price: req.body.price,
                        type: req.body.type,
                        brand: req.body.brand,
                        description: req.body.description,
                        gender: req.body.gender,
                        color: req.body.color,
                        size: JSON.parse(req.body.size),
                        is_active: true,
                        discount: req.body.discount
                    }
                    products.findByIdAndUpdate(id, bodyData)
                        .then(data => {
                            if (!data) {
                                res.status(404).send({ message: "Not found!!" });
                            } else {
                                res.status(200).send({ products: bodyData });
                            }
                        }).catch(err => {
                            res.status(500).send(err);
                        })
                }
            }
        }
    }
}

async function deleteProducts(req, res) {
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
                products.findByIdAndUpdate(id, { is_active: false }, function (err, products) {
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

module.exports = {
    createProduct,
    getAllProducts,
    getOneProducts,
    updateProducts,
    deleteProducts,
};