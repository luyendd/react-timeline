import type { NextPage } from 'next';
import { useRef } from 'react';
import BezierRoadLine from './components/BezierRoadLine';
import styles from '../styles/Home.module.css';
import { useContainerDimensions } from './ultils';

const Home: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerDimensions(ref);

  return (
    <div className={styles.container}>
      {new Array(10).fill('').map((value, index: number) => (
        <div style={{ width: '100%', height: 500 }} key={index}>
          {index}
        </div>
      ))}
      <div className="absolute right-5 left-5 top-0 bottom-0 -z-10" ref={ref}>
        <BezierRoadLine strokeWidth={12} width={width} height={height} />
      </div>
    </div>
  );
};

export default Home;
