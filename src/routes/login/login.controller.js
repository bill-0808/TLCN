const accounts = require('../../models/accounts.model')
const users = require('../../models/users.model')
const bcrypt = require('bcrypt');
const { hashPass, createToken } = require('../../helpers/jwt_helper')

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
                is_active: true
            })
            account.save(account).then(data => {
                res.status(201).send(data);
            }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
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
};