import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { generateBezierLine, getOffset, countToZero } from 'utils/common';

type Props = {
  strokeWidth: number;
  width: number;
  height: number;
  animationGap?: number;
  animationTime?: number;
  defaultDistance?: number;
  topGap?: number;
  leftGap?: number;
};

interface IGeneratePath {
  startPoint: Array<number>;
  endPoint: Array<number>;
  path: string;
}

export type PointPostion =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'leftCenter'
  | 'rightCenter';

export interface IOptionPoint {
  topGap?: number; //pixel
  leftGap?: number; //pixel
}
export interface IPointPath extends IOptionPoint {
  position?: PointPostion;
  perimeter?: number; //pixel
}

export interface IControlPoint extends IOptionPoint {
  t?: number; // 0 <= t <= 1 for the beautiful path
  length?: number;
  distance?: number; // pixel
  opposite?: boolean; // pixel
}

export interface IPathOption {
  start?: IPointPath;
  end?: IPointPath;
  cPoints?: Array<IControlPoint>;
  curvePointNumber?: number; // curve points number. Minimum is 2
  animationDelay?: number; // milisecond
  animationScrollGap?: number; // pixel
}

const pathOptions: Array<IPathOption> = [
  {
    start: {
      position: 'bottomLeft',
    },
    end: {
      position: 'topRight',
    },
  },
  {
    start: {
      position: 'bottomCenter',
    },
    end: {
      position: 'topCenter',
    },
  },
  {
    start: {
      position: 'bottomCenter',
    },
    end: {
      position: 'topCenter',
    },
  },
];

const END_ROAD_CIRCLE = `end-road`;

const BezierRoadLine: FunctionComponent<Props> = ({
  strokeWidth,
  width,
  height,
  animationGap = 150,
  animationTime = 600,
  defaultDistance = 100,
  topGap = 0,
  leftGap = 0,
}) => {
  const [paths, setPaths] = useState<Array<IGeneratePath> | null>(null);
  const ref = useRef<
    Array<{ position: number; target: Element; animated?: boolean }>
  >([]);

  useEffect(() => {
    function init() {
      //Get all elements which are need to use road lines.
      const totalElement = document.querySelectorAll(`[use-road-line="true"]`);
      //Create path array to store all generated paths. Each path must have a start position, a end position and at least two curve position in middle to make that path look good.
      const pathResult: Array<IGeneratePath> = [];
      //Set empty array to ref each time run init again.
      const tempRef = ref.current;
      ref.current = [];
      //Generate all paths for above elements.
      for (let index = 0; index < totalElement.length - 1; index++) {
        //Generate all positions by passing two elements.
        const generatePoints = generateBezierLine({
          e1: getOffset(totalElement[index]),
          e2: getOffset(totalElement[index + 1]),
          topGap,
          leftGap,
          strokeWidth,
          option: pathOptions[index],
          defaultDistance,
          // enalbleOpposite: false,
        });
        //Save that target and position to ref so that we can improve performance when users are scrolling.
        ref.current.push({
          target: totalElement[index],
          position: getOffset(totalElement[index]).top,
          animated: tempRef[index]?.animated,
        });
        //Save generated positions.
        pathResult.push({
          startPoint: generatePoints.startPoint,
          endPoint: generatePoints.endPoint,
          path: generatePoints.path,
        });
      }
      //Save last element position to ref because we don't run to last element at for above.
      ref.current.push({
        target: totalElement[totalElement.length - 1],
        position: getOffset(totalElement[totalElement.length - 1]).top,
        animated: tempRef[totalElement.length - 1]?.animated,
      });
      //Set path state.
      setPaths(pathResult);
    }
    //Run init road lines.
    init();
  }, [strokeWidth, width, height, defaultDistance, topGap, leftGap]);

  useEffect(() => {
    if (!paths) return;

    //Start path animation
    function startAnimation(currentElement: SVGPathElement, index: number) {
      startAppearAnimation(index + 1);
      //Set stroke-dashoffset attribute of path to zero in order to make path element appear
      countToZero(
        (value: number) => {
          currentElement.setAttribute('stroke-dashoffset', value.toString());
        },
        Number(currentElement.getAttribute('stroke-dasharray')),
        animationTime
      );
      //When path animation finishes, show end circle
      setTimeout(() => {
        const endRoadCircle: SVGCircleElement | null = document.querySelector(
          `#${END_ROAD_CIRCLE}-${index}`
        );
        if (endRoadCircle) {
          endRoadCircle.style.display = '';
        }
      }, animationTime);
      ref.current[index].animated = true;
    }
    //Start first appear animation
    function startAppearAnimation(index: number, delayTime = animationTime) {
      setTimeout(() => {
        animationElements[index]?.classList.add('fade-in-element');
        animationElements[index]?.classList.remove('first-appear');
      }, delayTime);
    }
    //Remove scroll event listener
    const removeScrollEventListener = () => {
      window.removeEventListener('scroll', handleScroll);
    };
    //Check if user reach all svg then remove scroll event listener
    function goToEndSvg(index: number) {
      if (index === ref.current.length - 2) {
        removeScrollEventListener();
      }
    }
    //Handle user scroll
    function handleScroll() {
      //Get current user view point
      const currentViewPoint =
        window.scrollY + window.innerHeight - animationGap;

      let currentElement: SVGPathElement | null = null;
      let currentIndex = -1;
      for (let index = 0; index < ref.current.length - 1; index++) {
        //Find element is on a view point at the moment
        if (currentViewPoint > ref.current[index].position) {
          currentElement = pathElements[index];
          currentIndex = index;
          goToEndSvg(index);
          //If that element haven't already animated, then animate path
          if (
            currentElement.getAttribute('stroke-dashoffset') !== '0' &&
            currentElement.getAttribute('stroke-dashoffset') ===
              currentElement.getAttribute('stroke-dasharray')
          ) {
            //Start path animation
            startAnimation(currentElement, currentIndex);
          }
        }
      }
    }
    //Get all path elements by querying use-road-path attribute
    const pathElements: NodeListOf<SVGPathElement> = document.querySelectorAll(
      `[use-road-path="true"]`
    );

    //Get all animation elements by querying class `first-appear`
    const animationElements: NodeListOf<Element> =
      document.querySelectorAll(`.first-appear`);
    //Get container element
    const containerElement: HTMLElement | null =
      document.querySelector('#bezierRoadLine');
    //Show all animation when prepations finish
    if (containerElement) {
      containerElement.style.opacity = '1';
    }

    //Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Init road path animation
    if (pathElements.length > 0) {
      //Show first appear element immediately with no delay
      startAppearAnimation(0, 0);
      pathElements.forEach((el: SVGPathElement, index) => {
        //Get total path's length in order to make path's animation
        const totalLength = el.getTotalLength().toString();
        const checkAnimated = ref.current[index].animated !== true;
        el.setAttribute('stroke-dasharray', totalLength);
        if (checkAnimated) {
          el.setAttribute('stroke-dashoffset', totalLength);
        }
        const currentViewPoint =
          window.scrollY + window.innerHeight - animationGap;
        //Start all above animation if user's on middle of page
        if (ref.current[index].position < currentViewPoint) {
          if (checkAnimated) startAnimation(el, index);
          goToEndSvg(index);
        }
      });
    }

    return () => {
      removeScrollEventListener();
    };
  }, [paths, animationGap, animationTime]);

  if (!paths) return <></>;

  return (
    <svg className='overflow-clip' width={width} height={height}>
      <path
        d={`M ${paths[0]?.startPoint} 
            ${paths[0]?.endPoint}
        `}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        fill='none'
        className='stroke-orange-500'
      ></path>
      {paths &&
        paths.map((path: IGeneratePath, index: number) => (
          <React.Fragment key={`path + ${index}`}>
            <path
              d={`M ${path.startPoint} ${path.path} ${path.endPoint}`}
              use-road-path='true'
              strokeWidth={strokeWidth}
              strokeLinecap='round'
              fill='none'
              className='stroke-neutral-500'
            ></path>
            <ellipse
              cx={path.startPoint[0]}
              cy={path.startPoint[1]}
              rx={strokeWidth * 1.25}
              ry={strokeWidth * 1.25}
              className='fill-blue-400'
            ></ellipse>
            <ellipse
              cx={path.endPoint[0]}
              cy={path.endPoint[1]}
              rx={strokeWidth * 1.25}
              ry={strokeWidth * 1.25}
              id={`${END_ROAD_CIRCLE}-${index}`}
              style={{ display: 'none' }}
              className='fill-blue-600'
            ></ellipse>
          </React.Fragment>
        ))}
      Sorry, your browser does not support inline SVG.
    </svg>
  );
};
export default BezierRoadLine;
