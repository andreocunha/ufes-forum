import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { EmptyData } from '../../components/EmptyData';
import { SimpleUserCard } from '../../components/UserCard';
import styles from '../../styles/pages/Users.module.css';

export default function Users(props){
    const [users, setUsers] = useState([]);

    // get the date createAt and convert to DD/MM/YYYY
    function formatDataCreatedAt(date){
        let dateCreatedAt = new Date(date);
        // format the date to DD/MM/YYYY 2 digits for day and month
        let day = dateCreatedAt.getDate() < 10 ? '0' + dateCreatedAt.getDate() : dateCreatedAt.getDate();
        let month = dateCreatedAt.getMonth() + 1 < 10 ? '0' + (dateCreatedAt.getMonth() + 1) : dateCreatedAt.getMonth() + 1;
        let year = dateCreatedAt.getFullYear();
        return `${day}/${month}/${year}`;
    }
        
    // function to search users by name or date created
    function searchUsers(e){
        let search = e.target.value;
        let users = props.users;
        let usersSearch = [];
        // if the search is empty, show all users
        if(search === ''){
            setUsers(users);
        }
        // if the search is not empty, search users by name or date created
        else{
            users.forEach(user => {
                if(user.name.toLowerCase().includes(search.toLowerCase()) || formatDataCreatedAt(user.created).includes(search)){
                    usersSearch.push(user);
                }
            });
            setUsers(usersSearch);
        }
    }

    useEffect(() => {
        setUsers(props.users)
    },[])

    return (
        <div className={styles.container}>
            <Head>
                <title>UfesFórum | Usuários</title>
            </Head>
            <div className={styles.main}>
                <div className={styles.search}>
                    <input type="text" placeholder="Pesquisar por nome ou data" onChange={searchUsers}/>
                    <h1>Total: {users?.length}</h1>
                </div>
                { users?.length > 0 ? 
                users?.map((user, index) => (
                    <Link key={index} href={`/QuestionsByUser/${user.name}`}>
                        <a className={styles.userCard}>
                            <SimpleUserCard data={user}/>
                            <p>Desde: {formatDataCreatedAt(user.created)}</p>
                        </a>
                    </Link>
                ))
                :
                <EmptyData />
            }
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