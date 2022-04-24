const CommentModel = require("../models/Comment");
const Question = require("../models/Question");

const ValidateComment = async (req, res, next) => {
    // get the question from id
    const question = await Question.findById(req.params.questionID)
    req.question = question;

    if(req.params.answerID){
        const answer = await question.answers.id(req.params.answerID);
        const comment = await answer.comments.id(req.params.commentID);
        req.comment = comment;
        req.answer = answer;
    }
    else {
        const comment = await question.comments.id(req.params.commentID);
        req.comment = comment;
    }
    
    try {
        // check if the user is the author of the comment
        if (req.comment.author.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = ValidateComment;
