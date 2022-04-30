const express = require('express');

// controllers
const UserController = require('./controllers/UserController');
const QuestionController = require('./controllers/QuestionController');
const AnswersController = require('./controllers/AnswersController');
const CommentsController = require('./controllers/CommentsController');
const TagsController = require('./controllers/TagsController');

// validations
const ValidateAnswer = require('./middlewares/ValidateAnswer');
const ValidateQuestion = require('./middlewares/ValidateQuestion');
const ValidateComment = require('./middlewares/ValidateComment');
const ValidateToken = require('./middlewares/ValidateToken');
const ValidateUser = require('./middlewares/ValidateUser');

const routes = express.Router();

// routes for user
routes.post('/users', UserController.signup);
routes.get('/users', UserController.list);
routes.get('/users/:name', UserController.listOne);
routes.put('/users/:id', ValidateToken, UserController.update);
routes.put('/users/:id/info', ValidateToken, UserController.updateInfo);
routes.delete('/users/:id', ValidateToken, UserController.delete);

// routes for question
routes.post('/questions', [ValidateToken, ValidateUser], QuestionController.create);
routes.get('/questions', QuestionController.list);
routes.get('/questions/oldest', QuestionController.listOldest);
routes.get('/questions/mostViewed', QuestionController.listMostViewed);
routes.get('/questions/notSolved', QuestionController.listNotSolved);
routes.get('/questions/:id', QuestionController.listOne);
routes.get('/questions/user/:name', QuestionController.listByAuthor);
routes.get('/questions/tag/:tag', QuestionController.listByTag);
routes.get('/questions/answered/:name', QuestionController.listAnsweredByAuthor);
routes.get('/questions/search/:text', QuestionController.search);
routes.put('/questions/:id', [ValidateToken, ValidateUser], QuestionController.update);
routes.delete('/questions/:id', [ValidateToken, ValidateQuestion], QuestionController.delete);

// routes for answer
routes.post('/answer/:questionID', ValidateToken, AnswersController.create);
routes.get('/answer/:questionID', AnswersController.list);
routes.get('/answer/:questionID/:answerID', AnswersController.listOne);
routes.put('/answer/:questionID/:answerID', ValidateToken, AnswersController.update);
routes.delete('/answer/:questionID/:answerID', [ValidateToken, ValidateAnswer], AnswersController.remove);

// routes for comment
routes.post('/comment/answer/:questionID/:answerID', ValidateToken, CommentsController.createCommentAnswer);
routes.post('/comment/question/:questionID', ValidateToken, CommentsController.createCommentQuestion);
routes.put('/comment/answer/:questionID/:answerID/:commentID', [ValidateToken, ValidateComment], CommentsController.updateCommentAnswer);
routes.put('/comment/question/:questionID/:commentID', [ValidateToken, ValidateComment], CommentsController.updateCommentQuestion);
routes.delete('/comment/answer/:questionID/:answerID/:commentID', [ValidateToken, ValidateComment], CommentsController.removeCommentAnswer);
routes.delete('/comment/question/:questionID/:commentID', [ValidateToken, ValidateComment], CommentsController.removeCommentQuestion);


// routes for tag
routes.get('/tags', TagsController.list);


module.exports = routes;