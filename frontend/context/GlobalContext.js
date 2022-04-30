import { createContext, useEffect, useState } from "react";
import { getQuestions } from "../services/requestsAPI/questions";

export const GlobalContext = createContext({});

export function InfoProvider({ children }) {
    const [isOpen, setOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [pageQuestions, setPageQuestions] = useState(0);
    const [numberOfQuestionsTotal, setNumberOfQuestionsTotal] = useState(0);
    const [numberOfQuestionsNotAnswered, setNumberOfQuestionsNotAnswered] = useState(0);

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
                pageQuestions,
                numberOfQuestionsTotal,
                numberOfQuestionsNotAnswered,
                isOpen,
                token,
                setOpen,
                setToken,
                searchSpecificQuestions,
                getQuestions,
                setQuestions,
                setPageQuestions,
                setNumberOfQuestionsTotal,
                setNumberOfQuestionsNotAnswered
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}