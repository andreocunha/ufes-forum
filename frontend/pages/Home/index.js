import Head from 'next/head';
import { useContext, useState, useEffect } from 'react';
import { FiClock, FiArrowDownRight } from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";
import { RiQuestionnaireLine } from "react-icons/ri";
import { QuestionCard } from '../../components/QuestionCard';
import ReactLoading from 'react-loading';
import styles from '../../styles/pages/Home.module.css';
import { GlobalContext } from '../../context/GlobalContext';
import { getMostViewedQuestions, getNotSolvedQuestions, getOldestQuestions, getQuestions } from '../../services/requestsAPI/questions';
import { InfiniteLoad } from '../../components/InfiniteLoad';
import { EmptyData } from '../../components/EmptyData';

export default function Home() {
  const [filter, setFilter] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    questions,
    setQuestions,
    numberOfQuestionsTotal,
    setNumberOfQuestionsTotal,
    pageQuestions,
    setPageQuestions,
  } = useContext(GlobalContext)


  useEffect(async () => {
    if (questions === null) {
      setIsLoading(true);
      await getMorePost();
      setIsLoading(false);
    }
  }, [])


  async function changeFilter(filterNumber){
    setFilter(filterNumber);
    // get the className .questionsArea and scroll to the top
    const questionsArea = document.getElementById('scrollableDiv');
    questionsArea?.scrollTo(0, 0);

    // wait to go to the top
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let result = [];
    setQuestions([]);
    setHasMore(true);
    setPageQuestions(1); 
    setNumberOfQuestionsTotal(0);

    if (filterNumber === 1) {
      result = await getQuestions(1);
    }
    else if (filterNumber === 2) {
      result = await getOldestQuestions(1);
    }
    else if (filterNumber === 3) {
      result = await getMostViewedQuestions(1);
    }
    else if (filterNumber === 4) {
      result = await getNotSolvedQuestions(1);
    }
    setQuestions(result?.questions || null);
    setNumberOfQuestionsTotal(result?.count || 0);
  }


  const getMorePost = async () => {
    const response = await getQuestions(pageQuestions + 1);

    // console.log(response);

    if (response === null) {
      return;
    }

    const result = response?.questions;

    if (result?.length === 0) {
      setHasMore(false);
    }
    else {
      setNumberOfQuestionsTotal(response?.count);
      setPageQuestions(pageQuestions + 1);

      if(questions === null) {
        setQuestions(result);
      }
      else {
        setQuestions([...questions, ...result]);
      }
    }
  };

  const Filter = () => {
    return (
      <div className={styles.filterArea}>
        <button className={filter === 1 ? styles.selected : {}} onClick={() => changeFilter(1)}>
          <FiClock size={18} color="#000" />
          <p>Recentes {filter === 1 && `(`+numberOfQuestionsTotal+`)`}</p>
        </button>
        <button className={filter === 2 ? styles.selected : {}} onClick={() => changeFilter(2)}>
          <FiArrowDownRight size={18} color="#000" />
          <p>Antigos {filter === 2 && `(`+numberOfQuestionsTotal+`)`}</p>
        </button>
        <button className={filter === 3 ? styles.selected : {}} onClick={() => changeFilter(3)}>
          <MdLocalFireDepartment size={18} color="#000" />
          <p>Mais vistos {filter === 3 && `(`+numberOfQuestionsTotal+`)`}</p>
        </button>
        <button className={filter === 4 ? styles.selected : {}} onClick={() => changeFilter(4)}>
          <RiQuestionnaireLine size={18} color="#000" />
          <p>Sem solução {filter === 4 && `(`+numberOfQuestionsTotal+`)`}</p>
        </button>
      </div>
    )
  }

  const LoadingPage = () => {
    return (
      <div className={styles.loadingArea}>
        <ReactLoading type="spinningBubbles" color="gray" height={150} width={150} />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>UfesFórum</title>
      </Head>

      <Filter />

      { isLoading && <LoadingPage />}

      {
        (questions !== null || questions?.length <= 0) ?
          <InfiniteLoad 
            dataLength={questions?.length}
            next={getMorePost}
            hasMore={hasMore}
          >
            {questions && questions?.map((question, index) => (
              <QuestionCard key={index} question={question} />
            ))}
          </InfiniteLoad>
          :
          <EmptyData />
      }
    </div>
  )
}