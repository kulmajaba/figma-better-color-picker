import { createContext, FC, useCallback, useContext, useMemo, useState } from 'react';

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
  undo: () => void;
  redo: () => void;
}

const HistoryContext = createContext<HistoryContext>({
  history: [],
  historyIndex: -1,
  historyState: undefined,
  commitHistory: () => undefined,
  undo: () => undefined,
  redo: () => undefined
});

export const HistoryProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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

  const contextValue = useMemo(
    () => ({
      history,
      historyIndex,
      historyState: historyIndex !== -1 ? history[historyIndex] : undefined,
      commitHistory,
      undo,
      redo
    }),
    [history, historyIndex, commitHistory, undo, redo]
  );

  return <HistoryContext.Provider value={contextValue}>{children}</HistoryContext.Provider>;
};

export const useUndoHistory = () => useContext(HistoryContext);
