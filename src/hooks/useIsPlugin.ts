const useIsPlugin = () => {
  const isFigma = new URLSearchParams(window.location.search).get('figma') === 'true';
  return isFigma;
};

export default useIsPlugin;
