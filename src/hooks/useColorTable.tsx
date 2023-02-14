import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { Color } from '../types';

const ColorTableContext = createContext<{ [key: number]: Color }>({ 0: [0, 0, 0] });

interface SetterContext {
  setColors: (colors: Color[]) => void;
  addOrUpdateColor: (key: number, color: Color) => void;
  deleteColor: (key: number) => void;
}

const ColorTableSetterContext = createContext<SetterContext>({
  setColors: () => undefined,
  addOrUpdateColor: () => undefined,
  deleteColor: () => undefined
});

export const ColorTableProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<{ [key: number]: Color }>({ 0: [0, 0, 0] });

  const addOrUpdateColor = useCallback(
    (key: number, color: Color) => {
      setColors((prevColors) => {
        return {
          ...prevColors,
          [key]: color
        };
      });
    },
    [setColors]
  );

  const deleteColor = useCallback(
    (key: number) => {
      setColors((prevColors) => {
        const newColors = prevColors;
        delete newColors[key];
        return newColors;
      });
    },
    [setColors]
  );

  const setterContextValue = useMemo(() => {
    console.log('setter context changed');
    return {
      addOrUpdateColor,
      deleteColor,
      setColors
    };
  }, [setColors]);

  return (
    <ColorTableContext.Provider value={colors}>
      <ColorTableSetterContext.Provider value={setterContextValue}>{children}</ColorTableSetterContext.Provider>
    </ColorTableContext.Provider>
  );
};

export const useColorTable = () => useContext(ColorTableContext);

export const useColorTableSetter = () => useContext(ColorTableSetterContext);
