import type { NextPage } from 'next';
import { useRef } from 'react';
import { useContainerDimensions } from 'utils/common';
import {useTheme} from 'next-themes'
import BezierRoadLine from 'components/BezierRoadLine';
import styles from 'styles/Home.module.css';

const Home: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerDimensions(ref);
  const {theme, setTheme} = useTheme()
  return (
    <div className={styles.container}>
      <h1 className='text-3xl text-pink-500'>
        Welcome to Your App
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        toggle
      </button>
      </h1>

      {new Array(12).fill('').map((value, index: number) => (
        <div
          key={index}
          style={{ height: 500 }}
          className='flex justify-center items-center'
        >
          <div
            className='w-fit first-appear max-w-screen-lg'
            use-road-line='true'
          >
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
