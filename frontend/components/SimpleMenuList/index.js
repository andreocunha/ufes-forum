import React, { useContext } from 'react';
import Button from '@atlaskit/button/standard-button';
import { FiShare, FiMoreVertical } from "react-icons/fi";
import DropdownMenu, { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import styles from '../../styles/components/SimpleMenuList.module.css';
import Link from 'next/link';
import { deleteQuestion } from "../../services/requestsAPI/questions";
import { GlobalContext } from "../../context/GlobalContext";
import { shortSuccessMessage } from '../../utils/alerts';
import { useRouter } from 'next/router';
import { deleteAnswer } from '../../services/requestsAPI/answers';

export function SimpleMenuList({ questionId, answerId, type }) {
  const {
    token
  } = useContext(GlobalContext)

  const router = useRouter();

  function copyLinkToPasteboard() {
    // get the url of the current page
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    shortSuccessMessage('Link copiado!');
  }

  function goToEditTopic() {
    if(type === 'question') {
    router.push({
      pathname: 'EditTopic',
      query: {
        questionId: questionId,
        type: type,
        answerId: ''
      }
    })
    }
    else {
      router.push({
        pathname: 'EditTopic',
        query: {
          questionId: questionId,
          answerId: answerId,
          type: type
        }
      })
    }
  }

  async function deleteTopic() {
    if(type === 'question') {
      await deleteQuestion(questionId, token);
    }
    else {
      deleteAnswer(questionId, answerId, token);
    }
  }    

  return (
    <DropdownMenu
      trigger={({ triggerRef, ...props }) => (
        <Button
          {...props}
          iconBefore={<FiMoreVertical size={18} color="var(--text-color)" />}
          ref={triggerRef}
        />
      )}
    >
      <DropdownItemGroup className={styles.container}>
        {/* go to /EditTopic passing the id and type in query */}
        <a onClick={() => goToEditTopic()}>
          <p>Editar</p>
        </a>
        <a onClick={() => copyLinkToPasteboard()}>
          <p>Copiar Link</p>
        </a>
        <a onClick={ async () => await deleteTopic()}>
          <p>Deletar</p>
        </a>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};