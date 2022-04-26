import React, { useContext, useEffect } from 'react';
import Image from 'next/image';
import { FiLogIn, FiLogOut, FiPlusCircle } from "react-icons/fi";
import { useSession, signIn, signOut } from 'next-auth/client';
import styles from '../../styles/components/Header.module.css';
import Link from 'next/link';
import Hamburger from 'hamburger-react';
import { GlobalContext } from '../../context/GlobalContext';
import { loginUser } from '../../services/requestsAPI/users';

export function Header({children}) {
    const [session] = useSession();
    const {
        isOpen,
        setOpen,
        setToken,
    } = useContext(GlobalContext)

    useEffect( async () => {
        if(session) {
            const response = await loginUser(session.user.name, session.user.email, session.user.image);
            setToken(response.token);
            localStorage.setItem('token', response.token);
        }
      },[session])

    return (
        <>
            <div className={styles.container}>
                <div className={styles.imageUfes}>
                    <Image src="/logo.png" alt="Logo do Solares" height="50%" width="100%"/>    
                </div>
                <div className={styles.hamburgerIcon}>
                    <Hamburger toggled={isOpen} toggle={setOpen}/>
                </div>
                {session && 
                <>
                    <Link href="/CreateQuestion">
                        <div className={styles.button}>
                            <FiPlusCircle size={18} color="#FFFFFF"/> <p>Fazer pergunta</p>
                        </div>
                    </Link>
                    <div className={styles.login}> 
                        <Image src={session.user.image} width="50px" height="50px" alt="Imagem de perfil" className={styles.imagePerfil}/>
                        <div className={styles.dropdownContent}>
                            <Link href={`/Config`}>
                                <p>Configurações</p>
                            </Link>
                            <p onClick={() => signOut()} className={styles.sair}>Sair <FiLogOut size="1rem"/></p>
                        </div>
                    </div>
                </>
                }

                {!session && 
                    <div onClick={() => signIn("google")} className={styles.logout}>
                        <p>Entrar</p>
                        <FiLogIn color="var(--text-color)" size="1.2rem"/>
                    </div>} 
            </div>
            {children}
        </>
  );
}