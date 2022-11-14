const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((reject, resolve) => {
            const payload = {

            }
            const secret = ""
            const options = {}
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(token)
                }
            })
        })
    }
}