const accounts = require('../../models/accounts.model')
const bcrypt = require('bcrypt');
const { hashPass, createToken } = require('../../helpers/jwt_helper')

async function register(req, res) {
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    }
    else {
        const doesExist = await accounts.findOne({ email: req.body.email })
        if (doesExist) {
            res.status(500).send({ message: "Email already existed" });
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
    let loginUser = await accounts.findOne({ email: req.body.email })
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
                res.status(200).send({ data: { token } });
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