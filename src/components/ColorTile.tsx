import { FC, useCallback } from 'react';

import { useColorSpace } from '../hooks/useColorSpace';
import { createCheckerData } from '../util/imageData';

import PickerCanvas from './Picker/PickerCanvas';

import { Color, ColorWithAlpha, isColorWithAlpha } from '../types';

import './ColorTile.css';

const createColorFill = (
  width: number,
  height: number,
  color: Color | ColorWithAlpha,
  toSRGB: (val: Color) => Color
) => {
  const [r, g, b] = toSRGB([color[0], color[1], color[2]]);
  const alpha = isColorWithAlpha(color) ? Math.round(color[3] * 255) : 1;
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
  color: Color | ColorWithAlpha;
}

const ColorTile: FC<Props> = ({ color }) => {
  const { toSRGB } = useColorSpace();

  const createFill = useCallback(
    (width: number, height: number) => createColorFill(width, height, color, toSRGB),
    [color, toSRGB]
  );

  return (
    <div className="ColorTile">
      {isColorWithAlpha(color) && <PickerCanvas getImageData={createCheckerData} />}
      <PickerCanvas getImageData={createFill} />
    </div>
  );
};

export default ColorTile;
