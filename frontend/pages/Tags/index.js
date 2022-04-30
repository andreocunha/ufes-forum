import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { EmptyData } from '../../components/EmptyData';
import styles from '../../styles/pages/Common.module.css';

export default function Tags(props){
    const [tags, setTags] = useState([]);

    useEffect(() => {
        setTags(props.tags)
    },[])

    return (
        <div className={styles.container}>
            <Head>
                <title>UfesFórum | Tags</title>
            </Head>
            <div className={styles.main}>
                { tags.length > 0 ?
                tags.map((tag, index) => (
                    <Link key={index} href={`/QuestionsByTag/${tag._id}`}>
                        <a className={styles.tag}>
                            <p>{tag._id}</p>
                            <p>{tag.qtd}</p>
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
    let tags = null

     // make a fetch call to your backend api here to get all tags
    await fetch(`${process.env.API_URL}/tags`)
        .then(res => res.json())
        .then(data => {
            tags = data;
        })
        .catch(err => console.log(err))
    
    return {
        props: {
            tags: tags || []
        }
    }
}