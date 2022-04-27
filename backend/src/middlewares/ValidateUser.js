const User = require("../models/User");

const ValidateUser = (req, res, next) => {
    // verify if user is logged in and is not blocked
    User.findById(req.user.id)
        .then((user) => {
            if (user.isBlocked) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            next();
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

module.exports = ValidateUser;
