import React, { useContext, useEffect, useState } from "react";
import { getSession, useSession } from 'next-auth/client';
import { FiSend } from "react-icons/fi";
import styles from '../../../styles/pages/EditTopic.module.css';
import { GlobalContext } from "../../../context/GlobalContext";
import dynamic from "next/dynamic";
import Select from 'react-dropdown-select';
import { updateQuestion } from "../../../services/requestsAPI/questions";
import { updateAnswer } from "../../../services/requestsAPI/answers";
import { handleUploadFile } from "../../../services/requestsAPI/drive";

// import MdEditor from 'for-editor-markdown';
// load dynamic import MdEditor
const MdEditor = dynamic(() => import('for-editor-markdown'), {
    ssr: false
});


export default function EditTopic({ infos, type, questionId, answerId }) {
    const [category, setCategory] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [displayCategory, setDisplayCategory] = useState([]);

    const {
        token
    } = useContext(GlobalContext)


    const [session] = useSession();

    useEffect(() => {
        if (!session) {
            window.location.href = '/';
        }
        
        if(type === 'question') {
            infos.tags.map(category => {
                setDisplayCategory(prevState => [...prevState, { label: category, value: category }])
            })
            // convert the array of tags into a string with the ',' separator
            setCategory(infos.tags.join(','))
            setTitle(infos.title);
            setDescription(infos.description);
        }
        else {
            // setCategory(infos.category);
            // setTitle(infos.title);
            setDescription(infos.text);
            // console.log(infos);
        }

    }, []);

    async function updateTopic(){
        if(type === 'question'){
            await updateQuestion(category, title, description, token, infos.id);
        }else{
            await updateAnswer(questionId, answerId, token, description);
        }
    }

    const options = [
        { label: "Prog1", value: "Prog1" },
        { label: "Prog2", value: "Prog2" },
        { label: "ED1", value: "ED1" },
        { label: "ED2", value: "ED2" },
        { label: "C++", value: "C++" },
        { label: "C", value: "C" },
        { label: "Java", value: "Java" },
        { label: "Python", value: "Python" },
        { label: "JavaScript", value: "JavaScript" },
    ];

    return (
        <div className={styles.container}>
            {!session ?
                <></>
                :
                <div className={styles.questionArea}>
                    { type === 'question' &&
                    <Select
                       placeholder="Categorias da pergunta" 
                       className={styles.dropdown}
                       clearable
                       multi
                       searchable
                       create
                       options={options}
                       values={displayCategory}
                       onChange={(e) => setCategory(e.map(item => item.value).join(','))}
                    />}

                    { type === 'question' &&
                    <input 
                        type="text" 
                        placeholder="Título da pergunta" 
                        className={styles.questioninput}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}    
                    />}

                    <div className={styles.editor}>
                        <MdEditor
                            value={description}
                            onChange={setDescription}
                            addImg={ async (file) => setDescription(description + await handleUploadFile(file))}
                            style={{ height: '400px' }}
                        />   
                    </div>

                    <div 
                        className={styles.button} 
                        onClick={() => updateTopic()}
                    >
                        <FiSend size={18} color="var(--button-text-color)"/> <p>Atualizar</p>
                    </div>
                        
                </div>
            }
        </div>
    );
}


export const getServerSideProps = async (context) => {
    const session = await getSession(context);
    let user = null;
    let infos = null;

    if (session) {
        user = session.user;
    }
    else {
        return {
            props: {
                infos,
            },
        };
    }

    // get the id and type from params (url)
    const { questionId, answerId, type } = context.query;
    
    if(type === 'question'){
        await fetch(`${process.env.API_URL}/questions/${questionId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User': JSON.stringify(user)
            }   
        })
        .then(res => res.json())
        .then(data => {
            infos = data;
        })
        .catch(err => console.log(err))
    }
    else{
        await fetch(`${process.env.API_URL}/answer/${questionId}/${answerId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User': JSON.stringify(user)
            }   
        })
        .then(res => res.json())
        .then(data => {
            infos = data;
        })
        .catch(err => console.log(err))
    }

    return {
        props: {
            infos,
            type,
            questionId,
            answerId
        }
    }
}