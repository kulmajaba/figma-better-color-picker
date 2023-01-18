import React, { MouseEventHandler, useCallback } from 'react';

import { Color, ColorConverter, Direction, XY } from '../types';
import Picker from './Picker';
import PickerCanvas from './PickerCanvas';
import { createCheckerData } from '../util/imageData';
import { useColorSpace } from '../hooks/useColorSpace';

import './AlphaPicker.css';

const createAlphaData = (width: number, height: number, toSRGB: ColorConverter, color: Color, direction: Direction) => {
  const [sliderLength, sliderWidth] = direction === Direction.Horizontal ? [width, height] : [height, width];
  const [r, g, b] = toSRGB(color);

  const data = new Uint8ClampedArray(sliderLength * sliderWidth * 4);

  for (let i = 0; i < sliderLength; i++) {
    const alpha = Math.round((i / sliderLength) * 255);
    for (let j = 0; j < sliderWidth; j++) {
      const index = direction === Direction.Horizontal ? (j * sliderLength + i) * 4 : (i * sliderWidth + j) * 4;

      data[index + 0] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = alpha;
    }
  }

  return new ImageData(data, width);
};

const createHorizontalAlphaData = (width: number, height: number, toSRGB: ColorConverter, color: Color) =>
  createAlphaData(width, height, toSRGB, color, Direction.Horizontal);

interface Props {
  color: Color;
  value: number;
  globalValue: XY;
  dragging: boolean;
  onChange: (val: number) => void;
  onMouseDown: MouseEventHandler<HTMLElement>;
}

const AlphaPicker: React.FC<Props> = ({ color, value, onChange, ...otherProps }) => {
  const { toSRGB } = useColorSpace();
  const pickerValue = { x: value, y: 0.5 };

  const getAlphaData = useCallback(
    (width: number, height: number) => createHorizontalAlphaData(width, height, toSRGB, color),
    [toSRGB, color]
  );

  return (
    <div className="alpha-container">
      <PickerCanvas getImageData={(width, height) => createCheckerData(width, height)} />
      <Picker getImageData={getAlphaData} value={pickerValue} onChange={(val) => onChange(val.x)} {...otherProps} />
    </div>
  );
};

export default AlphaPicker;
