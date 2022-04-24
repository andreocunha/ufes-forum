const mongoose = require('mongoose');

const CommentModel = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

CommentModel.set('toJSON', { getters: true });
CommentModel.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  return obj;
};

module.exports = CommentModel;
