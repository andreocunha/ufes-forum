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

export function SimpleMenuList({ id, type }) {
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
    router.push({
      pathname: 'EditTopic',
      query: {
        id: id,
        type: type 
      }
    })
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
        <a onClick={ async () => await deleteQuestion(id, token)}>
          <p>Deletar</p>
        </a>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};