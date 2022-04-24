import React from "react";
import styles from '../../styles/components/QuestionCard.module.css';
import { SimpleUserCard } from "../UserCard";
import { FaCopy } from "react-icons/fa";
import dynamic from "next/dynamic";
import { SimpleMenuList } from "../SimpleMenuList";

// load dynamic import MarkdownPreview
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
    ssr: false
});

import '@uiw/react-markdown-preview/markdown.css';
import { shortSuccessMessage } from "../../utils/alerts";

export function QuestionCard(props) {
    
    function copyLinkToPasteboard(id) {
        // get the url of the current page
        const url = window.location.href;
        navigator.clipboard.writeText(url + 'Question/' + id);
        shortSuccessMessage('Link copiado!');
    }

    return (
            <div className={styles.container}>
                <div className={styles.userArea}>
                    <SimpleUserCard 
                        data={props.question.author} 
                        created={props.question.created} 
                        views={props.question.views}
                    />
                    <div className={styles.icons} onClick={() => copyLinkToPasteboard(props?.question?._id)}>
                        <FaCopy size={18} color="var(--text-color)"/>
                    </div>
                </div>
                
                <a href={`/Question/${props.question._id}`} target="_blank" rel="noopener noreferrer" className={styles.question}>
                    <div className={styles.question}>
                        <p className={styles.title}>{props.question.title}</p>
                        {/* <p className={styles.description}>{props.question.description}</p> */}

                        <div className={styles.tags}>
                        {props.question.tags && 
                            props.question.tags.map((tag, index) => (
                                // show only first 3 tags
                                index < 3 &&
                                <span key={index} className={styles.tag}>{tag}</span>
                            ))
                        }
                        </div>
                    </div>
                </a>
            </div>
    )
}


export function CompleteQuestionCard(props) {
    return (
        <div className={styles.container2}>
            <div className={styles.topContainer}>
                <SimpleUserCard data={props.question.author} created={props.question.created}/>
                {props?.question?.author?.role == 'admin' && 
                    // <FiTrash 
                    //     className={styles.icons} 
                    //     size={18} 
                    //     color="var(--text-color)" 
                    //     onClick={ async () => await deleteQuestion(props.question.id, token)}
                    // />
                    <SimpleMenuList id={props.question.id} type="question" />
                }
            </div>
            <div className={styles.question} style={{ cursor: 'default' }}>
                <p className={styles.fullTitle}>{props.question.title}</p>
                {/* <p className={styles.fullDescription}>{props.question.description}</p> */}
                <MarkdownPreview source={props.question.description} />

                <div className={styles.tags}>
                {props.question.tags && 
                    props.question.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                    ))
                }
                </div>
                {/* <div className={styles.comments}>
                    <p>Mostrar comentários (3)</p>
                    <p>Comentar</p>
                    {props.question.comments &&
                        props.question.comments.map((comment, index) => (
                            <div key={index} className={styles.comment}>
                                <p>{comment.text}</p>
                            </div>
                        ))
                    }
                </div> */}
            </div>
        </div>
    )
}