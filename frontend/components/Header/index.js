import React, { useContext, useEffect } from 'react';
import Image from 'next/image';
import { FiLogIn, FiLogOut, FiPlusCircle } from "react-icons/fi";
import { FaCode } from "react-icons/fa";
import { useSession, signIn, signOut } from 'next-auth/client';
import styles from '../../styles/components/Header.module.css';
import Link from 'next/link';
import Hamburger from 'hamburger-react';
import { GlobalContext } from '../../context/GlobalContext';
import { loginUser } from '../../services/requestsAPI/users';
import { PeopleOnlineCard } from '../PeopleOnlineCard';

export function Header({children}) {
    const [session] = useSession();
    const {
        isOpen,
        setOpen,
        setToken,
    } = useContext(GlobalContext)

    useEffect( async () => {
        if(session) {
            const response = await loginUser(session?.user?.name, session?.user?.email, session?.user?.image);
            setToken(response?.token);
            localStorage.setItem('token', response?.token);
            localStorage.setItem('user', JSON.stringify(session?.user));
        }
      },[session])

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken('');
        signOut();
    }

    return (
        <>
            <div className={styles.container}>
                <div 
                    className={styles.logo} 
                    onClick={() => window.location.href = '/'}
                >
                    <FaCode size={30} color="#1682FD" style={{ marginRight: 10 }}/>
                    <h4>UfesFórum</h4>
                </div>
                <div className={styles.hamburgerIcon}>
                    <Hamburger toggled={isOpen} toggle={setOpen}/>
                </div>
                <PeopleOnlineCard />
                {session && 
                <>
                    <Link href="/CreateQuestion">
                        <div className={styles.button}>
                            <FiPlusCircle size={18} color="#FFFFFF"/> <p>Fazer pergunta</p>
                        </div>
                    </Link>
                    <div className={styles.login}> 
                        <Image src={session?.user?.image} width="50px" height="50px" alt="Imagem de perfil" className={styles.imagePerfil}/>
                        <div className={styles.dropdownContent}>
                            <Link href={`/Config`}>
                                <p>Configurações</p>
                            </Link>
                            <p onClick={() => logout()} className={styles.sair}>Sair <FiLogOut size="1rem"/></p>
                        </div>
                    </div>
                </>
                }

                {!session && 
                    <div onClick={() => signIn("google")} className={styles.logout}>
                        <img src="/google.png" alt="Google" width="30px" height="30px"/>
                        <p>Login com Google</p>
                        {/* <FiLogIn color="var(--text-color)" size="1.2rem"/> */}
                    </div>} 
            </div>
            {children}
        </>
  );
}