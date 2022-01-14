import type { NextPage } from 'next';
import { useRef } from 'react';
import styles from '../styles/Home.module.css';
import { useContainerDimensions } from 'utils/common';
import BezierRoadLine from '@/components/BezierRoadLine';

const Home: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerDimensions(ref);

  return (
    <div className={styles.container}>
      {new Array(12).fill('').map((value, index: number) => (
        <div
          key={index}
          style={{ height: 500 }}
          className='flex justify-center items-center'
        >
          <div className='w-fit first-appear max-w-screen-lg' use-road-line='true'>
            {index} f asdf jasdygfy asdugf asd df sdaf sadf asdf sdaf sdaf asf
            asdkfjh asdkfjh asdkjfh kasdjhf kasdjfh asdkj fhasdufg sd fds{' '}
            {index === 0 &&
              `f asdf jasdygfy asdugf asd df sdaf sadf asdf sdaf sdaf asf
            asdkfjh asdkfjh asdkjfh kasdjhf kasdjfh asdkj fhasdufg sd fds`}
          </div>
        </div>
      ))}
      <div
        id='bezierRoadLine'
        className='absolute inset-0 -z-10'
        ref={ref}
        style={{ opacity: 0 }}
      >
        <BezierRoadLine strokeWidth={4} width={width} height={height} />
      </div>
    </div>
  );
};

export default Home;
