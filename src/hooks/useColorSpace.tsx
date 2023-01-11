import React, { useState, useContext, createContext, useCallback } from 'react';
import { hslvfloat_to_hslv, hslv_to_hslvfloat } from '../color/general';
import { okhsl_to_srgb, okhsv_to_srgb, srgb_to_okhsl, srgb_to_okhsv } from '../color/oklab';
import { ColorConverter } from '../types';

/**
 * Color spaces work with arrays of exactly three color components.
 * The first component of the space is rendered as the single slider control,
 * the second is rendered as the X axis of the 2-dimensional control
 * and the third as the Y axis.
 * All values should be in range 0..1
 */
interface ColorSpace {
  /**
   * Converts an sRGB color to a color space value
   */
  fromSRGB: ColorConverter;
  /**
   * Converts a color space color back to sRGB
   */
  toSRGB: ColorConverter;
  /**
   * Converts a color space color to the human-readable representation
   * e.g. HSV should return values in ranges: [0..360, 0..100, 0..100]
   * Floating point numbers are allowed
   */
  toComponentRepresentation: ColorConverter;
  /**
   * Converts a color from the human-readable representation to color space
   */
  fromComponentRepresentation: ColorConverter;
  /**
   * When generating the slider control for the first color component,
   * the second and third components (e.g. S and V for HSV) are set to these values
   */
  firstComponentSliderConstants: [number, number];
  /**
   * Visible in the color table header
   */
  componentShortNames: [string, string, string];
}

const OKHSV: ColorSpace = {
  fromSRGB: srgb_to_okhsv,
  toSRGB: okhsv_to_srgb,
  toComponentRepresentation: hslvfloat_to_hslv,
  fromComponentRepresentation: hslv_to_hslvfloat,
  firstComponentSliderConstants: [0.9, 0.9],
  componentShortNames: ['H', 'S', 'V']
};

const OKHSL: ColorSpace = {
  fromSRGB: srgb_to_okhsl,
  toSRGB: okhsl_to_srgb,
  toComponentRepresentation: hslvfloat_to_hslv,
  fromComponentRepresentation: hslv_to_hslvfloat,
  firstComponentSliderConstants: [1, 0.6],
  componentShortNames: ['H', 'S', 'L']
};

const colorSpaces = {
  OKHSV,
  OKHSL
};

type ColorSpaceName = keyof typeof colorSpaces;
type ColorSpaceSetter = (name: ColorSpaceName) => void;

export const colorSpaceNames = Object.keys(colorSpaces) as ColorSpaceName[];

interface SpaceContext extends ColorSpace {
  setColorSpace: ColorSpaceSetter;
  name: ColorSpaceName;
}

const ColorSpaceContext = createContext<SpaceContext>({
  ...colorSpaces.OKHSV,
  setColorSpace: () => undefined,
  name: 'OKHSV'
});

export const ColorSpaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorSpace, _setColorSpace] = useState(colorSpaces.OKHSV);
  const [colorSpaceName, setColorSpaceName] = useState<ColorSpaceName>('OKHSV');

  const setColorSpace: ColorSpaceSetter = useCallback((name: ColorSpaceName) => {
    _setColorSpace(colorSpaces[name]);
    setColorSpaceName(name);
  }, []);

  return (
    <ColorSpaceContext.Provider value={{ ...colorSpace, setColorSpace, name: colorSpaceName }}>
      {children}
    </ColorSpaceContext.Provider>
  );
};

export const useColorSpace = () => useContext(ColorSpaceContext);