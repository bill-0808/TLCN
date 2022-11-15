const bcrypt = require('bcrypt');
const saltRounds = 13;
const tokenKey = "my secret token key";
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    //validate a token from the Authentication header
    let authHeader = req.header('Authorization');
    if (authHeader) {
        const [type, token] = authHeader.split(' ');
        if (type === 'Bearer' && typeof token !== 'undefined') {
            const payload = jwt.verify(token, tokenKey);
            //put the data from the token payload into req.user prop
            req.user = payload;
            //now we have the user._id in our req object
        } else {
            //no matching user
            res.status(400).send({
                error: {
                    message: 'No valid token',
                },
            });
        }
    }
    next();
};

function createToken(id) {
    //create a jwt
    const token = jwt.sign({ _id: id }, tokenKey);
    return token;
};

const findUser = (req, res, next) => {
    //find a user with a matching email address
    let userMatch = users.find((user) => req.body.email === user.email);
    if (userMatch) {
        req.user = userMatch;
        next();
    } else {
        //no matching user
        res.status(400).send({
            error: { code: 456, message: 'Either email or password is invalid' },
        });
    }
};

const validPass = async (req, res, next) => {
    let submittedPass = req.body.password;
    let savedPass = req.user.password;
    console.log('comparing', submittedPass, savedPass);
    const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
    if (passwordDidMatch) {
        //we can continue because the password is valid
        next();
    } else {
        //no match
        res
            .status(400)
            .send({ error: { code: 369, message: 'Invalid password or username.' } });
    }
};

async function hashPass(password) {
    password = await bcrypt.hash(password, saltRounds);
    return password;
};

module.exports = {
    authenticate,
    hashPass,
    createToken,
    findUser,
    validPass,
};
