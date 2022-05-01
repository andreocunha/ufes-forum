import React, { useState } from 'react';
import styles from '../../styles/components/ChatCard.module.css';

export function ChatCard(){
  const [message, setMessage] = useState('');

  const [messageExample, setMessageExample] = useState ([
    {
      id: 1,
      nickname: 'Andre',
      image: 'https://avatars2.githubusercontent.com/u/17098477?s=460&u=f9f8b8f8f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9&v=4',
      message: 'Hello, how are you?',
      date: '2020-05-01T12:00:00.000Z'
    },
    {
      id: 2,
      nickname: 'Bruna',
      image: 'https://avatars2.githubusercontent.com/u/17098477?s=460&u=f9f8b8f8f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9&v=4',
      message: 'Hello, how are you?',
      date: '2020-05-01T12:00:00.000Z'
    },
    {
      id: 3,
      nickname: 'Andre',
      image: 'https://avatars2.githubusercontent.com/u/17098477?s=460&u=f9f8b8f8f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9&v=4',
      message: 'Good!',
      date: '2020-05-01T12:00:00.000Z'
    },
    {
      id: 4,
      nickname: 'Bruna',
      image: 'https://avatars2.githubusercontent.com/u/17098477?s=460&u=f9f8b8f8f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9&v=4',
      message: 'Good too!',
      date: '2020-05-01T12:00:00.000Z'
    },
  ])

  function newMessage(){
    // add new message to the messageExample
    const newMessage = {
      id: messageExample.length + 1,
      nickname: 'Andre',
      image: 'https://avatars2.githubusercontent.com/u/17098477?s=460&u=f9f8b8f8f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9&v=4',
      message: message,
      // get the current date
      date: new Date().toISOString()
    }

    setMessageExample([...messageExample, newMessage])
    setMessage('');

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
        {messageExample.map(message => (
          <div 
            className={styles.message} 
            key={message.id}
            style={message.nickname === 'Andre' ? { alignSelf: 'flex-end'} : {}}
          >
            <div 
              className={styles.messageHeader}
              style={message.nickname === 'Andre' ? { display: 'none' } : {}}
            >
              <img src={message.image} alt={message.nickname} width="30px" height="30px" />
              <span>{message.nickname}</span>
            </div>
            <p>{message.message}</p>
            <span className={styles.time}>{
              // data with only hours and minutes
              new Date(message.date).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })
            }</span>
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
            if(e.key === 'Enter'){
              newMessage();
            }
          }}
        />
        <button className={styles.button} onClick={newMessage}>Enviar</button>
      </div>
    </div>
  );
}