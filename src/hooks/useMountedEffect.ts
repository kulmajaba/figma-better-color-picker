import { useEffect, useRef } from 'react';

const useMountedEffect = (effect: React.EffectCallback, deps?: React.DependencyList | undefined) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      return effect();
    }
    didMountRef.current = true;
  }, deps);
};

export default useMountedEffect;
