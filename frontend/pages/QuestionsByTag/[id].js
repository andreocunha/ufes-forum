import React, { useEffect, useState } from 'react';
import { QuestionCard } from '../../components/QuestionCard';
import styles from '../../styles/pages/Common.module.css';

export default function QuestionsByTag(props){
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        setQuestions(props.questions)
    },[])

    return (
        <div className={styles.container}>
            <div className={styles.main2} >
                { questions.length > 0 && questions.map((question, index) => (
                    <QuestionCard key={index} question={question} />
                ))}
            </div>
        </div>
    )
}


export const getServerSideProps = async (context) => {
    const id = context.query.id;
    let questions = []

     // make a fetch call to your backend api here to get all questions by tag id
    await fetch(`${process.env.API_URL}/questions/tag/${id}`)
        .then(res => res.json())
        .then(data => {
            questions = data;
        }
        )
        .catch(err => console.log(err))

    return {
        props: {
            questions: questions
        }
    }
}