import { confirmMessage, erroMessage, successMessage } from "../../utils/alerts";

export async function getQuestions(page) {
  const result = await fetch(`${process.env.API_URL}/questions?page=${page}&limit=10`)
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
      return null;
    })
  return result;
}

export async function getOldestQuestions(page) {
  const result = await fetch(`${process.env.API_URL}/questions/oldest?page=${page}&limit=10`)
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
      return null;
    })
  return result;
}

export async function getMostViewedQuestions(page) {
  const result = await fetch(`${process.env.API_URL}/questions/mostViewed?page=${page}&limit=10`)
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
      return null;
    })
  return result;
}

export async function getNotSolvedQuestions(page) {
  const result = await fetch(`${process.env.API_URL}/questions/notSolved?page=${page}&limit=10`)
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
      return null;
    })
  return result;
}

export async function getQuestionsByUser(page, userName) {
  const result = await fetch(`${process.env.API_URL}/questions/user/${userName}?page=${page}&limit=10`)
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
      return null;
    })
  return result;
}

export async function getQuestionsByTag(page, tagId) {
  const result = await fetch(`${process.env.API_URL}/questions/tag/${tagId}?page=${page}&limit=10`)
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
      return null;
    })
  return result;
}

export async function createQuestion(category, title, description, token) {
  // verify if all fields are filled
  if (category && title && description) {
    let tags = category.split(',');
    const response = await fetch(`${process.env.API_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        tags,
        title,
        description
      })
    });

    if (response.status === 200 || response.status === 201) {
      await successMessage('Questão criada!', 'A sua questão foi criada com sucesso!', 2000);
      window.location.href = '/';
    }
  }
  else {
    await erroMessage('Oops...', 'Preencha todos os campos!');
    return false;
  }
}

export async function deleteQuestion(questionID, token) {
  const result = await confirmMessage('Você tem certeza que deseja excluir esta questão?', 'Esta ação não poderá ser desfeita.');
  if (!result) {
    return;
  }

  const response = await fetch(`${process.env.API_URL}/questions/${questionID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 200 || response.status === 201) {
    await successMessage('Questão deletada!', 'Questão deletada com sucesso!', 1500);
    window.location.href = '/';
  }
  else {
    await erroMessage('Erro ao deletar a questão!', 'Tente novamente mais tarde!', 1500);
  }
}


export async function updateQuestion(category, title, description, token, questionID) {
  // verify if all fields are filled
  if (category && title && description) {
    let tags = category.split(',');
    const response = await fetch(`${process.env.API_URL}/questions/${questionID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        tags,
        title,
        description
      })
    });

    if (response.status === 200 || response.status === 201) {
      await successMessage('Questão atualizada!', 'A sua questão foi atualizada com sucesso!', 2000);
      window.history.back();
    }
  }
  else {
    await erroMessage('Oops...', 'Preencha todos os campos!');
  }
}


export async function sendEmail(info) {
  fetch('/api/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(info)
  }).then((res) => {
    console.log('Response received')
    if (res.status === 200) {
      // console.log(res.json());
      console.log('Response succeeded!')
    }
    else {
      console.log('Response failed!')
    }
  })
}