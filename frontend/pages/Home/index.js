import Head from 'next/head';
import { useContext, useState, useEffect } from 'react';
import { FiClock, FiArrowDownRight } from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";
import { QuestionCard } from '../../components/QuestionCard';
import ReactLoading from 'react-loading';
import styles from '../../styles/pages/Home.module.css';
import { GlobalContext } from '../../context/GlobalContext';
import { getMostViewedQuestions, getOldestQuestions, getQuestions } from '../../services/requestsAPI/questions';
import { InfiniteLoad } from '../../components/InfiniteLoad';

export default function Home() {
  const [filter, setFilter] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const {
    questions,
    setQuestions,
    numberOfQuestionsTotal,
    setNumberOfQuestionsTotal,
    setNumberOfQuestionsNotAnswered
  } = useContext(GlobalContext)


  useEffect(async () => {
    if (questions === null) {
      await getMorePost();
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
    setPage(1); 

    if (filterNumber === 1) {
      result = await getQuestions(1);
    }
    else if (filterNumber === 2) {
      result = await getOldestQuestions(1);
    }
    else if (filterNumber === 3) {
      result = await getMostViewedQuestions(1);
    }
    setQuestions(result.questions);
  }


  const getMorePost = async () => {
    const response = await getQuestions(page + 1);
    console.log(response);

    const result = response?.questions;

    setNumberOfQuestionsTotal(response?.count);
    setPage(page + 1);
    if (result?.length === 0) {
      setHasMore(false);
    }
    else {
      if(questions === null) {
        setQuestions(result);
      }
      else {
        setQuestions([...questions, ...result]);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>UfesFórum</title>
      </Head>

      <div className={styles.filterArea}>
        <button className={filter === 1 ? styles.selected : {}} onClick={() => changeFilter(1)}>
          <FiClock size={18} color="#000" />
          <p>Recentes ({numberOfQuestionsTotal})</p>
        </button>
        <button className={filter === 2 ? styles.selected : {}} onClick={() => changeFilter(2)}>
          <FiArrowDownRight size={18} color="#000" />
          <p>Antigos ({numberOfQuestionsTotal})</p>
        </button>
        <button className={filter === 3 ? styles.selected : {}} onClick={() => changeFilter(3)}>
          <MdLocalFireDepartment size={18} color="#000" />
          <p>Vistos ({numberOfQuestionsTotal})</p>
        </button>
      </div>

      {
        questions !== null ?
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
          <div className={styles.loadingArea}>
            <ReactLoading type="spinningBubbles" color="gray" height={150} width={150} />
          </div>
      }
    </div>
  )
}