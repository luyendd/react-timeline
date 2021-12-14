import React, { FunctionComponent, useMemo } from 'react';

/**
 * `getInterpolatedValue` provides a midpoint value
 * between y1 and y2, based on the ratio provided.
 *
 * @param {number} y1 - the value when our curve is
 *                      totally curvy
 * @param {number} y2 - the value when our curve is
 *                      totally flat
 * @param {number} x  - a value from 0 to 1 that
 *                      represents the ratio of curvy
 *                      to flat (0 = totally curvy,
 *                      1 = totally flat).
 */
const getInterpolatedValue = (y1: number, y2: number, x: number) => {
  // The slope of a line can be calculated as Δy / Δx.
  //
  // In this case, the domain of our function (AKA the
  // possible X values) are from 0 (x1) to 1 (x2).
  // Δx is therefore just equal to 1 (since 1 - 0 = 1).
  //
  // Because dividing by 1 has no effect, our slope in
  // this case can just be Δy.
  const a = y2 - y1;

  // Next, we know that y = ax + b.
  //
  // `b` is the Y-axis intercept, which we know is `y1`,
  // since `y1` is the `y` value when `x` is 0.
  return a * x + y1;
};

type Props = {
  strokeWidth: number;
  width: number;
  height: number;
};

const BezierRoadLine: FunctionComponent<Props> = ({
  strokeWidth,
  width,
  height,
}) => {
  const minValue = useMemo(() => strokeWidth / 2, [strokeWidth]);
  return (
    <svg width={width} height={height}>
      <path
        d={`M ${minValue},${minValue}
          C 240,350 
            432,-90 
            720,200
          `}
        stroke="#8b5cf6"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      ></path>
      Sorry, your browser does not support inline SVG.
    </svg>
  );
};
export default BezierRoadLine;
