import styles from 'styles/Loading.module.css';
const Loading = () => {
  return (
    <div id="loadingComp" className={styles.loadingContainer}>
      <div className={`${styles.dash} ${styles.uno}`}></div>
      <div className={`${styles.dash} ${styles.dos}`}></div>
      <div className={`${styles.dash} ${styles.tres}`}></div>
      <div className={`${styles.dash} ${styles.cuatro}`}></div>
    </div>
  );
};

export default Loading;
