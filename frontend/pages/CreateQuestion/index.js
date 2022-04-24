import React, { useContext, useEffect, useState } from "react";
import { useSession } from 'next-auth/client';
import { FiSend } from "react-icons/fi";
import styles from '../../styles/pages/CreateQuestion.module.css';
import { GlobalContext } from "../../context/GlobalContext";
import dynamic from "next/dynamic";
import Select from 'react-dropdown-select';
import { createQuestion } from "../../services/requestsAPI/questions";

// import MdEditor from 'for-editor-markdown';
// load dynamic import MdEditor
const MdEditor = dynamic(() => import('for-editor-markdown'), {
    ssr: false
});


export default function CreateQuestion() {
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const {
        token
    } = useContext(GlobalContext)


    const [session] = useSession();

    useEffect(() => {
        if (!session) {
            window.location.href = '/';
        }
    }, [session]);


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
                    <Select
                       placeholder="Categorias da pergunta" 
                       className={styles.dropdown}
                       clearable
                       multi
                       searchable
                       create
                       options={options}
                       onChange={(e) => setCategory(e.map(item => item.value).join(','))}
                    />

                    <input 
                        type="text" 
                        placeholder="Título da pergunta" 
                        className={styles.questioninput}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}    
                    />

                    <div className={styles.editor}>
                        <MdEditor
                            value={description}
                            onChange={setDescription}
                            style={{ height: '400px' }}
                        />   
                    </div>

                    <div 
                        className={styles.button} 
                        onClick={ async () => await createQuestion(category, title, description, token)}
                    >
                        <FiSend size={18} color="var(--button-text-color)"/> <p>Publicar</p>
                    </div>
                        
                </div>
            }
        </div>
    );
}