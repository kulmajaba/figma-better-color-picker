import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { Color } from '../types';
import useIsPlugin from './useIsPlugin';

interface ComparisonContext {
  comparisonColors: Color[];
  comparisonColorsVisible: boolean;
  setComparisonColors: (colors: Color[]) => void;
  addComparisonColor: (color: Color) => void;
  deleteComparisonColor: (index: number) => void;
  toggleComparisonColorsVisible: () => void;
}

const ComparisonColorContext = createContext<ComparisonContext>({
  comparisonColors: [],
  comparisonColorsVisible: true,
  setComparisonColors: () => undefined,
  addComparisonColor: () => undefined,
  deleteComparisonColor: () => undefined,
  toggleComparisonColorsVisible: () => undefined
});

export const ComparisonColorProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [comparisonColors, setComparisonColors] = useState<Color[]>([]);

  const { isPlugin } = useIsPlugin();
  const [comparisonColorsVisible, setComparisonColorsVisible] = useState(!isPlugin);

  const addComparisonColor = useCallback((color: Color) => setComparisonColors((colors) => colors.concat([color])), []);

  const deleteComparisonColor = useCallback(
    (index: number) => setComparisonColors((colors) => colors.filter((_, i) => i !== index)),
    []
  );

  const toggleComparisonColorsVisible = useCallback(() => setComparisonColorsVisible((visible) => !visible), []);

  const contextValue = useMemo(
    () => ({
      comparisonColors,
      comparisonColorsVisible,
      setComparisonColors,
      addComparisonColor,
      deleteComparisonColor,
      toggleComparisonColorsVisible
    }),
    [
      comparisonColors,
      comparisonColorsVisible,
      setComparisonColors,
      addComparisonColor,
      deleteComparisonColor,
      toggleComparisonColorsVisible
    ]
  );

  return <ComparisonColorContext.Provider value={contextValue}>{children}</ComparisonColorContext.Provider>;
};

export const useComparisonColors = () => useContext(ComparisonColorContext);
