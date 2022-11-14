const accounts = require('../../models/accounts.model')

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
            const account = new accounts({
                email: req.body.email,
                password: req.body.password,
                user_id: null
            })
            account.save(account).then(data => {
                res.status(201).send(data);
            }).catch(err => { res.status(500).send({ message: err.message || "ERROR!!!" }) })
        }
    }
}

module.exports = {
    register,
};