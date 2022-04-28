import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SimpleUserCard } from '../../components/UserCard';
import styles from '../../styles/pages/Users.module.css';

export default function Users(props){
    const [users, setUsers] = useState([]);

    // get the date createAt and convert to DD/MM/YYYY
    function formatDataCreatedAt(date){
        let dateCreatedAt = new Date(date);
        let dateFormatted = dateCreatedAt.getDate() + '/' + (dateCreatedAt.getMonth() + 1) + '/' + dateCreatedAt.getFullYear();
        return dateFormatted;
    }
        
        

    useEffect(() => {
        setUsers(props.users)
    },[])

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                { users.length > 0 && users.map((user, index) => (
                    <Link key={index} href={`/QuestionsByUser/${user.name}`}>
                        <a className={styles.userCard}>
                            <SimpleUserCard data={user}/>
                            <p>Desde: {formatDataCreatedAt(user.created)}</p>
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    )
}


export const getServerSideProps = async (context) => {
    let users = null

     // make a fetch call to your backend api here to get all users
    await fetch(`${process.env.API_URL}/users`)
        .then(res => res.json())
        .then(data => {
            users = data;
        })
        .catch(err => console.log(err))
    
    return {
        props: {
            users: users || []
        }
    }
}