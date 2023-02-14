import React, { createContext, useContext, useMemo, useState } from 'react';

import { Color } from '../types';

interface ComparisonContext {
  comparisonColors: Color[];
  setComparisonColors: (colors: Color[]) => void;
}

const ComparisonColorContext = createContext<ComparisonContext>({
  comparisonColors: [],
  setComparisonColors: () => undefined
});

export const ComparisonColorProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [comparisonColors, setComparisonColors] = useState<Color[]>([
    [0, 0, 0],
    [0, 0, 0.5],
    [0, 0, 1]
  ]);

  const contextValue = useMemo(
    () => ({
      comparisonColors,
      setComparisonColors
    }),
    [comparisonColors, setComparisonColors]
  );

  return <ComparisonColorContext.Provider value={contextValue}>{children}</ComparisonColorContext.Provider>;
};

export const useComparisonColors = () => useContext(ComparisonColorContext);
