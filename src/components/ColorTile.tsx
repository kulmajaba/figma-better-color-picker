import { FC, useCallback } from 'react';

import { useColorSpace } from '../hooks/useColorSpace';
import { createCheckerData } from '../util/imageData';

import PickerCanvas from './Picker/PickerCanvas';

import { Color } from '../types';

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

const ColorTile: FC<Props> = ({ color, alpha }) => {
  const { toSRGB } = useColorSpace();

  const createFill = useCallback(
    (width: number, height: number) => createColorFill(width, height, color, alpha ?? 1, toSRGB),
    [color, alpha, toSRGB]
  );

  return (
    <div className="ColorTile">
      {alpha !== undefined && <PickerCanvas getImageData={createCheckerData} />}
      <PickerCanvas getImageData={createFill} />
    </div>
  );
};

export default ColorTile;
