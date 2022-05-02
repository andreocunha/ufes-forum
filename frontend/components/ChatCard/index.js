import React, { useState, useEffect } from 'react';
import stc from 'string-to-color';
import socket from '../../services/realtime/socketio';
import styles from '../../styles/components/ChatCard.module.css';

export function ChatCard({ questionID }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [temporaryMsg, setTemporaryMsg] = useState([]);

  useEffect( async () => {

    let userName = 'Andre' + Math.floor(Math.random() * 100);
    setName(userName);

    socket.emit('newUser', { 
        name: userName,
        image: 'https://avatars2.githubusercontent.com/u/17098477?s=460&u=f9f8b8f8f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9&v=4'
    }, questionID);

    socket.on('allUsersForum', data => {
        console.log(data)
    })

    socket.on('serverMessage', data => {
      // console.log(data)
      setTemporaryMsg(temporaryMsg => [...temporaryMsg, data]);
      // scroll the chat area up
      const chatArea = document.getElementById('chat');
      chatArea.scrollTop = chatArea.scrollHeight;
    })

    socket.on('allUsersInQuestion', data => {
        console.log(data)
    })
  },[])

  function newMessage(){
    if(message === ''){
      return;
    }
    socket.emit('clientMessage', message, questionID);
    setMessage('')

    // scroll the chat area up
    const chatArea = document.getElementById('chat');
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  return (
    <div className={styles.container}>
      <div 
        className={styles.messageArea}
        id="chat"
      >
        {temporaryMsg.map((message, index) => (
          <div 
            className={styles.message} 
            key={index}
            style={message?.user?.name === name ? { alignSelf: 'flex-end'} : {}}
          >
            <div 
              className={styles.messageHeader}
              style={message?.user?.name === name ? { display: 'none' } : {}}
            >
              <img src={message?.user?.image} alt={message?.user?.name} width="20px" height="20px" />
              <span style={{ color: stc(message?.user?.name) }}>{message?.user?.name}</span>
            </div>
            <p>{message?.message}</p>
            <span className={styles.time}>{message?.date}</span>
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <textarea 
          className={styles.input} 
          placeholder="Digite algo aqui..." 
          value={message}
          onChange={e => setMessage(e.target.value)}
          // on press enter
          onKeyPress={e => {
            // verify if the key is enter + shift
            if(e.key === 'Enter' && e.shiftKey){
              return;
            }
            else if(e.key === 'Enter'){
              newMessage();
              // remove the enter
              e.preventDefault();
            }
          }}
        />
        <button className={styles.button} onClick={newMessage}>Enviar</button>
      </div>
    </div>
  );
}