const mongoose = require('mongoose');

const CommentModel = require('./Comment');
const AnswerModel = require('./Answer');

const QuestionModel = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
            required: true,
        },
    ],
    wasAnswered: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    answers: [AnswerModel],
    comments: [CommentModel],
    created: {
        type: Date,
        default: Date.now,
    },
});

QuestionModel.methods = {
    addAnswer: function (author, text) {
        this.answers.push({ author, text });
        return this.save();
    },

    deleteAnswer: function (answerId) {
        const answer = this.answers.id(answerId);
        if (!answer) {
            throw new Error('Answer not found');
        }
        answer.remove();
        return this.save();
    },

    addComment: function (author, text) {
        this.comments.push({ author, text });
        return this.save();
    },

    deleteComment: function (commentId) {
        this.comments = this.comments.filter(comment => comment._id.toString() !== commentId);
        return this;
    }
}

QuestionModel.set('toJSON', { getters: true });
QuestionModel.options.toJSON.transform = (doc, ret) => {
    const obj = { ...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};


module.exports = mongoose.model('question', QuestionModel);