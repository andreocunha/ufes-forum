import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes'
import DarkModeToggle from "react-dark-mode-toggle";
import styles from '../../styles/pages/Config.module.css'
import { CompleteUserCard } from '../../components/UserCard';
import { getSession } from "next-auth/client"
import Head from 'next/head';

export default function Config(props) {
    const { theme, setTheme } = useTheme()
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [user, setUser] = useState(null)

    function changeTheme(state) {
        setTheme(state ? 'dark' : 'light')
        setIsDarkMode(state)
    }

    useEffect(() => {
        
        setUser(props.userInfo)

        if (theme === 'dark') {
            setIsDarkMode(true)
        } else {
            setIsDarkMode(false)
        }
    }, [])

    return (
        <div className={styles.container}>
            <Head>
                <title>UfesFórum | Configurações</title>
            </Head>
            <div className={styles.theme}>
                <p>Tema Escuro: </p>
                <DarkModeToggle
                    onChange={changeTheme}
                    checked={isDarkMode}
                    size={80}
                />
            </div>
            { user && <CompleteUserCard data={user}/>}
        </div>
    )
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context);

    let user = null;
    if (session) {
        user = session.user;
    }

    let userInfo = null;

    // make a fetch call to your backend api here to get user info
    await fetch(`${process.env.API_URL}/users/${user?.name}`)
        .then(res => res.json())
        .then(data => {
            userInfo = data;
        })
        .catch(err => console.log(err))
    
    return {
        props: {
            userInfo: userInfo
        }
    }
}