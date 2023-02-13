import React from 'react';

import { Color } from '../types';
import ColorTile from './ColorTile';

import './ColorMatrix.css';
import { floorTo2Decimals } from '../util/mathUtils';
import { useColorSpace } from '../hooks/useColorSpace';
import { getColorContrast } from '../util/colorContrast';

interface Props {
  /**
   * Placed on the horizontal axis
   */
  comparisonColors?: Color[];
  /**
   * Colors from the current editor rows
   */
  colors?: Color[];
}

const mockComparisonColors: Color[] = [
  [0, 0, 1],
  [0, 0, 0.75],
  [0, 0, 0.5],
  [0, 0, 0.25],
  [0, 0, 0]
];

const mockColors: Color[] = [
  [0, 0, 1],
  [0.452, 1, 0.552],
  [0, 0, 0]
];

const ColorMatrix: React.FC<Props> = ({ comparisonColors = mockComparisonColors, colors = mockColors }) => {
  const { toSRGB } = useColorSpace();

  return (
    <table id="color-matrix">
      <thead>
        <tr className="color-matrix-header">
          <th />
          {comparisonColors.map((color, index) => (
            <th key={index}>
              <div className="color-tile-container">
                <ColorTile color={color} />
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {colors.map((color, index) => (
          <tr key={index}>
            <td>
              <div className="color-tile-container">
                <ColorTile color={color} />
              </div>
            </td>
            {comparisonColors.map((ccol, cIndex) => (
              <td key={`${index}_${cIndex}`}>{floorTo2Decimals(getColorContrast(color, ccol, toSRGB))} : 1</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ColorMatrix;
