import React from 'react';

import { Color, ColorConverter } from '../types';
import ColorTile from './ColorTile';

import './ColorMatrix.css';
import { okhsv_to_srgb } from '../color';
import { roundTo2Decimals } from '../util/mathUtils';
import { rgb_to_hex } from '../color/general';

interface Props {
  /**
   * Placed on the horizontal axis
   */
  comparisonColors?: Color[];
  colors?: Color[];
}

const sRGBComponentToLinear = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ^ 2.4);

const relativeLuminance = (sRGB: Color) =>
  0.2126 * sRGBComponentToLinear(sRGB[0]) +
  0.7152 * sRGBComponentToLinear(sRGB[1]) +
  0.0722 * sRGBComponentToLinear(sRGB[2]);

const L_MAX = relativeLuminance([255, 255, 255]);

const getColorContrast = (a: Color, b: Color, toSRGB: ColorConverter) => {
  if (JSON.stringify(a) === JSON.stringify(b)) {
    return 1;
  }

  const La = relativeLuminance(toSRGB(a)) / L_MAX + 0.05;
  const Lb = relativeLuminance(toSRGB(b)) / L_MAX + 0.05;
  console.log(
    'a, b, aSRGB, bSRGB, La, Lb, La / Lb, Lb / La',
    a,
    b,
    rgb_to_hex(toSRGB(a)),
    rgb_to_hex(toSRGB(b)),
    La,
    Lb,
    La / Lb,
    Lb / La
  );

  return La / Lb < 1 ? Lb / La : La / Lb;
};

const mockComparisonColors: Color[] = [
  [0, 0, 1],
  [0, 0, 0.75],
  [0, 0, 0.5],
  [0, 0, 0.25],
  [0, 0, 0]
];

const mockColors: Color[] = [
  //[0, 0, 1],
  [0.452, 1, 0.552]
  //[0, 0, 0]
];

const ColorMatrix: React.FC<Props> = ({ comparisonColors = mockComparisonColors, colors = mockColors }) => (
  <table id="color-matrix">
    <thead>
      <tr className="color-matrix-header">
        <th />
        {comparisonColors.map((color, index) => (
          <th key={index}>
            <ColorTile color={color} />
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {colors.map((color, index) => (
        <tr key={index}>
          <td>
            <ColorTile color={color} />
          </td>
          {comparisonColors.map((ccol, cIndex) => (
            <td key={`${index}_${cIndex}`}>{roundTo2Decimals(getColorContrast(color, ccol, okhsv_to_srgb))}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default ColorMatrix;
