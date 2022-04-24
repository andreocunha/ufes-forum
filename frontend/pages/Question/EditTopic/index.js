import React, { useContext, useEffect, useState } from "react";
import { getSession, useSession } from 'next-auth/client';
import { FiSend } from "react-icons/fi";
import styles from '../../../styles/pages/EditTopic.module.css';
import { GlobalContext } from "../../../context/GlobalContext";
import dynamic from "next/dynamic";
import Select from 'react-dropdown-select';
import { updateQuestion } from "../../../services/requestsAPI/questions";
import { updateAnswer } from "../../../services/requestsAPI/answers";

// import MdEditor from 'for-editor-markdown';
// load dynamic import MdEditor
const MdEditor = dynamic(() => import('for-editor-markdown'), {
    ssr: false
});


export default function EditTopic({ infos, type }) {
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
        console.log(infos)
        
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
            console.log(infos)
            // setCategory(infos.category);
            // setTitle(infos.title);
            // setDescription(infos.description);
        }

    }, [session]);

    async function updateTopic(){
        if(type === 'question'){
            await updateQuestion(category, title, description, token, infos.id);
        }else{
            await updateAnswer(question.id, answer.id, token, description);
        }
    }

    const options = [
        { label: "JavaScript", value: "JavaScript" },
        { label: "Java", value: "Java" },
        { label: "Python", value: "Python" },
        { label: "C#", value: "C#" },
        { label: "C++", value: "C++" },
        { label: "C", value: "C" },
        { label: "PHP", value: "PHP" },
        { label: "Ruby", value: "Ruby" },
        { label: "Swift", value: "Swift" },
        { label: "Go", value: "Go" },
        { label: "Objective-C", value: "Objective-C" },
        { label: "Kotlin", value: "Kotlin" },
        { label: "R", value: "R" },
        { label: "Scala", value: "Scala" },
        { label: "Haskell", value: "Haskell" },
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
    const { id, type } = context.query;
    
    if(type === 'question'){
        await fetch(`${process.env.API_URL}/questions/${id}`,{
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
    }

    return {
        props: {
            infos,
            type
        }
    }
}