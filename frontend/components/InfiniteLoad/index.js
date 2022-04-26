import InfiniteScroll from "react-infinite-scroll-component";
import styles from '../../styles/components/InfiniteLoad.module.css';
import { GiFinishLine } from "react-icons/gi";


export function InfiniteLoad({ children, dataLength, next, hasMore, styleInfiniteLoad }) {
  return (
    <div id="scrollableDiv" className={styleInfiniteLoad ? styleInfiniteLoad : styles.container}>
      <InfiniteScroll
        dataLength={dataLength ? dataLength : 0}
        next={next}
        hasMore={hasMore}
        scrollableTarget="scrollableDiv"
        loader={
          <div className={styles.loadingArea}>
            <img src="./loading.gif" width={50} alt="carregando..." />
          </div>
        }
        endMessage={
          <div className={styles.loadingArea}>
            <GiFinishLine size={50} color="var(--text-color)" />
          </div>
        }
      >
        {children}
      </InfiniteScroll>
    </div>
  )
}