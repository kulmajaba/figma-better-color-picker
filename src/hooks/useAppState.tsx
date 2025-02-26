import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { rgb_to_rgba, rgba_to_rgb } from '../color/general';
import { historySize } from '../constants';

import { ColorSpaceName, useColorSpace } from './useColorSpace';

import { Color, ColorWithAlpha, RowColor } from '../types';

type StateEntry = {
  colors: RowColor[];
  contrastColors: Color[];
  colorSpaceName: ColorSpaceName;
};

const logHistoryEntry = (entry: StateEntry) => {
  entry.colors.forEach((color) => {
    console.log(`${color.id}: ${color.color}`);
  });
};

const logHistory = (history: StateEntry[], index: number, message: string) => {
  console.log(`${message}, index: ${index}`);
  history.forEach(logHistoryEntry);
};

interface StateContext {
  history: StateEntry[];
  historyIndex: number;
  historyState: StateEntry | undefined;
  currentState: StateEntry;
  commitHistory: (state: StateEntry) => void;
  undo: () => void;
  redo: () => void;
  addColorRow: (color: ColorWithAlpha) => void;
  deleteColorRow: (id: number) => void;
  addContrastColor: (color: ColorWithAlpha) => void;
  deleteContrastColor: (index: number) => void;
}

const initialState: StateEntry = {
  colors: [{ id: 1, color: [0, 0, 0, 1] }],
  contrastColors: [[0, 0, 0]],
  colorSpaceName: 'okhsv'
};

const AppStateContext = createContext<StateContext>({
  history: [],
  historyIndex: -1,
  historyState: undefined,
  currentState: initialState,
  commitHistory: () => undefined,
  undo: () => undefined,
  redo: () => undefined,
  addColorRow: () => undefined,
  deleteColorRow: () => undefined,
  addContrastColor: () => undefined,
  deleteContrastColor: () => undefined
});

export const AppStateProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<StateEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentState, setCurrentState] = useState(initialState);

  const { convertFromPrevious } = useColorSpace();

  useEffect(() => {
    if (convertFromPrevious) {
      const convertedColors = currentState.colors.map((row) => ({
        ...row,
        color: rgb_to_rgba(convertFromPrevious(rgba_to_rgb(row.color)), row.color[3])
      }));

      setCurrentState({
        ...currentState,
        colors: convertedColors
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertFromPrevious]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      logHistory(history, historyIndex - 1, 'undo');
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      logHistory(history, historyIndex + 1, 'redo');
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history]);

  const commitHistory = useCallback(
    (state: StateEntry) => {
      // Clamp history size
      const startIndex = Math.max(0, historyIndex - historySize + 2);
      const newHistory = history.slice(startIndex, historyIndex + 1);
      newHistory.push(structuredClone(state));

      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      logHistory(newHistory, newHistory.length - 1, 'commit');
    },
    [history, historyIndex]
  );

  const addColorRow = useCallback(
    (color: ColorWithAlpha) => {
      const newState = structuredClone(currentState);
      newState.colors.push({
        id: newState.colors.length > 0 ? Math.max(...newState.colors.map((row) => row.id)) + 1 : 0,
        color
      });
    },
    [currentState]
  );

  const deleteColorRow = useCallback((id: number) => {
    setCurrentState((state) => {
      const newState = structuredClone(state);
      newState.colors = newState.colors.filter((row) => row.id !== id);
      return newState;
    });
  }, []);

  const addContrastColor = useCallback((color: ColorWithAlpha) => {
    setCurrentState((state) => {
      const newState = structuredClone(state);
      newState.contrastColors.push(rgba_to_rgb(color));
      return newState;
    });
  }, []);

  const deleteContrastColor = useCallback((index: number) => {
    setCurrentState((state) => {
      const newState = structuredClone(state);
      newState.contrastColors.splice(index, 1);
      return newState;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      history,
      historyIndex,
      historyState: historyIndex !== -1 ? history[historyIndex] : undefined,
      currentState,
      commitHistory,
      undo,
      redo,
      addColorRow,
      deleteColorRow,
      addContrastColor,
      deleteContrastColor
    }),
    [
      history,
      historyIndex,
      currentState,
      commitHistory,
      undo,
      redo,
      addColorRow,
      deleteColorRow,
      addContrastColor,
      deleteContrastColor
    ]
  );

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => useContext(AppStateContext);
