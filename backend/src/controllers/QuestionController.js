const QuestionModel = require('../models/Question');
const User = require('../models/User');
const { getUserByID } = require('./UserController');

module.exports = {
    // function to create a new question
    async create(req, res) {
        const author = req.user.id;
        const { title, description, tags } = req.body;
        const question = new QuestionModel({
            author,
            title,
            description,
            tags,
        });
        try {
            await question.save();
            res.json(question);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to list all questions
    async list(req, res) {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const questions = await QuestionModel.find().skip(skip).limit(limit).sort('-created');
            // url example: /questions?page=2&limit=10

            // get the author of each question and include it in the questions
            const questionsWithAuthor = await Promise.all(
                questions.map(async (question) => {
                    // const author = await User.findById(question.author);
                    const author = await getUserByID(question.author);
                    return { ...question._doc, author: author };
                })
            );

            // get the number of questions
            const count = await QuestionModel.countDocuments();

            return res.json({
                questions: questionsWithAuthor,
                count,
            });

            // return res.json(questionsWithAuthor);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function list all questions by oldest
    async listOldest(req, res) {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const questions = await QuestionModel.find().skip(skip).limit(limit).sort('created');

            // get the author of each question and include it in the questions
            const questionsWithAuthor = await Promise.all(
                questions.map(async (question) => {
                    const author = await getUserByID(question.author);
                    return { ...question._doc, author: author };
                })
            );
            const count = await QuestionModel.countDocuments();

            return res.json({
                questions: questionsWithAuthor,
                count,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to list all questions by more views
    async listMostViewed(req, res) {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const questions = await QuestionModel.find().skip(skip).limit(limit).sort('-views');

            // get the author of each question and include it in the questions
            const questionsWithAuthor = await Promise.all(
                questions.map(async (question) => {
                    const author = await getUserByID(question.author);
                    return { ...question._doc, author: author };
                })
            );
            const count = await QuestionModel.countDocuments();

            return res.json({
                questions: questionsWithAuthor,
                count,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to list all questions that was only wasAnswered = false
    async listNotSolved(req, res) {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            // get only questions that was not answered yet
            const questions = await QuestionModel.find({ wasAnswered: false }).skip(skip).limit(limit).sort('-created');

            // get the author of each question and include it in the questions
            const questionsWithAuthor = await Promise.all(
                questions.map(async (question) => {
                    const author = await getUserByID(question.author);
                    return { ...question._doc, author: author };
                })
            );
            const count = await QuestionModel.countDocuments({ wasAnswered: false });
            
            return res.json({
                questions: questionsWithAuthor,
                count,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },


    // function to list a specific question by id
    async listOne(req, res) {
        try {
            // get the question and add the author parameters like name and image
            let searchedQuestion = await QuestionModel.findById(req.params.id).select('-__v');
            // let question = Object.assign({}, searchedQuestion._doc);
            let question = {
                _id: searchedQuestion._doc._id,
                id: searchedQuestion._doc._id,
                title: searchedQuestion._doc.title,
                description: searchedQuestion._doc.description,
                tags: searchedQuestion._doc.tags,
                views: searchedQuestion._doc.views,
                created: searchedQuestion._doc.created,
                authorId: searchedQuestion._doc.author,
                author: {},
                answers: []
            }
            
            let author = await getUserByID(question.authorId);

            // add 1 view to the question
            searchedQuestion.views += 1;
            await searchedQuestion.save();

            // add the author to the question
            question = { ...question, author: author };

            const loggedUser = JSON.parse(req?.headers?.user);
            let user = null;
            if (loggedUser) {
                user = await User.findOne({ email: loggedUser.email});
            }

            // verify if has user logged in and if the user is the author of the question
            if (user?._id.equals(question?.author?._id)) {
                question.author.role = 'admin';
            }

            // verify if has answers and get the author of each answer and add it to the question
            if (searchedQuestion.answers.length > 0) {
                for (let i = 0; i < searchedQuestion.answers.length; i++) {
                    // const answer = await User.findById(question.answers[i].author);
                    let authorAnswer = await getUserByID(searchedQuestion.answers[i].author);
                    let newAnswer = { 
                        author: authorAnswer,
                        text: searchedQuestion.answers[i].text,
                        created: searchedQuestion.answers[i].created,
                        _id: searchedQuestion.answers[i]._id,
                        id: searchedQuestion.answers[i]._id,
                        isSolution: searchedQuestion.answers[i].isSolution
                     };

                     question.answers.push(newAnswer);

                    
                    // verify if has user logged in and if the user is the author of the answer
                    if (user?._id.equals(question.answers[i].author._id)) {
                        question.answers[i].author.role = 'admin';
                    }
                }
            }

            res.json(question);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to list all questions by a specific author name
    async listByAuthor(req, res) {
        try {
            const author = await User.findOne({ name: req.params.name });
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const questions = await QuestionModel.find({ author: author._id }).skip(skip).limit(limit).sort('-created');
            // const questions = await QuestionModel.find({ author: author._id }).sort('-created');

            // get the author of each question and include it in the questions
            const questionsWithAuthor = await Promise.all(
                questions.map(async (question) => {
                    const author = await getUserByID(question.author);
                    return { ...question._doc, author: author };
                })
            );

            const count = await QuestionModel.countDocuments({ author: author._id });

            return res.json({
                questions: questionsWithAuthor,
                count,
            });

            // res.json(questionsWithAuthor);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to list all questions by a specific tag name
    async listByTag(req, res) {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const questions = await QuestionModel.find({ tags: req.params.tag }).skip(skip).limit(limit).sort('-created');
            
            // get the author of each question and include it in the questions
            const questionsWithAuthor = await Promise.all(
                questions.map(async (question) => {
                    const author = await getUserByID(question.author);
                    return { ...question._doc, author: author };
                })
            );
            
            const count = await QuestionModel.countDocuments({ tags: req.params.tag });

            return res.json({
                questions: questionsWithAuthor,
                count,
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to list all questions that have a answer by a specific author name
    async listAnsweredByAuthor(req, res) {
        try {
            const author = await User.findOne({ name: req.params.name });
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const questions = await QuestionModel.find({ answers: { $elemMatch: { author: author._id } } }).skip(skip).limit(limit).sort('-created');
            // const questions = await QuestionModel.find({ answers: { $elemMatch: { author: author._id } } }).sort('-created');

            // get the author of each question and include it in the questions
            const questionsWithAuthor = await Promise.all(
                questions.map(async (question) => {
                    const author = await getUserByID(question.author);
                    return { ...question._doc, author: author };
                })
            );

            const count = await QuestionModel.countDocuments({ answers: { $elemMatch: { author: author._id } } });

            return res.json({
                questions: questionsWithAuthor,
                count,
            });

            // res.json(questionsWithAuthor);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to search questions by a specific text
    async search(req, res) {
        try {
            // const questions = await QuestionModel.find({ $text: { $search: req.params.text } }).sort('-created');
            // get questions with similar title or description text of the search
            const questions = await QuestionModel.find({
                $or: [
                    { title: { $regex: req.params.text, $options: 'i' } },
                    { description: { $regex: req.params.text, $options: 'i' } },
                ]
            }).sort('-created');

            // get the author of each question and include it in the questions
            const questionsWithAuthor = await Promise.all(
                questions.map(async (question) => {
                    const author = await getUserByID(question.author);
                    return { ...question._doc, author: author };
                })
            );
            res.json(questionsWithAuthor);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to update only the title or description by a specific question
    async update(req, res) {
        try {
            const question = await QuestionModel.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true },
            );
            res.json(question);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // function to delete a specific question
    async delete(req, res) {
        try {
            await QuestionModel.findByIdAndDelete(req.params.id);
            res.json({ message: 'Question deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },


    // function to delete a specific answer from a specific question
    async deleteAnswer(req, res) {
        try {
            const question = await QuestionModel.findById(req.params.id);
            question.answers = question.answers.filter
                (answer => answer._id.toString() !== req.params.answerId);
            await question.save();
            res.json(question);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

}