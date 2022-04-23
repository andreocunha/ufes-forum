import { 
    successMessage, 
    erroMessage, 
    shortSuccessMessage,
    confirmMessage
} from "../../utils/alerts";

export async function deleteAnswer(questionID, answerID, token){
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
        await successMessage('Questão deletada!', 'Resposta deletada com sucesso!', 1500);
        window.location.reload();
    }
    else {
        await erroMessage('Erro ao deletar a resposta!', 'Tente novamente mais tarde!', 1500);
    }
}

export async function updateStatusSolution(questionID, answerID, token, answer){
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

export async function updateAnswer(questionID, answerID, token, text){
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