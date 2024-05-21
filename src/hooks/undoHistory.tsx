import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { historySize } from '../constants';

import { ColorSpaceName } from './useColorSpace';

import { Color, RowColor } from '../types';

type HistoryEntry = {
  colors: RowColor[];
  contrastColors: Color[];
  colorSpaceName: ColorSpaceName;
};

export interface UndoHistory {
  history: HistoryEntry[];
  historyIndex: number;
  historyState: HistoryEntry | undefined;
}

interface HistoryContext extends UndoHistory {
  commitHistory: (colors: RowColor[], contrastColors: Color[], colorSpaceName: ColorSpaceName) => void;
}

const HistoryContext = createContext<HistoryContext>({
  history: [],
  historyIndex: -1,
  historyState: undefined,
  commitHistory: () => undefined
});

export const HistoryProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [undoModifierDown, setUndoModifierDown] = useState(false);
  const [redoModifierDown, setRedoModifierDown] = useState(false);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      console.log('keydown', e.code);
      switch (e.key) {
        case 'Meta':
          setUndoModifierDown(true);
          break;
        case 'Control':
          setUndoModifierDown(true);
          break;
        case 'Shift':
          setRedoModifierDown(true);
          break;
        default:
          break;
      }

      if (e.code === 'KeyZ' && undoModifierDown && !redoModifierDown) {
        undo();
      } else if (e.code === 'KeyZ' && undoModifierDown && redoModifierDown) {
        redo();
      }
    },
    [undoModifierDown, redoModifierDown, undo, redo]
  );

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    console.log('keyup', e.code);
    switch (e.key) {
      case 'Meta':
        setUndoModifierDown(false);
        break;
      case 'Control':
        setUndoModifierDown(false);
        break;
      case 'Shift':
        setRedoModifierDown(false);
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

  const commitHistory = useCallback(
    (colors: RowColor[], contrastColors: Color[], colorSpaceName: ColorSpaceName) => {
      // Clamp history size
      const startIndex = Math.max(0, historyIndex - historySize + 2);
      const newHistory = history.slice(startIndex, historyIndex + 1);
      newHistory.push({ colors, contrastColors, colorSpaceName });

      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const contextValue = useMemo(
    () => ({
      history,
      historyIndex,
      historyState: historyIndex !== -1 ? history[historyIndex] : undefined,
      commitHistory
    }),
    [history, historyIndex, commitHistory]
  );

  return <HistoryContext.Provider value={contextValue}>{children}</HistoryContext.Provider>;
};

export const useUndoHistory = () => useContext(HistoryContext);
