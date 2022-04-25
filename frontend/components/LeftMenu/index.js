import Link from 'next/link';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from '../../styles/components/Menu.module.css';
import { FiList, FiTag, FiUser } from "react-icons/fi";
import { useSession } from 'next-auth/client';
import { SearchInput } from '../SearchInput';

export function LeftMenu() {
    const [session] = useSession();

    const {
        isOpen,
        setOpen,
    } = useContext(GlobalContext)

    const AllMenu = () => {
        return (
            <>
                <div className={styles.searchArea}>
                    <SearchInput />
                </div>

                <div className={styles.menuArea}>
                    <h3>MENU</h3>
                    <Link href="/">
                        <div className={styles.menuItem} onClick={() => setOpen(false)}>
                            <FiList size={18} color="var(--text-color)" />
                            <a>Questões</a>
                        </div>
                    </Link>
                    <Link href="/Tags">
                        <div className={styles.menuItem} onClick={() => setOpen(false)}>
                            <FiTag size={18} color="var(--text-color)" />
                            <a>Tags</a>
                        </div>
                    </Link>
                    <Link href="/Users">
                        <div className={styles.menuItem} onClick={() => setOpen(false)}>
                            <FiUser size={18} color="var(--text-color)" />
                            <a>Usuários</a>
                        </div>
                    </Link>
                </div>

                { session &&
                    <div className={styles.menuArea}>
                    <h3>NAVEGADOR PESSOAL</h3>
                    <Link href="/MyQuestions">
                        <div className={styles.menuItem} onClick={() => setOpen(false)}>
                            <FiList size={18} color="var(--text-color)" />
                            <a>Suas perguntas</a>
                        </div>
                    </Link>
                    <Link href="/MyAnswers">
                        <div className={styles.menuItem} onClick={() => setOpen(false)}>
                            <FiTag size={18} color="var(--text-color)" />
                            <a>Suas respostas</a>
                        </div>
                    </Link>
                </div>
                }
                
            </>
        )
    }

    return (
        <>
            {isOpen &&
                <div className={styles.container}>
                    <AllMenu />
                </div>
            }
            <div className={styles.container2}>
                <AllMenu />
            </div>
        </>
    )
}