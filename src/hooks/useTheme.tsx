import { FC, createContext, useCallback, useContext, useMemo, useState } from 'react';

type Theme = {
  '--color-text': string;
};

const initialTheme: Theme = {
  '--color-text': '#ffffff'
};

interface ThemeContext {
  theme: Theme;
  updateTheme: () => void;
}

const ThemeContext = createContext<ThemeContext>({
  theme: initialTheme,
  updateTheme: () => undefined
});

export const ThemeProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(initialTheme);

  const updateTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = { ...prevTheme };
      (Object.keys(initialTheme) as Array<keyof Theme>).forEach((k) => {
        const newProp = getComputedStyle(document.documentElement).getPropertyValue(k).trim();
        newProp !== '' && (newTheme[k] = newProp);
      });

      return newTheme;
    });
  }, []);

  const contextValue = useMemo(() => {
    return {
      theme,
      updateTheme
    };
  }, [theme, updateTheme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
