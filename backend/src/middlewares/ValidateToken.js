const jwt = require('jsonwebtoken');

const ValidateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    try {
        // remove the Bearer from the token String
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid' });
    }
}
module.exports = ValidateToken;
