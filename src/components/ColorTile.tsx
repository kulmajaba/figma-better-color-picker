import React from 'react';

import { useColorSpace } from '../hooks/useColorSpace';
import { Color } from '../types';
import { createCheckerData } from '../util/imageData';
import PickerCanvas from './PickerCanvas';

import './ColorTile.css';

const createColorFill = (width: number, height: number, color: Color, alpha: number, toSRGB: (val: Color) => Color) => {
  const [r, g, b] = toSRGB(color);
  alpha = Math.round(alpha * 255);
  const data = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const index = i * 4;
    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = alpha;
  }

  return new ImageData(data, width);
};

interface Props {
  color: Color;
  alpha?: number;
}

const ColorTile: React.FC<Props> = ({ color, alpha = 1 }) => {
  const { toSRGB } = useColorSpace();

  return (
    <div className="color-row-sample">
      <PickerCanvas getImageData={(width, height) => createCheckerData(width, height)} />
      <PickerCanvas getImageData={(width, height) => createColorFill(width, height, color, alpha, toSRGB)} />
    </div>
  );
};

export default ColorTile;
