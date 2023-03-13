import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import strings from '../assets/strings';
import { rgba_to_hex, rgba_to_rgba_string, rgb_to_hex } from '../color/general';
import { ColorWithAlpha } from '../types';

export interface CopyFormat {
  label: string;
  /**
   * Takes an RGB color in array form and converts it to a copyable string
   * RGB values in range 0..255, alpha in range 0..1
   */
  toCopyFormat: (color: ColorWithAlpha) => string;
}

const hex: CopyFormat = {
  label: strings.color.hex,
  toCopyFormat: rgb_to_hex
};

const hexWithAlpha: CopyFormat = {
  label: strings.color.hexWithAlpha,
  toCopyFormat: rgba_to_hex
};

const rgba: CopyFormat = {
  label: strings.color.rgba,
  toCopyFormat: rgba_to_rgba_string
};

export const copyFormats = {
  hex,
  hexWithAlpha,
  rgba
};

export type CopyFormatName = keyof typeof copyFormats;
type CopyFormatSetter = (name: CopyFormatName) => void;

interface FormatContext extends CopyFormat {
  name: CopyFormatName;
  setCopyFormat: CopyFormatSetter;
}

const CopyFormatContext = createContext<FormatContext>({
  ...hex,
  name: 'hex',
  setCopyFormat: () => undefined
});

export const CopyFormatProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [copyFormat, _setCopyFormat] = useState(hex);
  const [copyFormatName, setCopyFormatName] = useState<CopyFormatName>('hex');

  const setCopyFormat = useCallback((name: CopyFormatName) => {
    _setCopyFormat(copyFormats[name]);
    setCopyFormatName(name);
  }, []);

  const contextValue = useMemo(
    () => ({
      ...copyFormat,
      name: copyFormatName,
      setCopyFormat
    }),
    [copyFormat, copyFormatName, setCopyFormat]
  );

  return <CopyFormatContext.Provider value={contextValue}>{children}</CopyFormatContext.Provider>;
};

export const useCopyFormat = () => useContext(CopyFormatContext);
