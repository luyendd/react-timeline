import React, { useCallback, useEffect, useState } from 'react';
import { IPathOption, PointPostion } from '../pages/components/BezierRoadLine';

// Hook customizations
// `useContainerDimensions` provides width and height for Ref Element.
export const useContainerDimensions = (myRef: React.RefObject<HTMLElement>) => {
  const getDimensions = useCallback(() => {
    return {
      width: myRef.current?.offsetWidth || 0,
      height: myRef.current?.offsetHeight || 0,
    };
  }, [myRef]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [myRef, getDimensions]);

  return dimensions;
};

// `clamp` clamps a given value to a specific range (inclusive, between min and max).
export const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

// `getOffset` provides element offset with window perspective.
export const getOffset = (el: Element): IElementRect => {
  const rect = el.getBoundingClientRect();
  return {
    height: rect.height,
    width: rect.width,
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
};

interface IElementRect {
  width: number;
  height: number;
  top: number;
  left: number;
}

const getElementXCordinate = (
  element: IElementRect,
  position: PointPostion = 'bottomCenter',
  strokeWidth: number,
  perimeter: number = strokeWidth * 1.25,
  isCenter: boolean = position.includes('Center')
) => {
  switch (position) {
    case 'topCenter':
    case 'bottomCenter':
      return element.left + (isCenter ? element.width / 2 : 0);
    case 'topLeft':
    case 'bottomLeft':
    case 'leftCenter':
      return element.left - perimeter;
    case 'topRight':
    case 'bottomRight':
    case 'rightCenter':
      return element.left + element.width + perimeter;
    default:
      return 0;
  }
};

const getElementYCordinate = (
  element: IElementRect,
  position: PointPostion = 'topCenter',
  strokeWidth: number,
  perimeter: number = strokeWidth * 1.25,
  isCenter: boolean = position.includes('Center')
) => {
  switch (position) {
    case 'leftCenter':
    case 'rightCenter':
      return (
        element.top +
        (isCenter ? element.height / 2 : 0) -
        perimeter / 2 +
        strokeWidth / 2
      );
    case 'topLeft':
    case 'topCenter':
    case 'topRight':
      return element.top - perimeter;
    case 'bottomLeft':
    case 'bottomCenter':
    case 'bottomRight':
      return element.top + element.height + perimeter;
    default:
      return 0;
  }
};

// If you read this, please upvote for this wonderful answer.
// https://stackoverflow.com/a/64934180/9217853
const drawCurve = (p: Array<number[]>, t: number = 2 / 10) => {
  var pc = controlPoints(p, t); // the control points array

  let d = '';

  // the first quadratic Bezier
  // because I'm using push(), pc[i][1] comes before pc[i][0]
  d += ` Q ${pc[1][1].x}, ${pc[1][1].y}, ${p[1][0]}, ${p[1][1]}`;

  if (p.length > 2) {
    // central curves are cubic Bezier
    for (var i = 1; i < p.length - 2; i++) {
      d += ` C ${pc[i][0].x}, ${pc[i][0].y} ${pc[i + 1][1].x}, ${
        pc[i + 1][1].y
      } ${p[i + 1][0]},${p[i + 1][1]}`;
    }
    // the last curve are quadratic Bezier
    let n = p.length - 1;
    d += ` Q ${pc[n - 1][0].x}, ${pc[n - 1][0].y}`;
  }
  return d;
};

const controlPoints = (p: Array<number[]>, t: number) => {
  // given the points array p calculate the control points
  let pc: Array<{ x: number; y: number }[]> = [];
  for (var i = 1; i < p.length - 1; i++) {
    let dx = p[i - 1][0] - p[i + 1][0]; // difference x
    let dy = p[i - 1][1] - p[i + 1][1]; // difference y
    // the first control point
    let x1 = p[i][0] - dx * t;
    let y1 = p[i][1] - dy * t;
    let o1 = {
      x: x1,
      y: y1,
    };

    // the second control point
    var x2 = p[i][0] + dx * t;
    var y2 = p[i][1] + dy * t;
    var o2 = {
      x: x2,
      y: y2,
    };

    // building the control points array
    pc[i] = [];
    pc[i].push(o1);
    pc[i].push(o2);
  }
  return pc;
};

// `generateBezierLine` generates curve line between two elements.
export const generateBezierLine = ({
  e1,
  e2,
  topGap,
  leftGap,
  strokeWidth,
  option = {},
  defaultCurvePoints = 3,
  cPsLength = option?.cPoints?.reduce(
    (prev, cur) => prev + (cur.length || 1),
    0
  ) || defaultCurvePoints + 1,
  defaultDistance,
  defaultOpposite = -1,
  enalbleOpposite = true,
}: {
  e1: IElementRect;
  e2: IElementRect;
  topGap: number;
  leftGap: number;
  strokeWidth: number;
  defaultCurvePoints?: number;
  cPsLength?: number;
  option?: IPathOption;
  defaultDistance?: number;
  defaultOpposite?: number;
  enalbleOpposite?: boolean;
}) => {
  const { start = {}, end = {}, cPoints = [], curvePointNumber } = option;
  // Get X and Y cordinates of start point
  const baseLeftStartX = start.leftGap != null ? start.leftGap : leftGap;
  const baseTopStartY = start.topGap != null ? start.topGap : topGap;
  const startPoint = {
    x: getElementXCordinate(e1, start.position, strokeWidth) + baseLeftStartX,
    y: getElementYCordinate(e1, start.position, strokeWidth) + baseTopStartY,
  };

  // Get X and Y cordinates of end point
  const baseLeftEndX = end.leftGap != null ? end.leftGap : leftGap;
  const baseTopEndY = end.topGap != null ? end.topGap : topGap;
  const endPoint = {
    x: getElementXCordinate(e2, end.position, strokeWidth) + baseLeftEndX,
    y: getElementYCordinate(e2, end.position, strokeWidth) + baseTopEndY,
  };

  // Get total curve point
  const totalCurves = curvePointNumber || defaultCurvePoints;
  let path = '';

  if (totalCurves === 0) {
    // The path has only two points so it's a line.
    path = 'L';
  } else if (totalCurves > 0) {
    // Create a path which goes through all points.
    const dx = endPoint.x - startPoint.x; // Δx
    const dy = endPoint.y - startPoint.y; // Δy
    // Vector Perpendicular with line D(start point, end point).
    const vPerpendicular = {
      x: dy,
      y: startPoint.x - endPoint.x,
    };
    // Default distance between curve points and line D.
    const distance =
      defaultDistance ||
      Math.max(Math.abs(dx) / cPsLength / 2, Math.abs(dy) / cPsLength / 2);

    const getCurvePoint = (x: number, y: number, index: number) => {
      const formulaConstant =
        (cPoints[index]?.distance ||
          distance /
            Math.sqrt(
              Math.pow(vPerpendicular.x, 2) + Math.pow(vPerpendicular.y, 2)
            )) * defaultOpposite;
      return [
        x + formulaConstant * vPerpendicular.x,
        y + formulaConstant * vPerpendicular.y,
      ];
    };

    const generateCurvePoints = () => {
      //add the first point.
      const result = [[startPoint.x, startPoint.y]];
      //save start point to calculate the next middle point.
      let preMP = result[0];
      //add the middle points
      //https://math.stackexchange.com/questions/995659/given-two-points-find-another-point-a-perpendicular-distance-away-from-the-midp
      for (let i = 0; i < totalCurves; i++) {
        const multiplyFactor = (cPoints[i]?.length || 1) / cPsLength;
        preMP = [
          preMP[0] + dx * multiplyFactor,
          preMP[1] + dy * multiplyFactor,
        ];

        // push curve point to draw latter.
        result.push(getCurvePoint(preMP[0], preMP[1], i));
        // if enable opposite then the next curve point will be opposite with previous one.
        if (!cPoints[i]?.opposite && enalbleOpposite)
          defaultOpposite = -defaultOpposite;
      }

      //add the last point
      result.push([endPoint.x, endPoint.y]);
      return result;
    };
    // draw curve based on generated point.
    path = drawCurve(generateCurvePoints());
  }

  return {
    startPoint: [startPoint.x, startPoint.y],
    path,
    endPoint: [endPoint.x, endPoint.y],
  };
};

export const countToZero = (
  callback: Function,
  value: number,
  duration: number
) => {
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    let t = elapsed / duration;
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    // Now t is a real number in from 0.0 to 1.0
    const currentValue = (1 - t) * value; // Goes from 1000.0 to 0.0
    callback(currentValue);
    if (elapsed < duration) {
      setTimeout(update, 1);
    }
  }
  update();
};
