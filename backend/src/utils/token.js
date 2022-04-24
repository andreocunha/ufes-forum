const jwt = require('jsonwebtoken');

const createToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
    };
    const options = {
        expiresIn: '7d',
    };
    return jwt.sign(payload, process.env.SECRET_KEY, options);
};

module.exports = {
    createToken,
};