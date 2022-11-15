const news = require('../../models/news.model')
const fs = require('fs');
const accounts = require('../../models/accounts.model')

async function createNews(req, res) {
    console.log(req.user);
    let loginUser = await accounts.findOne({ _id: req.user._id })
    if (loginUser.is_admin !== true) {
        res.status(401).send({ message: "Unauthorized!!" })
    } else {
        if (!req.body) {
            res.status(500).send({ message: "Missing body!" });
            return;
        }
        else {
            console.log(req.file.path);
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

module.exports = {
    createNews,
    getAllNews,
};