class Forum {
  constructor (){
    this.usersQuestions = []; // dicionario de usuarios que estao nas respectivas perguntas
    this.users = [];
  }

  addUser(user) {
    // verifica se o usuario ja existe
    const userExists = this.users.find(u => u.id === user.id);
    if(!userExists) {
      this.users.push(user);
    }
  }

  addUserInQuestion(user, urlQuestion) {
    /* this.usersQuestions = [
      urlQuestion: [
        {user},
        {user},
        {user}
      ],
      urlQuestion: [
        {user},
        {user},
        {user}
      ]
    ] 
    */
    const questionExists = this.usersQuestions.find(u => u.urlQuestion === urlQuestion);
    if(!questionExists) {
      this.usersQuestions.push({
        urlQuestion: urlQuestion,
        users: [user]
      });
    }
    else {
      const userExists = questionExists.users.find(u => u.id === user.id);
      if(!userExists) {
        questionExists.users.push(user);
      }
    }
  }

  removeUser(user) {
    this.users = this.users.filter(u => u !== user);
    // find all the questions that the user is in
    const questions = this.usersQuestions.filter(q => q.users.find(u => u.id === user?.id));
    // remove the user from the questions
    questions.forEach(q => {
      q.users = q.users.filter(u => u !== user);
    });
  }

  getUser(id) {
    return this.users.find(u => u.id === id);
  }

  getAllUsers() {
    return this.users;
  }

  getAllUsersInQuestion(urlQuestion) {
    const question = this.usersQuestions.find(q => q.urlQuestion === urlQuestion);
    return question?.users || [];
  }
}

module.exports = {
  Forum
};