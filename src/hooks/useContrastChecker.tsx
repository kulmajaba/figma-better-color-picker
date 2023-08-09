import { createContext, FC, useCallback, useContext, useMemo, useState } from 'react';

import useIsPlugin from './useIsPlugin';

interface CheckerContext {
  contrastCheckerVisible: boolean;
  toggleContrastCheckerVisible: () => void;
}

const ContrastCheckerContext = createContext<CheckerContext>({
  contrastCheckerVisible: true,
  toggleContrastCheckerVisible: () => undefined
});

export const ContrastCheckerProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isPlugin } = useIsPlugin();
  const [contrastCheckerVisible, setContrastCheckerVisible] = useState(!isPlugin);

  const toggleContrastCheckerVisible = useCallback(() => setContrastCheckerVisible((visible) => !visible), []);

  const contextValue = useMemo(
    () => ({
      contrastCheckerVisible,
      toggleContrastCheckerVisible
    }),
    [contrastCheckerVisible, toggleContrastCheckerVisible]
  );

  return <ContrastCheckerContext.Provider value={contextValue}>{children}</ContrastCheckerContext.Provider>;
};

export const useContrastChecker = () => useContext(ContrastCheckerContext);
