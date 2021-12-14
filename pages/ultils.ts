import React, { useCallback, useEffect, useState } from 'react';

//Hook customizations
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