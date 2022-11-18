const news = require('../../models/news.model')
const fs = require('fs');
const accounts = require('../../models/accounts.model')

async function createNews(req, res) {
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
                if (req.file) {
                    let img = fs.readFileSync(req.file.path);
                    let encode_image = img.toString('base64');
                    // Define a JSONobject for the image attributes for saving to database

                    let finalImg = {
                        contentType: req.file.mimetype,
                        image: Buffer.from(encode_image, 'base64')
                    };
                    const anews = new news({
                        content: req.body.content,
                        thumbnail: finalImg,
                        title: req.body.title,
                    })
                    anews.save(anews).then(data => {
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

function getAllNews(req, res) {
    news.find({}, function (err, news) {
        if (!err) {
            let count = news.length;
            res.status(200).send({ count: count, news: news });
        } else {
            res.status(500).send(err);
        }
    })
}

function getOneNews(req, res) {
    let id = req.params.id;
    news.findById(id, function (err, news) {
        if (!err) {
            res.status(200).send({ news: news });
        } else {
            res.status(500).send(err);
        }
    })
}

async function updateNews(req, res) {
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
                if (req.file) {
                    let id = req.params.id;
                    let img = fs.readFileSync(req.file.path);
                    let encode_image = img.toString('base64');
                    // Define a JSONobject for the image attributes for saving to database

                    let finalImg = {
                        contentType: req.file.mimetype,
                        image: Buffer.from(encode_image, 'base64')
                    };
                    let bodyData = {
                        content: req.body.content,
                        thumbnail: finalImg,
                        title: req.body.title,
                    }
                    news.findByIdAndUpdate(id, bodyData)
                        .then(data => {
                            if (!data) {
                                res.status(404).send({ message: "Not found!!" });
                            } else {
                                res.status(200).send({ news: bodyData });
                            }
                        }).catch(err => {
                            res.status(500).send(err);
                        })
                }
                else {
                    res.status(500).send({ message: "Missing body!" });
                    return;
                }
            }
        }
    }
}

async function deleteNews(req, res) {
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
                news.findByIdAndDelete(id, function (err, news) {
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
    createNews,
    getAllNews,
    getOneNews,
    updateNews,
    deleteNews,
};