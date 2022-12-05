const news = require('../../models/news.model')
const accounts = require('../../models/accounts.model')
const { cloudinary, options } = require('../../helpers/cloudinary_helper')

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
                    let thumbnail;
                    await cloudinary.uploader.upload(req.file.path, options).then(result => {
                        thumbnail = result.secure_url
                    }).catch(err => {
                        console.log(err);
                    })

                    const anews = new news({
                        content: req.body.content,
                        thumbnail: thumbnail,
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
                let id = req.params.id;
                if (req.file) {
                    let thumbnail;
                    await cloudinary.uploader.upload(req.file.path, options).then(result => {
                        thumbnail = result.secure_url
                    }).catch(err => {
                        console.log(err);
                    })

                    let bodyData = {
                        content: req.body.content,
                        thumbnail: thumbnail,
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
                    let bodyData = {
                        content: req.body.content,
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