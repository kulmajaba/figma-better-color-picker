import React, { useContext, createContext, useState } from 'react';

import { Color } from '../types';

type TableColor = { color: Color; alpha: number };

interface ColorState {
  mainColor: Color;
  mainAlpha: number;
  tableColors: TableColor[];
  comparisonColors: Color[];
  setMainColor: (color: Color) => void;
  setMainAlpha: (alpha: number) => void;
  setTableColors: (table: TableColor[]) => void;
  setComparisonColors: (colors: Color[]) => void;
}

const ColorStateContext = createContext<ColorState>({
  mainColor: [0, 0, 0],
  mainAlpha: 1,
  tableColors: [{ color: [0, 0, 0], alpha: 1 }],
  comparisonColors: [],
  setMainColor: () => undefined,
  setMainAlpha: () => undefined,
  setTableColors: () => undefined,
  setComparisonColors: () => undefined
});

export const ColorStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [mainColor, setMainColor] = useState<Color>([0, 0, 0]);
  const [mainAlpha, setMainAlpha] = useState(1);
  const [tableColors, setTableColors] = useState<TableColor[]>([{ color: [0, 0, 0], alpha: 1 }]);
  const [comparisonColors, setComparisonColors] = useState<Color[]>([]);

  return (
    <ColorStateContext.Provider
      value={{
        mainColor,
        mainAlpha,
        tableColors,
        comparisonColors,
        setMainColor,
        setMainAlpha,
        setTableColors,
        setComparisonColors
      }}
    >
      {children}
    </ColorStateContext.Provider>
  );
};

export const useColorState = () => useContext(ColorStateContext);
