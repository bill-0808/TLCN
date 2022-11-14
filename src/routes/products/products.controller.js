const products = require('../../models/products.model')

function createProduct(req, res) {
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    }
    else {
        const product = new products({
            name: req.body.name,
            price: req.body.price,
            type: req.body.type,
            brand: req.body.brand,
            description: req.body.description,
            gender: req.body.gender,
            color: req.body.color,
            size: req.body.size,
            is_active: true,
            discount: 0
        })
        product.save(product).then(data => {
            res.status(201).send(data);
        }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
    }
}

function getAllProducts(req, res) {
    products.find({}, function (err, products) {
        if (!err) {
            let count = products.length; 
            res.status(200).send({count: count, products: products});
        } else {
            res.status(500).send(err);
        }
    })
}

module.exports = {
    createProduct,
    getAllProducts,
};