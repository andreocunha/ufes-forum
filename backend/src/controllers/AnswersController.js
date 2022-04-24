const QuestionModel = require('../models/Question');

module.exports = {
    // function to create a new answer
    async create(req, res) {
        try {
            const { text } = req.body;
            // get the question from id
            const question = await QuestionModel.findById(req.params.questionID);
            const questionResult = await question.addAnswer(req.user.id, text);
            res.status(200).json(questionResult);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to list all answers
    async list(req, res) {
        try {
            const question = await QuestionModel.findById(req.params.questionID);
            res.status(200).json(question.answers);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function list a specific answer by id
    async listOne(req, res) {
        try {
            const question = await QuestionModel.findById(req.params.questionID);
            const answer = await question.answers.id(req.params.answerID);
            res.status(200).json(answer);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to update a specific answer
    async update(req, res) {
        try {
            const { text } = req.body;
            const { isSolution } = req.body;
            const question = await QuestionModel.findById(req.params.questionID);
            const answer = await question.answers.id(req.params.answerID);
            answer.text = text;
            answer.isSolution = isSolution;
            question.wasAnswered = true;
            await question.save();
            res.status(200).json(answer);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to remove an answer
    async remove(req, res) {
        try {
            const question = await QuestionModel.findById(req.params.questionID);
            const questionResult = await question.deleteAnswer(req.params.answerID);
            res.json(questionResult);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};