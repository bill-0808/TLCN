const accounts = require('../../models/accounts.model')
const users = require('../../models/users.model')
const bcrypt = require('bcrypt');
const { hashPass, createToken } = require('../../helpers/jwt_helper')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { makeid } = require('../../helpers/user_util');
const { ObjectId } = require('mongodb');

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
            var secret = await makeid(6);
            const account = new accounts({
                email: req.body.email,
                password: password,
                user_id: null,
                is_admin: false,
                is_seller: false,
                is_active: false,
                secret: secret
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

                let mailOptions = {
                    from: 'shoesshopkutsu@gmail.com',
                    to: String(data.email),
                    subject: '[Shoes shop verify email]',
                    html: `<p>Mã xác nhận đăng ký của bạn ở shoeShop là:</p><br><p>Mã xác nhận: <b>${secret}</b></p>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(500).send({ message: error })
                    } else {
                        res.status(200).send({ account: data })
                    }
                });
            }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
        }
    }
}

async function verify(req, res) {
    let id = await req.params.id;
    let secret = await req.body.secret;
    accounts.findOneAndUpdate({ _id: ObjectId(id), secret: secret }, { is_active: true })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found!!" });
            } else {
                res.status(200).send({ message: "verified!!" })
            }
        }).catch(err => {
            res.status(500).send(err);
        })
}

async function resetPassword(req, res) {
    let email = req.body.email;
    let resetPasswordAccount = await accounts.findOne({ email: email });
    if (resetPasswordAccount) {
        var secret = await makeid(6);
        resetPasswordAccount.secret = secret;
        await resetPasswordAccount.save();
        let transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'shoesshopkutsu@gmail.com',
                pass: 'dkbaizlebgxvkona'
            }
        }));

        let mailOptions = {
            from: 'shoesshopkutsu@gmail.com',
            to: String(resetPasswordAccount.email),
            subject: '[Shoes shop verify email]',
            html: `<p>Mã đặt lại mật khẩu của bạn ở shoeShop là:</p><br><p>Mã xác nhận: <b>${secret}</b></p>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(500).send({ message: error })
            } else {
                res.status(200).send({ account: resetPasswordAccount })
            }
        });
    } else {
        res.status(500).send({ message: "email might not right!" })
    }
}

async function verifyResetPassword(req, res) {
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    }
    else {
        const doesExist = await accounts.findOne({ email: req.body.email, is_active: true })
        if (req.body.password != req.body.passwordRepeat) {
            res.status(500).send({ message: "confirm password might not right" });
        } else if (doesExist && doesExist.secret == req.body.secret) {
            password = await hashPass(req.body.password);
            doesExist.password = password;
            doesExist.save();
            return res.status(200).send({ message: "Update passwaord success" });
        } else {
            return res.status(500).send({ message: "secret key might not right" })
        }
    }
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
            let checkPass = await bcrypt.compare(req.body.password, loginUser.password);
            if (checkPass) {
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
                            __v: "",
                        },
                        is_admin: loginUser.is_admin,
                        is_seller: loginUser.is_seller
                    });
                } else {
                    let user = await users.findById(loginUser.user_id);
                    res.status(200).send({
                        token: token, user: user, is_admin: loginUser.is_admin, is_seller: loginUser.is_seller
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
    verifyResetPassword,
    resetPassword
};