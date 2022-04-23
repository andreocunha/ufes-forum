const Question = require("../models/Question");

const ValidateQuestions = (req, res, next) => {
    // get the object Question from the id in the url
    Question.findById(req.params.id)
        .then((question) => {
            // check if the user is the author of the question
            if (question.author.toString() !== req.user.id) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            next();
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

module.exports = ValidateQuestions;
