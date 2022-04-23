const mongoose = require('mongoose');

const CommentModel = require('./Comment');

const AnswerModel = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    isSolution: {
        type: Boolean,
        default: false,
    },
    comments: [CommentModel],
    created: {
        type: Date,
        default: Date.now,
    },
});

AnswerModel.methods = {
    addComment: function (author, text) {
        this.comments.push({ author, text });
        return this;
    },

    deleteComment: function (commentId) {
        const comment = this.comments.id(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }
        comment.remove();
        return this;
    }
}

AnswerModel.set('toJSON', { getters: true });
AnswerModel.options.toJSON.transform = (doc, ret) => {
    const obj = { ...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};


module.exports = AnswerModel;