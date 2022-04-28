const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String,
        required: true,
        unique: true,
    },
    role: { 
        type: String, 
        required: true, 
        default: 'user' 
    },
    image: {
        type: String,
        unique: false,
        default: function () {
            return `https://secure.gravatar.com/avatar/${this._id}?s=90&d=identicon`;
        }
    },
    score : {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    anonymousMode: {
        type: Boolean,
        default: false,
    },
    nickname: { 
        type: String, 
        default: '',
    },
    github: {
        type: String,
        default: '',
    },
    linkedin: {
        type: String,
        default: '',
    },
    instagram: {
        type: String,
        default: '',
    },
    created: { 
        type: Date, 
        default: Date.now 
    },
});

UserModel.set('toJSON', { getters: true });
UserModel.options.toJSON.transform = (doc, ret) => {
    const obj = { ...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('user', UserModel);
