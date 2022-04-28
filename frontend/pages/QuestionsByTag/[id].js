import React, { useEffect, useState } from 'react';
import { InfiniteLoad } from '../../components/InfiniteLoad';
import { QuestionCard } from '../../components/QuestionCard';
import { getQuestionsByTag } from '../../services/requestsAPI/questions';
import styles from '../../styles/pages/Common.module.css';

export default function QuestionsByTag(props){
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(1);
    const [numberOfQuestion, setNumberOfQuestions] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setQuestions(props.questions)
        setNumberOfQuestions(props.count)
    }, [])

    const getMorePost = async () => {
        const response = await getQuestionsByTag(page + 1, props?.tagId);
        const result = response?.questions;

        setNumberOfQuestions(response?.count);
        setPage(page + 1);
        if (result?.length === 0) {
            setHasMore(false);
        }
        else {
            if (questions.length === 0) {
                setQuestions(result);
            }
            else {
                setQuestions([...questions, ...result]);
            }
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.main2} >
                {questions.length > 0 && 
                <InfiniteLoad
                    dataLength={questions?.length}
                    next={getMorePost}
                    hasMore={hasMore}
                >
                    {questions && questions?.map((question, index) => (
                        <QuestionCard key={index} question={question} />
                    ))}
                </InfiniteLoad>}
            </div>
        </div>
    )
}


export const getServerSideProps = async (context) => {
    const id = context.query.id;
    let questions = []

     // make a fetch call to your backend api here to get all questions by tag id
    await fetch(`${process.env.API_URL}/questions/tag/${id}?page=1&limit=10`)
        .then(res => res.json())
        .then(data => {
            questions = data;
        })
        .catch(err => console.log(err))

    return {
        props: {
            questions: questions?.questions || [],
            count: questions?.count || 0,
            tagId: id
        }
    }
}