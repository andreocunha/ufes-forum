import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import styles from '../../styles/components/UserCard.module.css';
import { FiEdit, FiCheck } from "react-icons/fi";
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";
import { updateUserInfo, updateUserAnonymousInfo } from "../../services/requestsAPI/users";
import { GlobalContext } from "../../context/GlobalContext";
import Link from "next/link";

export function SimpleUserCard(props) {

    useEffect(() => {
        moment.locale('pt-br');
    },[])
    
    return (
            <div className={styles.container}>
                <img src={props?.data?.image} alt={props?.data?.name} width="40px" height="40px" className={styles.imageUser}/>
                <div className={styles.userInfo}>
                    <Link href={`/QuestionsByUser/${props?.data?.name}`}>
                        <p className={styles.name}>{props?.data?.name}</p>
                    </Link>
                    <div className={styles.secondaryInfo}>
                        {props?.created && <p>{moment(props?.created).fromNow()}</p>}
                        {props?.numAnswers > 0 && <p>[ {props?.numAnswers} respostas ]</p>}
                        {props?.views > 0 && <p>{props?.views} views</p>}
                    </div>
                </div>
            </div>
    )
}

export function CompleteUserCard(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState(props?.data);
    const [github, setGithub] = useState(userInfo?.github);
    const [linkedin, setLinkedin] = useState(userInfo?.linkedin);
    const [instagram, setInstagram] = useState(userInfo?.instagram);
    const [nickname, setNickname] = useState(userInfo?.nickname);
    const [anonymousMode, setAnonymousMode] = useState(userInfo?.anonymousMode);

    const { token } = useContext(GlobalContext);

    async function handleUpdateInfo(){
        setIsEditing(false);
        // update the user in /users/:id/info

        // verify if any info was changed
        if(userInfo?.github === github 
            && userInfo?.linkedin === linkedin 
            && userInfo?.instagram === instagram 
            && userInfo?.nickname === nickname
            && userInfo?.anonymousMode === anonymousMode
        ){
            return;
        }

        const response = await updateUserInfo(props?.data?.id, token, github, linkedin, instagram, nickname, anonymousMode);
        setUserInfo(response);
    }

    async function handleAnonymousMode(){
        const response = await updateUserAnonymousInfo(props?.data?.id, token, nickname, !anonymousMode);
        if(response !== null){
            if(anonymousMode){
                setGithub(response.github);
                setLinkedin(response.linkedin);
                setInstagram(response.instagram);
            }
            setAnonymousMode(!anonymousMode);
            setUserInfo(response);
        }
    }

    return (
        <div className={styles.container2}>
            { isEditing ?
                <FiCheck 
                    size={20} 
                    className={styles.editIcon}
                    onClick={() => handleUpdateInfo()}
                />
                :
                <FiEdit 
                    size={20} 
                    className={styles.editIcon}
                    onClick={() => setIsEditing(!isEditing)}
                />
            }
            
            <div className={styles.userInfo2}>
                <img src={userInfo?.image} alt={userInfo?.name} width="200px" height="200px" className={styles.imageUser}/>
                <span>
                    <h2>{userInfo?.name}</h2>
                    <p>{userInfo?.email}</p>
                    <h3>Pontuação: <strong>{userInfo?.score}</strong></h3>
                    <div className={styles.mediaArea}>
                        {userInfo?.github && <a href={userInfo?.github} target="_blank" rel="noopener noreferrer"><BsGithub size={20}/></a>}

                        {userInfo?.linkedin && <a href={userInfo?.linkedin} target="_blank" rel="noopener noreferrer"><BsLinkedin size={20}/></a>}

                        {userInfo?.instagram && <a href={userInfo?.instagram} target="_blank" rel="noopener noreferrer"><BsInstagram size={20}/></a>}
                    </div>
                </span>
            </div>
            {isEditing &&
            <div className={styles.socialMedia}>
                <p>Github: 
                    <input 
                        type="text" 
                        placeholder="Link do seu Github" 
                        className={styles.input}
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                    />
                </p>
                <p>LinkedIn: 
                    <input
                        type="text"
                        placeholder="Link do seu LinkedIn"
                        className={styles.input}
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                    />
                </p>
                <p>Instagram: 
                    <input
                        type="text"
                        placeholder="Link do seu Instagram"
                        className={styles.input}
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                    />
                </p>
            </div>}
            <div className={styles.anonimo}>
                <div>
                    <input 
                        type="checkbox" 
                        id="anonimo" 
                        name="anonimo" 
                        value={anonymousMode}
                        onChange={() => handleAnonymousMode()}
                        checked={anonymousMode}
                    />
                    <label htmlFor="anonimo"> Modo Anônimo</label>    
                </div>
                <p>Nickname: 
                    { isEditing ?
                    <input
                        type="text"
                        placeholder="Digite seu nome anônimo"
                        className={styles.input}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    :
                    <strong>{nickname}</strong>
                    }
                </p>
            </div>
        </div>
    )
}