import React, { useContext, useEffect } from "react";
import styles from '../../styles/components/AnswerCard.module.css';
import { SimpleUserCard } from "../UserCard";
import { FiTrash } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { GlobalContext } from "../../context/GlobalContext";
import dynamic from "next/dynamic";
import { deleteAnswer, updateStatusSolution } from '../../services/requestsAPI/answers';
import { SimpleMenuList } from "../SimpleMenuList";

// load dynamic import MarkdownPreview
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
    ssr: false
});

export function AnswerCard(props){
    const {
        token
    } = useContext(GlobalContext);

    const colorTheme = {
        color: '#9e9e9e',
    };

    return (
        <div className={styles.container} style={ props?.answer?.isSolution ? { borderLeft: '8px solid #06BA2B' } : {}}>
            { (props.isAuthorQuestion && props?.answer?.author?.role != 'admin') && 
                <div className={styles.tooltip}>
                <GiCheckMark 
                    className={styles.icons} 
                    size={18} 
                    color={ props?.answer?.isSolution ? '#06BA2B' : "var(--text-color)"  }
                    onClick={ async () => await updateStatusSolution(props.questionID, props.answer.id, token, props.answer)} 
                />
                <span className={styles.tooltiptext}>Marcar como solução</span>
                </div>
            }
            { props?.answer?.isSolution && <h2>SOLUÇÃO</h2>}
            <div className={styles.user}>
                <SimpleUserCard data={props?.answer?.author} created={props?.answer?.created} />
                {props?.answer?.author?.role == 'admin' && 
                    <SimpleMenuList questionId={props.questionID} answerId={props.answer.id} type="answer"/>
                    // <FiTrash 
                    //     className={styles.icons} 
                    //     size={18} 
                    //     color="var(--text-color)" 
                    //     onClick={ async () => await deleteAnswer(props.questionID, props.answer.id, token)}
                    // />
                }
            </div>
            <div className={styles.answer} data-color-mode="dark">
                {/* <p className={styles.description}>{props?.answer?.text}</p> */}
                <MarkdownPreview 
                    source={props?.answer?.text} 
                    style={{ width: '100%', height: '100%', ...colorTheme }} 
                    
                />
            </div>
        </div>
    )
}