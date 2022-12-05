const accounts = require('../../models/accounts.model')
const users = require('../../models/users.model')
const bcrypt = require('bcrypt');
const { hashPass, createToken } = require('../../helpers/jwt_helper')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

async function register(req, res) {
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    }
    else {
        const doesExist = await accounts.findOne({ email: req.body.email, is_active: true })
        if (doesExist) {
            res.status(500).send({ message: "Email already existed" });
        } else if (req.body.password != req.body.passwordRepeat) {
            res.status(500).send({ message: "confirm password might not right" });
        } else {
            password = await hashPass(req.body.password);
            console.log(password);
            const account = new accounts({
                email: req.body.email,
                password: password,
                user_id: null,
                is_admin: false,
                is_active: false
            })
            account.save(account).then(async data => {
                let transporter = nodemailer.createTransport(smtpTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: 'shoesshopkutsu@gmail.com',
                        pass: 'dkbaizlebgxvkona'
                    }
                }));

                let link = await 'http:/localhost:8080/login/verify/' + String(data._id);

                let mailOptions = {
                    from: 'shoesshopkutsu@gmail.com',
                    to: String(data.email),
                    subject: '[Shoes shop verify email]',
                    html: `<p>Nhấn vào link bên dưới để xác thực email</p><br><a href="${link}">Verify Email.</a>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(500).send({ message: error })
                    } else {
                        res.status(200).send({ message: "mail sent" })
                    }
                });
            }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
        }
    }
}

async function verify(req, res) {
    let id = await req.params.id;
    accounts.findByIdAndUpdate(id, { is_active: true })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found!!" });
            } else {
                res.redirect(301, "http://localhost:3000");
            }
        }).catch(err => {
            res.status(500).send(err);
        })
}

async function login(req, res) {
    let loginUser = await accounts.findOne({ email: req.body.email, is_active: true })
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else {
        if (!loginUser) {
            res.status(404).send({ message: "Email might not correct!" });
        } else {
            let loginPassword = await hashPass(req.body.password);
            if (bcrypt.compare(loginUser.password, loginPassword)) {
                let token = await createToken(loginUser._id);
                if (loginUser.user_id == null) {
                    res.status(200).send({
                        token: token, user: {
                            _id: "",
                            name: "",
                            age: "",
                            gender: "",
                            address: "",
                            phone: "",
                            avatar: "",
                            __v: ""
                        }
                    });
                } else {
                    let user = await users.findById(loginUser.user_id);
                    res.status(200).send({
                        token: token, user: user
                    });
                }
            } else {
                res.status(401).send({ message: "Wrong password!!" });
            }
        }
    }
}

module.exports = {
    register,
    login,
    verify,
};