import React, { useEffect, useState } from "react";
import {  QuestionCard } from "../../components/QuestionCard";
import styles from '../../styles/pages/Common.module.css';
import { getSession } from "next-auth/client"

export default function MyQuestions2(props) {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        setQuestions(props.questions)
    },[])

    return (
        <div className={styles.container}>
            <div className={styles.main2}>
            { questions?.length > 0 && questions?.map((question, index) => (
                <QuestionCard key={index} question={question} />
            ))}
            </div>
        </div>
    )
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context);

    let user = null;
    if (session) {
        user = session.user;
    }
    else {
        return {
            props: {
                questions: []
            }
        }
    }

    let questions = null;

    // make a fetch call to your backend api here to get questions by id
    await fetch(`${process.env.API_URL}/questions/user/${user.name}`)
        .then(res => res.json())
        .then(data => {
            questions = data;
        })
        .catch(err => console.log(err))
    
    return {
        props: {
            questions: questions
        }
    }
}