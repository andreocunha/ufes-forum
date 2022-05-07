import React, { useContext, useEffect, useState } from 'react';
import socket from '../../services/realtime/socketio';
import { BsFillChatLeftTextFill } from 'react-icons/bs';
import styles from '../../styles/components/PeopleOnlineCard.module.css';
import { GlobalContext } from '../../context/GlobalContext';

export function PeopleOnlineCard() {
  const [peopleOnline, setPeopleOnline] = useState([]);
  const [numberOfMessages, setNumberOfMessages] = useState(0);
  let tempNumberOfMessages = 0;

  const {
    showChat,
    setShowChat,
  } = useContext(GlobalContext)

  useEffect( async () => {
    const url = window.location.href;
    // get the id of the question /Question/[id]
    const questionID = url.split('/')[4];

    socket.on('allUsersInQuestion', data => {
      // console.log(data)
      setPeopleOnline(data);
    })

    socket.on('allUsersForum', data => {
      socket.emit('getUsersByUrl', questionID);
    })

    socket.on('serverMessage', data => {
      tempNumberOfMessages++;
      setNumberOfMessages(tempNumberOfMessages);
    })

    socket.emit('getUsersByUrl', questionID);

  },[showChat])

  return (
    <div className={styles.container}>
      <div className={styles.peopleArea}>
        {peopleOnline.length >= 2 &&
         peopleOnline.map((person, index) => (
          index < 3 &&
          <div
            className={styles.person}
            key={index}
          >
            <img
              src={person.image}
              alt={person.name}
              className={styles.image}
            />
            <div className={styles.tooltip}>
              <p className={styles.tooltiptext}>{person.name}</p>
            </div>
          </div>          
          ))
        }
        {peopleOnline?.length > 3 &&
          <div className={styles.morePeople}>
            <p>+{peopleOnline.length - 3}</p>
          </div>
        }
      </div>

      {
        peopleOnline?.length >= 2 &&
      <div className={styles.chat} onClick={() => {
        setShowChat(!showChat)
        tempNumberOfMessages = 0;
        setNumberOfMessages(0);
      }}>
        <BsFillChatLeftTextFill size={35} color="var(--foreground)" />
        { numberOfMessages > 0 && !showChat && 
          <div 
            className={styles.numberMessages}
            style={ numberOfMessages > 10 ? { width: 25, height: 25 } : {}}
          >
            <p>{numberOfMessages}</p>
          </div>
        }
      </div>}
    </div>
  );
}