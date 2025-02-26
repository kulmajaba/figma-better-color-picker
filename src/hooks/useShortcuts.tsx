import { useCallback, useEffect, useState } from 'react';

import { useAppState } from './useAppState';

const useShortcuts = () => {
  const [ctrlCmdDownDown, setCtrlCmdDown] = useState(false);
  const [shiftDown, setShiftDown] = useState(false);

  const { undo, redo } = useAppState();

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Meta':
          setCtrlCmdDown(true);
          break;
        case 'Control':
          setCtrlCmdDown(true);
          break;
        case 'Shift':
          setShiftDown(true);
          break;
        default:
          break;
      }

      if (e.code === 'KeyZ' && ctrlCmdDownDown && !shiftDown) {
        undo();
      } else if (e.code === 'KeyZ' && ctrlCmdDownDown && shiftDown) {
        redo();
      }
    },
    [ctrlCmdDownDown, shiftDown, undo, redo]
  );

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Meta':
        setCtrlCmdDown(false);
        break;
      case 'Control':
        setCtrlCmdDown(false);
        break;
      case 'Shift':
        setShiftDown(false);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyUp]);

  return null;
};

export default useShortcuts;
