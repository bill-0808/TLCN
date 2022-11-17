const users = require('../../models/users.model')
const accounts = require('../../models/accounts.model')
const mongoose = require('mongoose');

async function firstLogin(req, res) {
    if (!req.body) {
        res.status(500).send({ message: "Missing body!" });
        return;
    } else if (!req.user) {
        res.status(401).send({ message: "Unauthenticate!!" });
        return;
    } else {
        let loginUser = await accounts.findOne({ _id: req.user._id })
        if (loginUser.user_id !== null) {
            res.status(500).send({ message: "User infomation alr registed" });
        } else {
            let id = new mongoose.Types.ObjectId();
            const session = await users.startSession();
            session.startTransaction();
            try {
                const opts = { session };
                const account = await accounts.findByIdAndUpdate(loginUser._id, { user_id: id }, opts);

                const user = await users({
                    _id: id,
                    name: req.body.name,
                    age: req.body.age,
                    gender: req.body.gender,
                    address: req.body.address,
                    phone: req.body.phone,
                }).save(opts);

                await session.commitTransaction();
                session.endSession();
                res.status(200).send({ user: user })
            } catch (error) {
                // If an error occurred, abort the whole transaction and
                // undo any changes that might have happened
                await session.abortTransaction();
                session.endSession();
                res.status(500).send(error);
            }
        }
    }
}

module.exports = {
    firstLogin,
};