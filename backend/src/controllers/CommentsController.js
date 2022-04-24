const AnswerModel = require("../models/Answer");
const Question = require("../models/Question");

module.exports = {
    // function to create a new comment in the answer
    async createCommentAnswer(req, res) {
        try {
            const { text } = req.body;
            // get the question from id
            const question = await Question.findById(req.params.questionID);
            const answer = await question.answers.id(req.params.answerID);
            const answerResult = await answer.addComment(req.user.id, text);
            const questionResult = await question.save();
            res.status(200).json(questionResult);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    // function to create a new comment in the question
    async createCommentQuestion(req, res) {
        try {
            const { text } = req.body;
            // get the question from id
            const question = await Question.findById(req.params.questionID);
            const questionResult = await question.addComment(req.user.id, text);
            res.status(200).json(questionResult);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to update a comment in the answer
    async updateCommentAnswer(req, res) {
        try {
            const { text } = req.body;
            const comment = await req.answer.comments.id(req.params.commentID);
            comment.text = text;
            const answerResult = await req.question.save();
            res.status(200).json(answerResult);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to update a comment in the question
    async updateCommentQuestion(req, res) {
        try {
            const { text } = req.body;
            const comment = await req.question.comments.id(req.params.commentID);
            comment.text = text;
            const questionResult = await req.question.save();
            res.status(200).json(questionResult);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to remove a comment in the answer
    async removeCommentAnswer(req, res) {
        try {
            const answerResult = await req.answer.deleteComment(req.params.commentID);
            const questionResult = await req.question.save();
            res.json(questionResult);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to remove a comment in the question
    async removeCommentQuestion(req, res) {
        try {
            let questionResult = await req.question.deleteComment(req.params.commentID);
            questionResult = await questionResult.save();
            res.json(questionResult);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};