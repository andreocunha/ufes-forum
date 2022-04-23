const QuestionModel = require("../models/Question");

const ValidateAnswer = async (req, res, next) => {
    // get the object Answer from the id in the url
    const question = await QuestionModel.findById(req.params.questionID);
    // get an specific answer from the question
    const answer = await question.answers.id(req.params.answerID);
    try {
        // check if the user is the author of the answer
        if (answer.author.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = ValidateAnswer;


