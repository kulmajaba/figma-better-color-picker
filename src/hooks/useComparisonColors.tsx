import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { Color } from '../types';

interface ComparisonContext {
  comparisonColors: Color[];
  setComparisonColors: (colors: Color[]) => void;
  addComparisonColor: (color: Color) => void;
  deleteComparisonColor: (index: number) => void;
}

const ComparisonColorContext = createContext<ComparisonContext>({
  comparisonColors: [],
  setComparisonColors: () => undefined,
  addComparisonColor: () => undefined,
  deleteComparisonColor: () => undefined
});

export const ComparisonColorProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [comparisonColors, setComparisonColors] = useState<Color[]>([]);

  const addComparisonColor = useCallback(
    (color: Color) => setComparisonColors((colors) => colors.concat([color])),
    [setComparisonColors]
  );

  const deleteComparisonColor = useCallback(
    (index: number) => setComparisonColors((colors) => colors.filter((_, i) => i !== index)),
    [setComparisonColors]
  );

  const contextValue = useMemo(
    () => ({
      comparisonColors,
      setComparisonColors,
      addComparisonColor,
      deleteComparisonColor
    }),
    [comparisonColors, setComparisonColors, addComparisonColor, deleteComparisonColor]
  );

  return <ComparisonColorContext.Provider value={contextValue}>{children}</ComparisonColorContext.Provider>;
};

export const useComparisonColors = () => useContext(ComparisonColorContext);
