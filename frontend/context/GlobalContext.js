import { createContext, useEffect, useState } from "react";
import { getQuestions } from "../services/requestsAPI/questions";

export const GlobalContext = createContext({});

export function InfoProvider({ children }) {
    const [isOpen, setOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [questions, setQuestions] = useState(null);
<<<<<<< HEAD
    const [numberOfQuestionsTotal, setNumberOfQuestionsTotal] = useState(0);
    const [numberOfQuestionsNotAnswered, setNumberOfQuestionsNotAnswered] = useState(0);
=======
>>>>>>> parent of 9e97779 (filtro e quantidade de questoes)

    async function searchSpecificQuestions(search) {
        if(search.length >= 2) {
            await fetch(`${process.env.API_URL}/questions/search/${search}`)
                .then(res => res.json())
                .then(data => {
                    setQuestions(data);
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <GlobalContext.Provider
            value={{
                questions,
                isOpen,
                token,
                setOpen,
                setToken,
                searchSpecificQuestions,
                getQuestions,
                setQuestions,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}