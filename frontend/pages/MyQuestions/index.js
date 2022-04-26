import React, { useEffect, useState } from "react";
import {  QuestionCard } from "../../components/QuestionCard";
import styles from '../../styles/pages/Common.module.css';
import { getSession } from "next-auth/client"
import { getQuestionsByUser } from "../../services/requestsAPI/questions";
import { InfiniteLoad } from "../../components/InfiniteLoad";

export default function MyQuestions2(props) {
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(1);
    const [numberOfQuestion, setNumberOfQuestions] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setQuestions(props.questions)
        setNumberOfQuestions(props.count)
    },[])

    const getMorePost = async () => {
        const response = await getQuestionsByUser(page + 1, props?.user?.name);
        const result = response?.questions;

        setNumberOfQuestions(response?.count);
        setPage(page + 1);
        if (result.length === 0) {
          setHasMore(false);
        }
        else {
          if(questions.length === 0) {
            setQuestions(result);
          }
          else {
            setQuestions([...questions, ...result]);
          }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main2}>
                <InfiniteLoad 
                    dataLength={questions?.length}
                    next={getMorePost}
                    hasMore={hasMore}
                >
                    {questions && questions?.map((question, index) => (
                        <QuestionCard key={index} question={question} />
                    ))}
                </InfiniteLoad>
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
    await fetch(`${process.env.API_URL}/questions/user/${user.name}?page=1&limit=10`)
        .then(res => res.json())
        .then(data => {
            questions = data;
        })
        .catch(err => console.log(err))
    
    return {
        props: {
            questions: questions.questions,
            count: questions.count,
            user: user
        }
    }
}