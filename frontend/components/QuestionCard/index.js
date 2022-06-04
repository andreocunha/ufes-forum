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
import Link from "next/link";

export function QuestionCard(props) {
    
    function copyLinkToPasteboard(id) {
        // get the url of the current page
        const url = window.location.href;
        navigator.clipboard.writeText(url + 'Question/' + id);
        shortSuccessMessage('Link copiado!');
    }

    return (
        <a 
            href={`/Question/${props.question._id}`} target="_blank" rel="noopener noreferrer"
            className={styles.container} 
            style={ props?.question?.wasAnswered ? { borderLeft: '8px solid #06BA2B' } : {}}
        >
            
            { props?.question?.wasAnswered && <h2>SOLUCIONADO</h2>}
            <div className={styles.userArea}>
                <SimpleUserCard 
                    data={props?.question?.author} 
                    created={props?.question?.created} 
                    views={props?.question?.views}
                    numAnswers={props?.question?.answers?.length}
                />
                <Link href={`/`}>
                    <div className={styles.icons} onClick={() => copyLinkToPasteboard(props?.question?._id)}>
                        <FaCopy size={18} color="var(--text-color)"/>
                    </div>
                </Link>
            </div>
            
            <div className={styles.question}>
                <div className={styles.question}>
                    <p className={styles.title}>{props.question.title}</p>

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
            </div>
        </a>
    )
}


export function CompleteQuestionCard(props) {
    return (
        <div className={styles.container2}>
            <div className={styles.topContainer}>
                <SimpleUserCard data={props.question.author} created={props.question.created}/>
                {props?.question?.author?.role == 'admin' && 
                    <SimpleMenuList questionId={props.question.id} type="question" />
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
            </div>
        </div>
    )
}