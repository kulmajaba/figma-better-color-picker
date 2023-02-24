import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import useIsPlugin from './useIsPlugin';

interface ComparisonContext {
  comparisonColorsVisible: boolean;
  toggleComparisonColorsVisible: () => void;
}

const ComparisonColorContext = createContext<ComparisonContext>({
  comparisonColorsVisible: true,
  toggleComparisonColorsVisible: () => undefined
});

export const ComparisonColorProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isPlugin } = useIsPlugin();
  const [comparisonColorsVisible, setComparisonColorsVisible] = useState(!isPlugin);

  const toggleComparisonColorsVisible = useCallback(() => setComparisonColorsVisible((visible) => !visible), []);

  const contextValue = useMemo(
    () => ({
      comparisonColorsVisible,
      toggleComparisonColorsVisible
    }),
    [comparisonColorsVisible, toggleComparisonColorsVisible]
  );

  return <ComparisonColorContext.Provider value={contextValue}>{children}</ComparisonColorContext.Provider>;
};

export const useComparisonColors = () => useContext(ComparisonColorContext);
