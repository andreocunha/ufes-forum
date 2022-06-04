import {
    successMessage,
    erroMessage,
    shortSuccessMessage,
    confirmMessage
} from "../../utils/alerts";
import { sendEmail } from "./questions";

export async function deleteAnswer(questionID, answerID, token) {
    const result = await confirmMessage('Você tem certeza que deseja excluir esta resposta?', 'Esta ação não poderá ser desfeita.');
    if (!result) {
        return;
    }

    const response = await fetch(`${process.env.API_URL}/answer/${questionID}/${answerID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.status === 200 || response.status === 201) {
        await successMessage('Resposta deletada!', 'Resposta deletada com sucesso!', 1500);
        window.location.reload();
    }
    else {
        await erroMessage('Erro ao deletar a resposta!', 'Tente novamente mais tarde!', 1500);
    }
}

export async function updateStatusSolution(questionID, answerID, token, answer) {
    const response = await fetch(`${process.env.API_URL}/answer/${questionID}/${answerID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            text: answer.text,
            isSolution: !answer.isSolution
        })
    });
    if (response.status === 200) {
        await shortSuccessMessage('O status da resposta foi atualizado com sucesso!');
        window.location.reload();
    }
    else {
        await erroMessage('Erro ao atualizar o status da resposta!', 'Tente novamente mais tarde!', 1500);
    }
}

export async function updateAnswer(questionID, answerID, token, text) {
    const response = await fetch(`${process.env.API_URL}/answer/${questionID}/${answerID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            text: text
        })
    });
    if (response.status === 200) {
        await shortSuccessMessage('A resposta foi atualizada com sucesso!');
        // go to previous page
        window.history.back();
    }
    else {
        await erroMessage('Erro ao atualizar a resposta!', 'Tente novamente mais tarde!', 1500);
    }
}

export async function submitNewAnswer(questionID, token, textAnswer, emailInfo) {
    // verify if all fields are filled
    if (textAnswer !== '') {
        const response = await fetch(`${process.env.API_URL}/answer/${questionID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                text: textAnswer
            })
        });

        if (response.status === 200) {
            await successMessage('Resposta enviada!', 'Sua resposta foi enviada com sucesso!', 1500);
            await sendEmail(emailInfo)
            window.location.reload();
        }
        else {
            await erroMessage('Erro ao enviar a resposta!', ' Tente deslogar e logar novamente.', 3000);
        }
    }
    else {
        await erroMessage('Erro ao enviar a resposta!', 'Preencha todos os campos!', 2000);
    }
}

export async function getAnswersByUser(page, userName) {
    const result = await fetch(`${process.env.API_URL}/questions/answered/${userName}?page=${page}&limit=10`)
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