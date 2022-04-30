import { erroMessage, shortSuccessMessage } from "../../utils/alerts"

export async function loginUser(name, email, image){
    try {
        const response = await fetch(`${process.env.API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                image,
            })
        });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log(error);
        // erroMessage("Error on loginUser");
    }
}

export async function updateUserInfo(userID, token, github, linkedin, instagram, nickname) {
    const response = await fetch(`${process.env.API_URL}/users/${userID}/info`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body:
         JSON.stringify({
            github,
            linkedin,
            instagram,
            nickname,
        })
    })
    .then(res => res.json())
    .then( async (data) => {
        await shortSuccessMessage("Informações atualizadas com sucesso!");
        return data;
    }).catch( async (err) => {
        console.log(err)
        await erroMessage('Erro!', 'Ocorreu um erro ao tentar atualizar os dados!', 2000);
        return null;
    })

    return response;
}

export async function updateUserAnonymousInfo(userID, token, nickname, anonymousMode) {
    if(anonymousMode && nickname === ""){
        erroMessage("Você precisa de um nickname para usar o modo anônimo");
        return null;
    }

    const response = await fetch(`${process.env.API_URL}/users/${userID}/info`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body:
         JSON.stringify({
            nickname,
            anonymousMode,
        })
    })
    .then(res => res.json())
    .then( async (data) => {
        await shortSuccessMessage("Alteração do modo anônimo");
        return data;
    }).catch( async (err) => {
        console.log(err)
        await erroMessage('Erro!', 'Ocorreu um erro ao tentar atualizar os dados!', 2000);
        return null;
    })

    return response;
}