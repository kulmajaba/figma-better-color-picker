import { useMemo } from 'react';

const useIsPlugin = () => {
  // TODO: Outer scope variables like window aren't valid deps for a hook because
  // mutating them does not re-render the component
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const isFigma = queryParams.get('figma') === 'true';

  const isPlugin = isFigma;

  const value = useMemo(
    () => ({
      isFigma,
      isPlugin
    }),
    [isFigma, isPlugin]
  );

  return value;
};

export default useIsPlugin;
