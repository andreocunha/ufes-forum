import React, { useContext, useEffect, useState } from "react";
import { AnswerCard } from "../../components/AnswerCard";
import { CompleteQuestionCard } from "../../components/QuestionCard";
import styles from '../../styles/pages/Question.module.css';
import { getSession } from "next-auth/client"
import { GlobalContext } from "../../context/GlobalContext";
import dynamic from "next/dynamic";
import { submitNewAnswer } from "../../services/requestsAPI/answers";
import { handleUploadFile } from "../../services/requestsAPI/drive";
import { ChatCard } from "../../components/ChatCard";

// import MdEditor from 'for-editor-markdown';
// load dynamic import MdEditor
const MdEditor = dynamic(() => import('for-editor-markdown'), {
    ssr: false
});

export default function Question(props) {
    const [question, setQuestion] = useState([]);
    const [textAnswer, setTextAnswer] = useState('');
    const [emails, setEmails] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false);

    const {
        token,
        showChat,
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

        // get the emails of the users
        const emailsArray = theQuestion?.answers?.map(answer => answer?.author?.email);
        // add the email of the question author
        emailsArray.push(theQuestion?.author?.email);
        setEmails(emailsArray);
        // remove duplicates
        setEmails(emailsArray.filter((item, index) => emailsArray.indexOf(item) === index));
        // remove the email of the current user (props.user?.email)
        setEmails(emailsArray.filter(email => email !== props?.user?.email));

    }, [props.question]);
    
    async function handleSubmitAnswer() {
        setButtonClicked(true);
        await submitNewAnswer(
            question._id, 
            token, 
            textAnswer, 
            {
                title: question?.title,
                userQuestion: question?.author?.name,
                userQuestionEmail: question?.author?.email,
                userAnswer: props?.user?.name,
                url: `${window?.location?.href}`,
                emails: emails,
            }
        )
        setButtonClicked(false);
    }

    return (
        <div className={styles.container}>
            <CompleteQuestionCard question={question} />

            <ChatCard questionID={props?.question?.id} />

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
                    addImg={ async (file) => setTextAnswer(textAnswer + await handleUploadFile(file))}
                    style={{ width: '100%', height: '350px' }}
                />   
                <button 
                    onClick={ async () => await handleSubmitAnswer()}
                    disabled={buttonClicked}
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
            question: question || {},
            user: user
        }
    }
}