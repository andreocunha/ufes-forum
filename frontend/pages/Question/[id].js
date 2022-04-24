import React, { useContext, useEffect, useState } from "react";
import { AnswerCard } from "../../components/AnswerCard";
import { CompleteQuestionCard } from "../../components/QuestionCard";
import styles from '../../styles/pages/Question.module.css';
import { getSession } from "next-auth/client"
import { GlobalContext } from "../../context/GlobalContext";
import dynamic from "next/dynamic";
import { sendEmail } from "../../services/requestsAPI/questions";
import { submitNewAnswer } from "../../services/requestsAPI/answers";
// import socket from "../../services/realtime/socketio";

// import MdEditor from 'for-editor-markdown';
// load dynamic import MdEditor
const MdEditor = dynamic(() => import('for-editor-markdown'), {
    ssr: false
});

export default function Question(props) {
    const [question, setQuestion] = useState([]);
    const [textAnswer, setTextAnswer] = useState('');
    const [temporaryMsg, setTemporaryMsg] = useState([]);

    const {
        token
    } = useContext(GlobalContext)

    useEffect(() => {
        let theQuestion = props?.question;

        // sort the questions, first the solutions, then the others
        const sortedQuestions = theQuestion?.answers?.sort((a, b) => {
            if (a.isSolution && !b.isSolution) {
                return -1;
            } else if (!a.isSolution && b.isSolution) {
                return 1;
            } else {
                return 0;
            }
        });

        theQuestion.answers = sortedQuestions;
        setQuestion(theQuestion);
    }, [props.question]);

    // useEffect(() => {
    //     // console.log(props.question)
    //     setQuestion(props.question)

    //     socket.emit('newUser', { 
    //         nickname: 'Andre',
    //         image: 'https://avatars2.githubusercontent.com/u/17098477?s=460&u=f9f8b8f8f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9&v=4'
    //     }, props.question.id);

    //     socket.on('allUsersForum', data => {
    //         console.log(data)
    //     })

    //     socket.on('allMessages', data => {
    //         // console.log(data)
    //         let vectorTemporaryMsg = temporaryMsg
    //         vectorTemporaryMsg.push(data);
    //         setTemporaryMsg(vectorTemporaryMsg);
    //         console.log(vectorTemporaryMsg)
    //     })

    //     socket.on('allUsersInQuestion', data => {
    //         console.log(data)
    //     })
    // },[])

    // function emitMsgTest() {
    //     socket.emit('newMessage', 'Hello world', props.question.id);
    // }

    return (
        <div className={styles.container}>
            <CompleteQuestionCard question={question} />
            {/* <button onClick={emitMsgTest}>Teste</button> */}

            { question?.answers?.length > 0 &&
                question?.answers.map((answer, index) => (
                    <AnswerCard 
                        key={index} 
                        answer={answer} 
                        questionID={question.id} 
                        isAuthorQuestion={question.author?.role == 'admin'}
                    />
                ))
            }

            <h3>Responder</h3>
            <div className={styles.inputAnswerArea}>

                <MdEditor
                    placeholder="Escreva sua resposta aqui..."
                    onChange={setTextAnswer}
                    value={textAnswer} 
                    style={{ width: '100%', height: '350px' }}
                />   
                <button 
                    onClick={() => submitNewAnswer(
                        question._id, 
                        token, 
                        textAnswer, 
                        {
                            title: question?.title,
                            userQuestion: question?.author?.name,
                            userQuestionEmail: question?.author?.email,
                            userAnswer: props?.user?.name,
                            url: `${window?.location?.href}/Question/${question.id}`,
                        }
                    )}
                >Responder
                </button>
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

    const id = context.query.id;
    let question = null;

    // make a fetch call to your backend api here to get questions by id
    await fetch(`${process.env.API_URL}/questions/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User': JSON.stringify(user)
            }   
        })
        .then(res => res.json())
        .then(data => {
            question = data;
        })
        .catch(err => console.log(err))
    
    return {
        props: {
            question: question,
            user: user
        }
    }
}