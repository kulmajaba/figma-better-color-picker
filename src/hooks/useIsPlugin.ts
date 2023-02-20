import { useMemo } from 'react';

const useIsPlugin = () => {
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), [window.location.search]);

  const isFigma = queryParams.get('figma') === 'true';

  const isPlugin = isFigma;

  const value = useMemo(
    () => ({
      isFigma,
      isPlugin
    }),
    [isFigma]
  );

  return value;
};

export default useIsPlugin;
